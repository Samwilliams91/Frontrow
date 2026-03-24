/**
 * M365 Features Calculator — State Management & Scoring Logic
 *
 * Pure logic module. No DOM manipulation, no dependencies beyond
 * window.M365Data (provided by data.js).
 *
 * Exposed as window.M365Calculator.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'm365-calculator-state';

  /**
   * Build a blank state object with sensible defaults.
   */
  function createFreshState() {
    return {
      businessSize: null,       // e.g. "1-10", "11-50", "51-200", "200+"
      selectedTier: null,       // tier id string, e.g. "biz-premium"
      priorities: [],           // array of category ids, e.g. ["security","compliance"]
      featureStatuses: {}       // { "conditional-access": "using" | "heard-of" | "never-heard" }
    };
  }

  /**
   * Persist state to sessionStorage (best-effort — private browsing may throw).
   */
  function saveState(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Silently ignore — quota exceeded or private mode
    }
  }

  /**
   * Attempt to restore state from sessionStorage.
   * Returns null if nothing is stored or the data is corrupt.
   */
  function loadState() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      // Basic shape check
      if (
        parsed &&
        typeof parsed === 'object' &&
        Array.isArray(parsed.priorities) &&
        typeof parsed.featureStatuses === 'object'
      ) {
        return parsed;
      }
    } catch (e) {
      // Corrupt data — discard
    }
    return null;
  }

  /**
   * Return the features array from data.js.
   * Throws a helpful error if data.js hasn't loaded yet.
   */
  function allFeatures() {
    if (!window.M365Data || !Array.isArray(window.M365Data.features)) {
      throw new Error('M365Calculator: window.M365Data.features is not available. Make sure data.js is loaded before calculator.js.');
    }
    return window.M365Data.features;
  }

  /**
   * Return the categories array from data.js.
   */
  function allCategories() {
    if (!window.M365Data || !Array.isArray(window.M365Data.categories)) {
      throw new Error('M365Calculator: window.M365Data.categories is not available. Make sure data.js is loaded before calculator.js.');
    }
    return window.M365Data.categories;
  }

  // ---------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------

  var state = null;

  var M365Calculator = {

    /**
     * Initialise the calculator.
     * Restores from sessionStorage if available, otherwise creates fresh state.
     */
    init: function () {
      state = loadState() || createFreshState();
      return state;
    },

    /**
     * Update a single top-level key in state and persist.
     *
     * For nested updates (e.g. setting a single feature status) the caller
     * should pass the full updated object:
     *   calculator.setState('featureStatuses', { ...current, 'intune': 'using' })
     *
     * Or use the convenience method setFeatureStatus() below.
     */
    setState: function (key, value) {
      if (!state) this.init();
      state[key] = value;
      saveState(state);
      return state;
    },

    /**
     * Return the current state object (by reference — treat as read-only
     * outside this module and use setState to mutate).
     */
    getState: function () {
      if (!state) this.init();
      return state;
    },

    /**
     * Convenience: set a single feature's status without replacing the
     * entire featureStatuses object.
     */
    setFeatureStatus: function (featureId, status) {
      if (!state) this.init();
      state.featureStatuses[featureId] = status;
      saveState(state);
      return state;
    },

    /**
     * Return features available for a given tier.
     *
     * A feature is "available" if its tier value is "included" or "add-on"
     * (anything other than "not-available").
     *
     * @param {string} tierId   — e.g. "biz-premium"
     * @param {string} [categoryId] — optional category filter
     * @returns {Array} filtered feature objects
     */
    getFeaturesForTier: function (tierId, categoryId) {
      var features = allFeatures();

      var filtered = features.filter(function (f) {
        if (!f.tiers || !f.tiers[tierId]) return false;
        var tierValue = f.tiers[tierId];
        if (tierValue === 'not-available') return false;
        if (categoryId && f.category !== categoryId) return false;
        return true;
      });

      return filtered;
    },

    /**
     * Calculate results for the current state.
     *
     * Returns:
     * {
     *   total:      Number,   — features available in selected tier
     *   using:      Number,   — features marked "using"
     *   heardOf:    Number,   — features marked "heard-of"
     *   neverHeard: Number,   — features marked "never-heard"
     *   unmarked:   Number,   — features with no status set
     *   percentage: Number,   — utilisation percentage (0-100, rounded)
     *   categories: [
     *     {
     *       id:         String,
     *       name:       String,
     *       icon:       String,
     *       ctaText:    String,
     *       ctaLink:    String,
     *       total:      Number,
     *       using:      Number,
     *       heardOf:    Number,
     *       neverHeard: Number,
     *       percentage: Number,
     *       isPriority: Boolean,
     *       features:   Array   — the feature objects with a .status property attached
     *     }
     *   ]
     * }
     *
     * Categories are sorted so the user's priority picks come first,
     * then the rest in their default order. Empty categories (no
     * features for this tier) are excluded.
     */
    calculateResults: function () {
      if (!state) this.init();

      var tierId = state.selectedTier;
      if (!tierId) {
        return {
          total: 0,
          using: 0,
          heardOf: 0,
          neverHeard: 0,
          unmarked: 0,
          percentage: 0,
          categories: []
        };
      }

      var categories = allCategories();
      var priorities = state.priorities || [];
      var statuses = state.featureStatuses || {};

      var totalAll = 0;
      var usingAll = 0;
      var heardOfAll = 0;
      var neverHeardAll = 0;
      var unmarkedAll = 0;

      // Build per-category results
      var categoryResults = [];

      for (var c = 0; c < categories.length; c++) {
        var cat = categories[c];
        var features = this.getFeaturesForTier(tierId, cat.id);

        if (features.length === 0) continue;

        var catUsing = 0;
        var catHeardOf = 0;
        var catNeverHeard = 0;
        var catUnmarked = 0;

        // Attach resolved status to each feature for the UI
        var enrichedFeatures = features.map(function (f) {
          var s = statuses[f.id] || null;
          var copy = {};
          for (var k in f) {
            if (f.hasOwnProperty(k)) copy[k] = f[k];
          }
          copy.status = s;

          if (s === 'using') catUsing++;
          else if (s === 'heard-of') catHeardOf++;
          else if (s === 'never-heard') catNeverHeard++;
          else catUnmarked++;

          return copy;
        });

        var catTotal = features.length;
        var catPercentage = catTotal > 0 ? Math.round((catUsing / catTotal) * 100) : 0;

        totalAll += catTotal;
        usingAll += catUsing;
        heardOfAll += catHeardOf;
        neverHeardAll += catNeverHeard;
        unmarkedAll += catUnmarked;

        categoryResults.push({
          id: cat.id,
          name: cat.name,
          icon: cat.icon || '',
          ctaText: cat.ctaText || '',
          ctaLink: cat.ctaLink || '',
          total: catTotal,
          using: catUsing,
          heardOf: catHeardOf,
          neverHeard: catNeverHeard,
          percentage: catPercentage,
          isPriority: priorities.indexOf(cat.id) !== -1,
          features: enrichedFeatures
        });
      }

      // Sort: priority categories first (in the order user selected them),
      // then non-priority categories in their original data order.
      categoryResults.sort(function (a, b) {
        var aPri = priorities.indexOf(a.id);
        var bPri = priorities.indexOf(b.id);
        var aIsPri = aPri !== -1;
        var bIsPri = bPri !== -1;

        if (aIsPri && !bIsPri) return -1;
        if (!aIsPri && bIsPri) return 1;
        if (aIsPri && bIsPri) return aPri - bPri;
        // Both non-priority — keep original category order
        return 0;
      });

      var overallPercentage = totalAll > 0 ? Math.round((usingAll / totalAll) * 100) : 0;

      return {
        total: totalAll,
        using: usingAll,
        heardOf: heardOfAll,
        neverHeard: neverHeardAll,
        unmarked: unmarkedAll,
        percentage: overallPercentage,
        categories: categoryResults
      };
    },

    /**
     * Clear all state and remove from sessionStorage.
     */
    reset: function () {
      state = createFreshState();
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // Ignore
      }
      return state;
    }
  };

  window.M365Calculator = M365Calculator;
})();
