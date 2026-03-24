/**
 * M365 Features Calculator — UI Rendering & Interaction
 *
 * Handles all DOM rendering, screen transitions, SVG chart,
 * event delegation, and postMessage integration.
 *
 * Dependencies:
 *   - window.M365Data     (from data.js)  — LICENCE_TIERS, CATEGORIES, FEATURES
 *   - window.M365Calculator (from calculator.js) — state management & scoring
 *
 * Exposed as window.M365UI
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------
  // Shortcuts
  // ---------------------------------------------------------------

  var calc = null;   // set in init()
  var data = null;   // set in init()

  /** Convenience: current calculator state */
  function s() { return calc.getState(); }

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------

  /** Create a DOM element with optional classes and attributes */
  function el(tag, classNames, attrs) {
    var node = document.createElement(tag);
    if (classNames) node.className = classNames;
    if (attrs) {
      for (var k in attrs) {
        if (attrs.hasOwnProperty(k)) node.setAttribute(k, attrs[k]);
      }
    }
    return node;
  }

  /** Set inner HTML safely (we control all strings) */
  function html(node, str) {
    node.innerHTML = str;
    return node;
  }

  /** Detect if we're running inside an iframe */
  function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
  }

  /** Send current document height to parent for iframe resizing */
  function postHeight() {
    if (!isInIframe()) return;
    try {
      var h = document.documentElement.scrollHeight || document.body.scrollHeight;
      window.parent.postMessage({ type: 'm365-calculator-height', height: h }, '*');
    } catch (e) { /* cross-origin — ignore */ }
  }

  /** Open a URL — always open in new tab (works in iframe and standalone) */
  function openLink(url) {
    window.open(url, '_blank');
  }

  /** Get the main calculator container */
  function getContainer() {
    return document.getElementById('calculator');
  }

  /** Determine which step we should show based on state completeness */
  function inferCurrentStep() {
    var state = s();
    if (!state.businessSize) return 1;
    if (!state.selectedTier) return 2;
    if (!state.priorities || state.priorities.length === 0) return 3;
    // If they have statuses set for features, show results
    var hasStatuses = Object.keys(state.featureStatuses || {}).length > 0;
    if (hasStatuses) return 5; // results
    return 4;
  }

  /** Current step tracker */
  var currentStep = 1;

  // ---------------------------------------------------------------
  // Tier lookup helper — maps "not-sure" to "biz-standard"
  // ---------------------------------------------------------------

  function effectiveTier() {
    var tier = s().selectedTier;
    if (tier === 'not-sure') return 'biz-standard';
    return tier;
  }

  // ---------------------------------------------------------------
  // Progress Dots
  // ---------------------------------------------------------------

  function renderProgress(step) {
    var totalSteps = 4;
    var parts = [];
    for (var i = 1; i <= totalSteps; i++) {
      var cls = 'progress-step';
      if (i < step) cls += ' completed';
      if (i === step) cls += ' active';
      parts.push('<div class="' + cls + '" aria-label="Step ' + i + '"></div>');
      if (i < totalSteps) {
        var lineCls = 'progress-line';
        if (i < step) lineCls += ' completed';
        parts.push('<div class="' + lineCls + '"></div>');
      }
    }
    return '<div class="progress" role="navigation" aria-label="Progress">' + parts.join('') + '</div>';
  }

  // ---------------------------------------------------------------
  // Step Navigation
  // ---------------------------------------------------------------

  function renderNav(step, nextDisabled) {
    var parts = ['<div style="display:flex;justify-content:center;gap:1rem;padding-top:1.5rem;margin-top:1rem;border-top:1px solid #e5e7eb;">'];

    // Always show back button — disabled on step 1
    if (step > 1) {
      parts.push('<button class="btn btn-secondary btn-back" data-action="back" aria-label="Go back" style="min-width:120px;">' +
        '&#8592; Back</button>');
    } else {
      parts.push('<button class="btn btn-secondary btn-back" disabled style="min-width:120px;opacity:0.3;cursor:default;">' +
        '&#8592; Back</button>');
    }

    var disabledAttr = nextDisabled ? ' disabled' : '';
    var label = step === 4 ? 'Show My Results' : 'Next';
    parts.push('<button class="btn btn-primary btn-next" data-action="next"' +
      disabledAttr + ' style="min-width:120px;">' + label + ' &#8594;</button>');

    parts.push('</div>');
    return parts.join('');
  }

  // ---------------------------------------------------------------
  // Step 1 — Business Size
  // ---------------------------------------------------------------

  function renderStep1() {
    var state = s();
    var sizes = [
      { value: '1-10', number: '1–10', label: 'people' },
      { value: '11-50', number: '11–50', label: 'people' },
      { value: '51-200', number: '51–200', label: 'people' },
      { value: '200+', number: '200+', label: 'people' }
    ];

    var h = '';
    h += renderProgress(1);
    h += '<div style="text-align:center;margin-bottom:1.5rem;">';
    h += '<h1 style="text-align:center;">What\'s Hiding in Your Microsoft 365 Licence?</h1>';
    h += '<p class="subtitle" style="text-align:center;max-width:600px;margin:0 auto;">Most businesses use about 20% of what they\'re paying for. Let\'s find out what you\'re missing.</p>';
    h += '</div>';

    h += '<div class="step-content" style="text-align:center;">';
    h += '<h2 style="text-align:center;">How many people in your organisation?</h2>';
    h += '<div class="size-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;justify-items:center;">';

    for (var i = 0; i < sizes.length; i++) {
      var sz = sizes[i];
      var selected = state.businessSize === sz.value ? ' selected' : '';
      h += '<button class="size-btn' + selected + '" data-action="select-size" data-value="' +
        sz.value + '" role="radio" aria-checked="' + (selected ? 'true' : 'false') +
        '" tabindex="0">';
      h += '<span class="size-btn-number">' + sz.number + '</span>';
      h += '<span class="size-btn-label">' + sz.label + '</span>';
      h += '</button>';
    }

    h += '</div>'; // .size-grid
    h += '</div>'; // .step-content

    h += renderNav(1, !state.businessSize);

    return h;
  }

  // ---------------------------------------------------------------
  // Step 2 — Licence Tier Selection
  // ---------------------------------------------------------------

  function renderStep2() {
    var state = s();

    // Main tiers (not frontline)
    var tiers = data.licenceTiers ? data.licenceTiers : [];
    var mainTiers = [];
    var frontlineTiers = [];

    for (var i = 0; i < tiers.length; i++) {
      if (tiers[i].id === 'f1' || tiers[i].id === 'f3') {
        frontlineTiers.push(tiers[i]);
      } else {
        mainTiers.push(tiers[i]);
      }
    }

    var h = '';
    h += renderProgress(2);
    h += '<div style="text-align:center;margin-bottom:1.5rem;">';
    h += '<h1 style="text-align:center;">Which Microsoft 365 plan are you on?</h1>';
    h += '<p style="text-align:center;max-width:600px;margin:0 auto;">Pick the plan that best matches yours. Not sure? No worries — just pick your best guess.</p>';
    h += '</div>';

    h += '<div style="text-align:center;">';
    h += '<div class="licence-cards" role="radiogroup" aria-label="Select your Microsoft 365 plan">';

    // Render main tier cards
    for (var j = 0; j < mainTiers.length; j++) {
      h += renderLicenceCard(mainTiers[j], state.selectedTier);
    }

    // "I'm not sure" card
    var notSureSelected = state.selectedTier === 'not-sure' ? ' selected' : '';
    h += '<div class="licence-card not-sure' + notSureSelected + '" data-action="select-tier" data-value="not-sure" role="radio" aria-checked="' +
      (notSureSelected ? 'true' : 'false') + '" tabindex="0">';
    h += '<div class="licence-card-radio"></div>';
    h += '<div class="licence-card-info">';
    h += '<div class="licence-card-name">I\'m not sure</div>';
    h += '<div class="licence-card-price">We\'ll work with a common setup</div>';
    h += '</div>';
    h += '</div>';

    h += '</div>'; // .licence-cards

    // "I'm not sure" helper text
    var helperVisible = state.selectedTier === 'not-sure' ? ' visible' : '';
    h += '<div class="licence-helper' + helperVisible + '" id="licence-helper">';
    h += 'If you use desktop Word, Excel, and Outlook, you\'re likely on Business Standard or above. ';
    h += 'Pick your best guess — we can sort out the details later.';
    h += '</div>';

    // Frontline toggle
    h += '<div class="frontline-toggle">';
    var frontlineOpen = (state.selectedTier === 'f1' || state.selectedTier === 'f3');
    h += '<button class="frontline-trigger' + (frontlineOpen ? ' open' : '') + '" data-action="toggle-frontline" aria-expanded="' +
      (frontlineOpen ? 'true' : 'false') + '">';
    h += '<span class="frontline-trigger-icon">&#9654;</span> Frontline / shift workers?';
    h += '</button>';
    h += '<div class="frontline-cards' + (frontlineOpen ? ' visible' : '') + '">';

    for (var k = 0; k < frontlineTiers.length; k++) {
      h += renderLicenceCard(frontlineTiers[k], state.selectedTier);
    }

    h += '</div>'; // .frontline-cards
    h += '</div>'; // .frontline-toggle

    h += '</div>'; // .step-content

    h += renderNav(2, !state.selectedTier);

    return h;
  }

  /** Render a single licence card */
  function renderLicenceCard(tier, selectedTier) {
    var selected = selectedTier === tier.id ? ' selected' : '';
    var p = tier.priceAUD || tier.price || 0;
    var priceText = p ? ('~$' + p.toFixed(2) + '/user/mo') : '';

    var h = '<div class="licence-card' + selected + '" data-action="select-tier" data-value="' +
      tier.id + '" role="radio" aria-checked="' + (selected ? 'true' : 'false') + '" tabindex="0">';
    h += '<div class="licence-card-radio"></div>';
    h += '<div class="licence-card-info">';
    h += '<div class="licence-card-name">' + tier.name + '</div>';
    if (priceText) {
      h += '<div class="licence-card-price">' + priceText + '</div>';
    }
    h += '</div>';
    h += '</div>';
    return h;
  }

  // ---------------------------------------------------------------
  // Step 3 — Priority Selection
  // ---------------------------------------------------------------

  function renderStep3() {
    var state = s();
    var categories = data.categories || [];

    var h = '';
    h += renderProgress(3);
    h += '<div style="text-align:center;margin-bottom:1.5rem;">';
    h += '<h1 style="text-align:center;">What matters most to your business right now?</h1>';
    h += '<p style="text-align:center;max-width:600px;margin:0 auto;">Pick as many as you like — we\'ll focus on these areas first in your results.</p>';
    h += '</div>';

    h += '<div style="text-align:center;">';
    h += '<div class="priority-pills" role="group" aria-label="Select your priorities">';

    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      var isSelected = state.priorities.indexOf(cat.id) !== -1;
      var cls = 'priority-pill' + (isSelected ? ' selected' : '');

      h += '<button class="' + cls + '" data-action="toggle-priority" data-value="' +
        cat.id + '" role="checkbox" aria-checked="' + (isSelected ? 'true' : 'false') +
        '" tabindex="0">';
      h += '<span class="priority-pill-icon">' + (cat.icon || '') + '</span>';
      h += '<span>' + cat.name + '</span>';
      h += '</button>';
    }

    h += '</div>'; // .priority-pills

    h += '<p style="text-align:center;margin-top:1rem;color:#6b7280;font-size:0.875rem;">Select at least one to continue</p>';
    h += '</div>'; // .step-content

    h += renderNav(3, state.priorities.length === 0);

    return h;
  }

  // ---------------------------------------------------------------
  // Step 4 — Feature Check
  // ---------------------------------------------------------------

  function renderStep4() {
    var state = s();
    var tierId = effectiveTier();
    var categories = data.categories || [];
    var priorities = state.priorities || [];

    // Get all features for this tier, grouped by category
    var catGroups = [];
    var totalFeatures = 0;

    for (var c = 0; c < categories.length; c++) {
      var cat = categories[c];
      var features = calc.getFeaturesForTier(tierId, cat.id);
      if (features.length === 0) continue;

      totalFeatures += features.length;
      catGroups.push({
        category: cat,
        features: features,
        isPriority: priorities.indexOf(cat.id) !== -1
      });
    }

    // Sort: priority categories first
    catGroups.sort(function (a, b) {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return 0;
    });

    var h = '';
    h += renderProgress(4);
    h += '<div style="text-align:center;margin-bottom:1.5rem;">';
    h += '<h1 style="text-align:center;">Let\'s see what you know</h1>';
    h += '<p style="text-align:center;max-width:600px;margin:0 auto;">For each feature, tell us whether you\'re already using it, have heard of it, or have never come across it.</p>';
    h += '</div>';

    h += '<div style="text-align:center;">';

    // Feature check header
    h += '<div class="feature-check-header">';
    h += '<span class="feature-count">' + totalFeatures + ' features to review</span>';
    h += '<button class="skip-link" data-action="skip-features">Skip this step — show me everything</button>';
    h += '</div>';

    // Category groups
    for (var g = 0; g < catGroups.length; g++) {
      var group = catGroups[g];
      var expanded = group.isPriority ? ' expanded' : '';

      h += '<div class="feature-category' + expanded + '" data-category="' + group.category.id + '">';

      // Category header (expand/collapse trigger)
      h += '<button class="feature-category-header" data-action="toggle-category" data-category="' +
        group.category.id + '" aria-expanded="' + (group.isPriority ? 'true' : 'false') + '">';
      h += '<span>';
      h += '<span class="feature-category-icon">' + (group.category.icon || '') + '</span>';
      h += group.category.name;
      h += '</span>';
      h += '<span class="feature-category-count">' + group.features.length + ' features</span>';
      h += '<span class="feature-category-chevron">&#9660;</span>';
      h += '</button>';

      // Category body — feature rows
      h += '<div class="feature-category-body">';

      for (var f = 0; f < group.features.length; f++) {
        var feat = group.features[f];
        var status = state.featureStatuses[feat.id] || 'heard-of'; // default to heard-of

        h += '<div class="feature-row" data-feature="' + feat.id + '">';

        // Feature info
        h += '<div class="feature-row-info">';
        h += '<div class="feature-row-name">' + feat.name + '</div>';
        h += '<div class="feature-row-description">' + (feat.friendlyName || '') + '</div>';
        h += '</div>';

        // 3-state toggle buttons
        h += '<div class="status-toggles" role="radiogroup" aria-label="Usage status for ' + feat.name + '">';

        h += '<button class="status-toggle never' + (status === 'never-heard' ? ' active' : '') +
          '" data-action="set-status" data-feature="' + feat.id + '" data-status="never-heard"' +
          ' aria-label="Never heard of it" title="Never heard of it">?</button>';

        h += '<button class="status-toggle heard' + (status === 'heard-of' ? ' active' : '') +
          '" data-action="set-status" data-feature="' + feat.id + '" data-status="heard-of"' +
          ' aria-label="Heard of it" title="Heard of it">~</button>';

        h += '<button class="status-toggle using' + (status === 'using' ? ' active' : '') +
          '" data-action="set-status" data-feature="' + feat.id + '" data-status="using"' +
          ' aria-label="Using it" title="Using it">&#10003;</button>';

        h += '</div>'; // .status-toggles

        h += '</div>'; // .feature-row
      }

      h += '</div>'; // .feature-category-body
      h += '</div>'; // .feature-category
    }

    h += '</div>'; // .step-content

    h += renderNav(4, false);

    return h;
  }

  // ---------------------------------------------------------------
  // Results Screen
  // ---------------------------------------------------------------

  function renderResults() {
    var results = calc.calculateResults();
    var state = s();
    var tierId = effectiveTier();

    // Find tier name
    var tierName = 'your plan';
    var tiers = data.licenceTiers || [];
    for (var t = 0; t < tiers.length; t++) {
      if (tiers[t].id === tierId) { tierName = tiers[t].name; break; }
    }
    if (state.selectedTier === 'not-sure') {
      tierName = 'Microsoft 365 (estimated)';
    }

    var h = '';

    // Combined summary with donut chart — compact layout
    h += '<div class="results-summary" style="display:flex;align-items:center;justify-content:center;gap:2rem;flex-wrap:wrap;">';
    h += '<div style="flex-shrink:0;">';
    h += renderDonutChart(results.percentage);
    h += '</div>';
    h += '<div style="text-align:center;max-width:400px;">';
    h += '<p class="results-summary-text" style="margin:0;">';
    h += 'You have access to <strong>' + results.total + ' features</strong> with ' + tierName + '. ';
    h += 'You\'re using <strong>' + results.using + '</strong>. ';

    if (results.percentage < 30) {
      h += 'There\'s a lot of untapped value in your licence.';
    } else if (results.percentage < 60) {
      h += 'You\'re getting some value, but there\'s room to get more from what you\'re already paying for.';
    } else {
      h += 'You\'re making solid use of your licence. Let\'s see where the gaps are.';
    }

    h += '</p>';
    h += '</div>';
    h += '</div>'; // .results-summary

    // Category breakdowns
    h += '<div class="category-breakdown">';
    h += '<h2 style="text-align:center;">Breakdown by Category</h2>';

    for (var c = 0; c < results.categories.length; c++) {
      var cat = results.categories[c];

      h += '<div class="category-card" data-category="' + cat.id + '">';

      // Header
      h += '<div class="category-card-header">';
      h += '<div class="category-card-name">';
      h += '<span>' + cat.icon + '</span>';
      h += '<span>' + cat.name + '</span>';
      if (cat.isPriority) {
        h += ' <span class="badge badge-included" style="font-size:0.65rem;padding:2px 8px;">Priority</span>';
      }
      h += '</div>';
      h += '<div class="category-card-stat">' + cat.using + ' of ' + cat.total + ' active (' + cat.percentage + '%)</div>';
      h += '</div>';

      // Progress bar
      var barClass = 'progress-bar-fill';
      if (cat.percentage < 30) barClass += ' low';
      else if (cat.percentage < 60) barClass += ' medium';
      else barClass += ' high';

      h += '<div class="progress-bar">';
      h += '<div class="' + barClass + '" style="width:' + cat.percentage + '%" role="progressbar" aria-valuenow="' +
        cat.percentage + '" aria-valuemin="0" aria-valuemax="100"></div>';
      h += '</div>';

      // Feature details — collapsed by default, click category to expand
      h += '<div class="category-features-toggle">';
      h += '<button data-action="toggle-category-results" data-category="' + cat.id + '" class="feature-expand-trigger" aria-expanded="false">';
      h += 'Show ' + cat.total + ' features <span class="feature-expand-trigger-icon">&#9660;</span>';
      h += '</button>';
      h += '</div>';
      h += '<div class="category-features-body" id="cat-results-' + cat.id + '" style="display:none;">';

      // Feature cards within this category
      for (var f = 0; f < cat.features.length; f++) {
        var feat = cat.features[f];
        var tierValue = feat.tiers ? feat.tiers[tierId] : 'included';

        h += '<div class="feature-card" data-feature="' + feat.id + '">';
        h += '<div class="feature-card-top">';

        // Left side: name + description
        h += '<div>';
        h += '<div class="feature-card-name">' + feat.name + '</div>';
        h += '<div class="feature-card-description">' + (feat.friendlyName || '') + '</div>';

        // Usage indicator
        var usageDotClass = 'usage-dot';
        var usageLabel = 'Not set';
        if (feat.status === 'using') { usageDotClass += ' using'; usageLabel = 'Using it'; }
        else if (feat.status === 'heard-of') { usageDotClass += ' heard'; usageLabel = 'Heard of it'; }
        else if (feat.status === 'never-heard') { usageDotClass += ' never'; usageLabel = 'Never heard of it'; }

        h += '<div class="usage-indicator">';
        h += '<span class="' + usageDotClass + '"></span>';
        h += '<span>' + usageLabel + '</span>';
        h += '</div>';

        h += '</div>'; // left side

        // Right side: badge
        if (tierValue === 'included') {
          h += '<span class="badge badge-included">Included</span>';
        } else if (tierValue === 'add-on') {
          h += '<span class="badge badge-addon">Add-on</span>';
        }

        h += '</div>'; // .feature-card-top

        // Expandable description
        if (feat.businessImpact || feat.description) {
          h += '<div class="feature-expand">';
          h += '<button class="feature-expand-trigger" data-action="toggle-expand" data-feature="' +
            feat.id + '" aria-expanded="false">';
          h += 'What this means for you <span class="feature-expand-trigger-icon">&#9660;</span>';
          h += '</button>';
          h += '<div class="feature-expand-body" id="expand-' + feat.id + '">';
          h += (feat.businessImpact || feat.description || '');
          h += '</div>';
          h += '</div>'; // .feature-expand
        }

        h += '</div>'; // .feature-card
      }

      // Micro-CTA for this category
      if (cat.ctaText) {
        h += '<div class="category-cta">';
        h += '<div class="category-cta-text">' + cat.ctaText + '</div>';
        h += '<a href="' + (cat.ctaLink || 'https://frontrow.technology/contact') +
          '" class="category-cta-link" data-action="cta-link" data-url="' +
          (cat.ctaLink || 'https://frontrow.technology/contact') + '">Talk to us &rarr;</a>';
        h += '</div>';
      }

      h += '</div>'; // .category-features-body
      h += '</div>'; // .category-card
    }

    h += '</div>'; // .category-breakdown

    // Final CTA block
    h += '<div style="text-align:center;padding:2rem 0;">';
    h += '<h2 style="text-align:center;">Ready to get more from what you\'re paying for?</h2>';
    h += '<p style="text-align:center;max-width:500px;margin:0 auto 1.5rem;">We help Australian businesses actually use what\'s in their Microsoft 365 licence. No upsell, just setup.</p>';
    h += '<div style="display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;">';
    h += '<a href="https://frontrow.technology/contact" class="btn btn-primary" data-action="cta-link" data-url="https://frontrow.technology/contact" target="_blank">';
    h += 'Book a Free 30-Minute Assessment';
    h += '</a>';
    h += '<button class="btn btn-secondary" data-action="restart">';
    h += 'Start Again';
    h += '</button>';
    h += '</div>';
    h += '</div>';

    // Disclaimer
    h += '<p style="text-align:center;font-size:0.75rem;color:#9ca3af;margin-top:2rem;">Prices current as of March 2026, ex-GST. Feature availability may vary. ' +
      'Check <a href="https://www.microsoft.com/en-au/microsoft-365/business/compare-all-plans" target="_blank" rel="noopener">Microsoft\'s site</a> for the latest.</p>';

    return h;
  }

  // ---------------------------------------------------------------
  // SVG Donut Chart
  // ---------------------------------------------------------------

  /**
   * Render an SVG ring chart showing utilisation percentage.
   *
   * Uses a circle with stroke-dasharray/dashoffset for the animated fill.
   * The ring has a radius of 90 in a 220x220 viewbox, giving a circumference
   * of ~565.49. We offset the stroke to show the correct percentage.
   *
   * @param {number} percentage — 0-100
   * @returns {string} SVG markup
   */
  function renderDonutChart(percentage) {
    var size = 220;
    var strokeWidth = 24;
    var radius = (size - strokeWidth) / 2; // 98
    var circumference = 2 * Math.PI * radius;
    var filled = (percentage / 100) * circumference;
    var gap = circumference - filled;

    // Clamp percentage for display
    var displayPct = Math.max(0, Math.min(100, Math.round(percentage)));

    var svg = '';
    svg += '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" ' +
      'role="img" aria-label="Donut chart showing ' + displayPct + '% utilisation">';

    // Background ring (untapped — light grey)
    svg += '<circle cx="' + (size / 2) + '" cy="' + (size / 2) + '" r="' + radius + '" ' +
      'fill="none" stroke="var(--color-grey-200)" stroke-width="' + strokeWidth + '"/>';

    // Foreground ring (using — accent blue)
    // Rotate -90deg so it starts from the top
    if (percentage > 0) {
      svg += '<circle cx="' + (size / 2) + '" cy="' + (size / 2) + '" r="' + radius + '" ' +
        'fill="none" stroke="var(--color-accent)" stroke-width="' + strokeWidth + '" ' +
        'stroke-dasharray="' + filled.toFixed(2) + ' ' + gap.toFixed(2) + '" ' +
        'stroke-dashoffset="0" ' +
        'stroke-linecap="round" ' +
        'transform="rotate(-90 ' + (size / 2) + ' ' + (size / 2) + ')" ' +
        'class="donut-fill" ' +
        'style="transition: stroke-dasharray 0.8s ease;"/>';
    }

    // Centre text
    svg += '<text x="' + (size / 2) + '" y="' + (size / 2 - 8) + '" ' +
      'text-anchor="middle" dominant-baseline="central" ' +
      'font-family="var(--font-heading)" font-size="3rem" font-weight="700" fill="#ffffff">';
    svg += displayPct + '%';
    svg += '</text>';

    svg += '<text x="' + (size / 2) + '" y="' + (size / 2 + 24) + '" ' +
      'text-anchor="middle" dominant-baseline="central" ' +
      'font-family="var(--font-body)" font-size="0.8rem" fill="rgba(255,255,255,0.7)">';
    svg += 'utilisation';
    svg += '</text>';

    svg += '</svg>';
    return svg;
  }

  // ---------------------------------------------------------------
  // Step Transition
  // ---------------------------------------------------------------

  /**
   * Navigate to a step with directional slide animation.
   *
   * @param {number} step — 1-4, or 5 for results
   * @param {string} [direction] — 'forward' or 'back' (auto-detected if omitted)
   */
  function goToStep(step, direction) {
    if (!direction) {
      direction = step > currentStep ? 'forward' : 'back';
    }

    var container = getContainer();
    if (!container) return;

    // Determine slide class for the new step
    var slideClass = direction === 'forward' ? 'slide-in-right' : 'slide-in-left';

    // Render new content
    var content = '';
    if (step === 1) content = renderStep1();
    else if (step === 2) content = renderStep2();
    else if (step === 3) content = renderStep3();
    else if (step === 4) content = renderStep4();
    else if (step === 5) content = renderResults();

    // Wrap in a step div — include active class immediately, force centre everything
    var wrapper = '<div class="step active" style="display:block;text-align:center;">' + content + '</div>';
    container.innerHTML = wrapper;

    currentStep = step;

    // Scroll to top
    window.scrollTo(0, 0);

    // Post height after render settles
    setTimeout(postHeight, 100);
  }

  // ---------------------------------------------------------------
  // Default all features to heard-of (for Skip)
  // ---------------------------------------------------------------

  function defaultAllFeatures() {
    var tierId = effectiveTier();
    var features = calc.getFeaturesForTier(tierId);
    for (var i = 0; i < features.length; i++) {
      if (!s().featureStatuses[features[i].id]) {
        calc.setFeatureStatus(features[i].id, 'heard-of');
      }
    }
  }

  // ---------------------------------------------------------------
  // Ensure all reviewed features have a status persisted
  // ---------------------------------------------------------------

  /**
   * Before going to results from step 4, make sure every feature
   * has a persisted status. Features left untouched default to
   * 'heard-of' (the amber / "not sure" state shown in the UI).
   */
  function persistAllFeatureStatuses() {
    var tierId = effectiveTier();
    var features = calc.getFeaturesForTier(tierId);
    for (var i = 0; i < features.length; i++) {
      if (!s().featureStatuses[features[i].id]) {
        calc.setFeatureStatus(features[i].id, 'heard-of');
      }
    }
  }

  // ---------------------------------------------------------------
  // Event Delegation
  // ---------------------------------------------------------------

  function handleClick(e) {
    // Walk up from target to find the element with a data-action
    var target = e.target;
    while (target && target !== getContainer()) {
      var action = target.getAttribute('data-action');
      if (action) {
        e.preventDefault();
        handleAction(action, target);
        return;
      }
      target = target.parentElement;
    }
  }

  function handleAction(action, target) {
    var state = s();

    switch (action) {

      // -- Step 1: Select business size --
      case 'select-size':
        calc.setState('businessSize', target.getAttribute('data-value'));
        goToStep(1); // re-render to update selection & enable button
        break;

      // -- Step 2: Select licence tier --
      case 'select-tier':
        calc.setState('selectedTier', target.getAttribute('data-value'));
        // Clear feature statuses when tier changes (features differ per tier)
        calc.setState('featureStatuses', {});
        goToStep(2);
        break;

      // -- Step 2: Toggle frontline section --
      case 'toggle-frontline':
        var triggerBtn = target.closest ? target.closest('.frontline-trigger') : target;
        if (!triggerBtn) triggerBtn = target;
        var isOpen = triggerBtn.classList.contains('open');
        triggerBtn.classList.toggle('open');
        var cards = triggerBtn.parentElement.querySelector('.frontline-cards');
        if (cards) cards.classList.toggle('visible');
        triggerBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        break;

      // -- Step 3: Toggle priority --
      case 'toggle-priority':
        var catId = target.getAttribute('data-value');
        var priorities = state.priorities.slice();
        var idx = priorities.indexOf(catId);
        if (idx !== -1) {
          priorities.splice(idx, 1);
        } else {
          priorities.push(catId);
        }
        calc.setState('priorities', priorities);
        goToStep(3);
        break;

      // -- Step 4: Set feature status --
      case 'set-status':
        var featureId = target.getAttribute('data-feature');
        var newStatus = target.getAttribute('data-status');
        calc.setFeatureStatus(featureId, newStatus);
        // Update just this row's toggle buttons without full re-render
        updateFeatureToggles(featureId, newStatus);
        break;

      // -- Step 4: Toggle category expand/collapse --
      case 'toggle-category':
        var catEl = target.closest ? target.closest('.feature-category') : findParentWithClass(target, 'feature-category');
        if (catEl) {
          catEl.classList.toggle('expanded');
          var isExpanded = catEl.classList.contains('expanded');
          target.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
          setTimeout(postHeight, 50);
        }
        break;

      // -- Step 4: Skip features --
      case 'skip-features':
        defaultAllFeatures();
        goToStep(5, 'forward');
        break;

      // -- Results: Toggle feature expand --
      case 'toggle-expand':
        var featId = target.getAttribute('data-feature');
        var body = document.getElementById('expand-' + featId);
        if (body) {
          body.classList.toggle('visible');
          var trigEl = target.closest ? target.closest('.feature-expand-trigger') : findParentWithClass(target, 'feature-expand-trigger');
          if (trigEl) {
            trigEl.classList.toggle('open');
            trigEl.setAttribute('aria-expanded', body.classList.contains('visible') ? 'true' : 'false');
          }
          setTimeout(postHeight, 50);
        }
        break;

      // -- Results: Toggle category features in results --
      case 'toggle-category-results':
        var catId = target.getAttribute('data-category');
        var catBody = document.getElementById('cat-results-' + catId);
        if (catBody) {
          var isVisible = catBody.style.display !== 'none';
          catBody.style.display = isVisible ? 'none' : 'block';
          var trigBtn = target.closest ? target.closest('button') : target;
          if (trigBtn) {
            trigBtn.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
            trigBtn.innerHTML = (isVisible ? 'Show ' : 'Hide ') + catBody.querySelectorAll('.feature-card').length + ' features <span class="feature-expand-trigger-icon">' + (isVisible ? '&#9660;' : '&#9650;') + '</span>';
          }
          setTimeout(postHeight, 50);
        }
        break;

      // -- Results: CTA link --
      case 'cta-link':
        var url = target.getAttribute('data-url') || target.getAttribute('href') || 'https://frontrow.technology/contact';
        openLink(url);
        break;

      // -- Results: Restart --
      case 'restart':
        calc.reset();
        goToStep(1, 'back');
        break;

      // -- Navigation --
      case 'next':
        if (currentStep === 1 && state.businessSize) goToStep(2, 'forward');
        else if (currentStep === 2 && state.selectedTier) goToStep(3, 'forward');
        else if (currentStep === 3 && state.priorities.length > 0) goToStep(4, 'forward');
        else if (currentStep === 4) {
          persistAllFeatureStatuses();
          goToStep(5, 'forward');
        }
        break;

      case 'back':
        if (currentStep === 2) goToStep(1, 'back');
        else if (currentStep === 3) goToStep(2, 'back');
        else if (currentStep === 4) goToStep(3, 'back');
        else if (currentStep === 5) goToStep(4, 'back');
        break;
    }
  }

  /** Update toggle buttons in-place for a single feature (avoids full re-render) */
  function updateFeatureToggles(featureId, activeStatus) {
    var container = getContainer();
    if (!container) return;

    var rows = container.querySelectorAll('.feature-row[data-feature="' + featureId + '"]');
    for (var r = 0; r < rows.length; r++) {
      var toggles = rows[r].querySelectorAll('.status-toggle');
      for (var t = 0; t < toggles.length; t++) {
        var btn = toggles[t];
        if (btn.getAttribute('data-status') === activeStatus) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    }
  }

  /** Walk up the DOM to find a parent with a given class */
  function findParentWithClass(el, className) {
    var node = el;
    while (node) {
      if (node.classList && node.classList.contains(className)) return node;
      node = node.parentElement;
    }
    return null;
  }

  // ---------------------------------------------------------------
  // Keyboard support for custom controls
  // ---------------------------------------------------------------

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var target = e.target;
      var action = target.getAttribute('data-action');
      if (action) {
        e.preventDefault();
        handleAction(action, target);
      }
    }
  }

  // ---------------------------------------------------------------
  // Initialisation
  // ---------------------------------------------------------------

  var M365UI = {

    /**
     * Initialise the UI. Call this on DOMContentLoaded.
     * Sets up event delegation and renders the appropriate step.
     */
    init: function () {
      // Grab references to dependencies
      data = window.M365Data;
      calc = window.M365Calculator;

      if (!data) {
        console.error('M365UI: window.M365Data is not available. Make sure data.js loads before ui.js.');
        return;
      }
      if (!calc) {
        console.error('M365UI: window.M365Calculator is not available. Make sure calculator.js loads before ui.js.');
        return;
      }

      // Initialise calculator state
      calc.init();

      // Ensure we have a container element
      var container = getContainer();
      if (!container) {
        // Create the container if the page only has a body
        container = el('div', 'calculator');
        container.id = 'calculator';
        document.body.appendChild(container);
      }

      // Set up event delegation
      container.addEventListener('click', handleClick, false);
      container.addEventListener('keydown', handleKeydown, false);

      // Determine starting step from saved state
      currentStep = inferCurrentStep();
      goToStep(currentStep, 'forward');

      // Listen for resize to update iframe height
      window.addEventListener('resize', function () {
        setTimeout(postHeight, 50);
      });
    }
  };

  window.M365UI = M365UI;

  // ---------------------------------------------------------------
  // Auto-init on DOMContentLoaded
  // ---------------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      M365UI.init();
    });
  } else {
    // DOM already loaded (script loaded with defer or at end of body)
    M365UI.init();
  }

})();
