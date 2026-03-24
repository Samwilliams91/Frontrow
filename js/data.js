/**
 * Microsoft 365 Features Calculator — Data Layer
 * Frontrow Technology (frontrow.technology)
 *
 * Pricing: AUD per user per month, annual commitment, ex-GST.
 * Last verified: March 2026 against Microsoft's Australian price list.
 *
 * Feature-to-tier mappings verified against Microsoft 365 service descriptions
 * and licensing documentation. If something looks wrong, check:
 * https://m365maps.com or https://learn.microsoft.com/en-us/office365/servicedescriptions/
 */

// ---------------------------------------------------------------------------
// LICENCE TIERS
// ---------------------------------------------------------------------------
const LICENCE_TIERS = [
  {
    id: 'biz-basic',
    name: 'Microsoft 365 Business Basic',
    shortName: 'Business Basic',
    maxUsers: 300,
    priceAUD: 9.10,
    isFrontline: false,
    description: 'Web and mobile versions of Office apps, email, Teams, and 1 TB OneDrive storage.'
  },
  {
    id: 'biz-standard',
    name: 'Microsoft 365 Business Standard',
    shortName: 'Business Standard',
    maxUsers: 300,
    priceAUD: 18.70,
    isFrontline: false,
    description: 'Everything in Basic plus desktop Office apps, Bookings, and more.'
  },
  {
    id: 'biz-premium',
    name: 'Microsoft 365 Business Premium',
    shortName: 'Business Premium',
    maxUsers: 300,
    priceAUD: 33.00,
    isFrontline: false,
    description: 'Everything in Standard plus advanced security, device management, and Defender for Business.'
  },
  {
    id: 'e3',
    name: 'Microsoft 365 E3',
    shortName: 'E3',
    maxUsers: null, // unlimited
    priceAUD: 54.90,
    isFrontline: false,
    description: 'Enterprise-grade productivity, security, and compliance for larger organisations.'
  },
  {
    id: 'e5',
    name: 'Microsoft 365 E5',
    shortName: 'E5',
    maxUsers: null, // unlimited
    priceAUD: 82.50,
    isFrontline: false,
    description: 'The full suite — everything in E3 plus advanced security, compliance, analytics, and voice.'
  },
  {
    id: 'f1',
    name: 'Microsoft 365 F1',
    shortName: 'F1',
    maxUsers: null, // unlimited
    priceAUD: 3.40,
    isFrontline: true,
    description: 'Basic tools for frontline workers — Teams, web Office apps, and 2 GB OneDrive.'
  },
  {
    id: 'f3',
    name: 'Microsoft 365 F3',
    shortName: 'F3',
    maxUsers: null, // unlimited
    priceAUD: 12.00,
    isFrontline: true,
    description: 'More for frontline workers — adds desktop Office apps (limited), larger mailbox, and more storage.'
  }
];

// ---------------------------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------------------------
const CATEGORIES = [
  {
    id: 'security',
    name: 'Security',
    icon: '\u{1F6E1}\uFE0F', // shield
    ctaText: "Most businesses we work with haven't turned on Conditional Access or Defender — we set it up in under a day.",
    ctaLink: 'https://www.frontrow.technology/contact',
    ctaLabel: 'Talk to us about a quick security review'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '\u{1F4DD}', // memo/document
    ctaText: "You're paying for tools like Bookings, Loop, and Clipchamp that could save your team hours every week.",
    ctaLink: 'https://www.frontrow.technology/contact',
    ctaLabel: 'Get help rolling out productivity tools'
  },
  {
    id: 'compliance',
    name: 'Compliance',
    icon: '\u2696\uFE0F', // balance scale
    ctaText: "Retention policies and sensitivity labels help meet Australian data obligations. Most businesses haven't configured these yet.",
    ctaLink: 'https://www.frontrow.technology/contact',
    ctaLabel: "Let's sort that out"
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    icon: '\u{1F4AC}', // speech bubble
    ctaText: "Teams, SharePoint, and Planner work best when they're set up properly — not just left as defaults.",
    ctaLink: 'https://www.frontrow.technology/contact',
    ctaLabel: 'Get your collaboration tools working together'
  },
  {
    id: 'device-management',
    name: 'Device Management',
    icon: '\u{1F4BB}', // laptop
    ctaText: "Intune is included in your plan but your devices probably aren't enrolled.",
    ctaLink: 'https://www.frontrow.technology/contact',
    ctaLabel: 'Get a free device management check'
  },
  {
    id: 'identity',
    name: 'Identity & Access',
    icon: '\u{1F511}', // key
    ctaText: "Identity is the new perimeter. Features like self-service password reset and risk-based access are already in your licence.",
    ctaLink: 'https://www.frontrow.technology/contact',
    ctaLabel: 'Book an identity and access review'
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: '\u2601\uFE0F', // cloud
    ctaText: "Most teams aren't using their full OneDrive and SharePoint storage allocation — and files are still scattered everywhere.",
    ctaLink: 'https://www.frontrow.technology/contact',
    ctaLabel: 'Talk to us about organising your files'
  },
  {
    id: 'ai-automation',
    name: 'AI & Automation',
    icon: '\u2728', // sparkles
    ctaText: "Power Automate can replace dozens of manual tasks, and Copilot is available as an add-on for teams ready to take the next step.",
    ctaLink: 'https://www.frontrow.technology/contact',
    ctaLabel: 'Find out what you can automate'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '\u{1F4CA}', // bar chart
    ctaText: "Your licence includes reporting tools that show how your team actually works — most admins never look at them.",
    ctaLink: 'https://www.frontrow.technology/contact',
    ctaLabel: 'Get help reading your M365 analytics'
  }
];

// ---------------------------------------------------------------------------
// FEATURES
// ---------------------------------------------------------------------------
const FEATURES = [

  // =========================================================================
  // SECURITY
  // =========================================================================
  {
    id: 'mfa-security-defaults',
    name: 'Multi-Factor Authentication (Security Defaults)',
    friendlyName: 'Require a second step when signing in',
    category: 'security',
    description: "Adds a second verification step — like a phone prompt — when your team signs in. Security Defaults turns this on for everyone with a couple of clicks.",
    businessImpact: "Credential theft is the number one way businesses get compromised. MFA blocks over 99% of those attacks, and it's free with every M365 plan. If you haven't turned it on yet, it should be the first thing you do.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'defender-office-p1',
    name: 'Microsoft Defender for Office 365 Plan 1',
    friendlyName: 'Advanced email and link protection',
    category: 'security',
    description: "Scans email attachments and links in real time to catch phishing, malware, and zero-day threats that basic Exchange protection misses.",
    businessImpact: "Standard email filtering catches known threats, but targeted phishing gets through more often than you'd think. Defender Plan 1 adds real-time scanning of attachments and links — it detonates suspicious files in a sandbox before they reach your inbox. If your team clicks links in emails (and they do), this matters.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'defender-office-p2',
    name: 'Microsoft Defender for Office 365 Plan 2',
    friendlyName: 'Threat investigation and automated response',
    category: 'security',
    description: "Everything in Plan 1 plus threat investigation tools, automated incident response, and attack simulation training for your team.",
    businessImpact: "Plan 2 is for organisations that want to actively hunt for threats and run phishing simulations to train staff. It includes Threat Explorer, automated investigation and response (AIR), and attack simulation. Most relevant for larger teams with dedicated IT or security staff.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },
  {
    id: 'defender-business',
    name: 'Microsoft Defender for Business',
    friendlyName: 'Endpoint security built for smaller teams',
    category: 'security',
    description: "Enterprise-grade device protection — threat detection, vulnerability management, and automated response — packaged for businesses with up to 300 users.",
    businessImpact: "This is endpoint protection that used to cost extra and was only practical for large enterprises. It watches your devices for suspicious behaviour, flags vulnerabilities, and can automatically isolate a compromised machine. If your team uses laptops outside the office, this is worth turning on.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'not-available',
      'e5': 'not-available',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'defender-endpoint-p1',
    name: 'Microsoft Defender for Endpoint Plan 1',
    friendlyName: 'Device threat protection and response',
    category: 'security',
    description: "Core endpoint protection — anti-malware, attack surface reduction, device-based conditional access, and centralised security management.",
    businessImpact: "This protects your Windows, Mac, iOS, and Android devices from threats and lets your IT team manage security policies from one place. It's the enterprise version of endpoint protection, included in your licence so you don't need to buy a separate antivirus product.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'defender-endpoint-p2',
    name: 'Microsoft Defender for Endpoint Plan 2',
    friendlyName: 'Full endpoint detection, investigation, and response',
    category: 'security',
    description: "Everything in Plan 1 plus endpoint detection and response (EDR), automated investigation, threat analytics, and advanced hunting.",
    businessImpact: "Plan 2 adds the ability to investigate incidents after they happen — timeline views of what occurred on a device, automated remediation, and proactive threat hunting. This is the full enterprise EDR solution and it's included in E5.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },
  {
    id: 'safe-attachments',
    name: 'Safe Attachments',
    friendlyName: 'Scan email attachments for hidden threats',
    category: 'security',
    description: "Opens email attachments in a secure sandbox to check for malware before delivering them to your inbox. Also protects files in SharePoint, OneDrive, and Teams.",
    businessImpact: "Regular antivirus checks files against known threats. Safe Attachments actually opens the file in an isolated environment to see what it does. If someone sends your team a Word doc with a hidden macro, this catches it. It's one of those features that works quietly in the background until the day it saves you.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'simple'
  },
  {
    id: 'safe-links',
    name: 'Safe Links',
    friendlyName: 'Check links in emails and documents in real time',
    category: 'security',
    description: "Scans URLs in emails and Office documents at the time of click — not just when the email arrives — to catch links that turn malicious after delivery.",
    businessImpact: "Attackers often send emails with clean links that redirect to phishing sites hours later, after the email has already passed filters. Safe Links re-checks the URL every time someone clicks it. It works across emails, Teams messages, and Office documents.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'simple'
  },
  {
    id: 'conditional-access',
    name: 'Conditional Access',
    friendlyName: 'Control who can sign in and from where',
    category: 'security',
    description: "Set rules for how and where people access your business data — block risky sign-ins, require MFA from new locations, restrict access to managed devices.",
    businessImpact: "Without Conditional Access, anyone with a username and password can sign in from anywhere. With it, you decide the rules — like requiring MFA when someone signs in from overseas or blocking access from personal devices. It's one of the most impactful security features in M365 and it's already included in your plan.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'moderate'
  },
  {
    id: 'attack-simulation',
    name: 'Attack Simulation Training',
    friendlyName: 'Test your team with fake phishing emails',
    category: 'security',
    description: "Run realistic phishing simulations against your own staff and assign targeted training to anyone who falls for them.",
    businessImpact: "You can send your team fake phishing emails to see who clicks. Anyone who does gets assigned a short training module. It's a practical way to build awareness without lecturing people, and the reports show you exactly where your human risk sits.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'secure-score',
    name: 'Microsoft Secure Score',
    friendlyName: 'See how secure your M365 setup actually is',
    category: 'security',
    description: "A dashboard in the admin centre that scores your security posture and recommends specific actions to improve it.",
    businessImpact: "Secure Score gives you a percentage and a list of things you can do to improve it — turn on MFA, enable Safe Links, configure policies. It's like a to-do list for security, ranked by impact. Most admins don't know it exists, but it's free with every plan.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: true,
    setupComplexity: 'simple'
  },

  // =========================================================================
  // DEVICE MANAGEMENT
  // =========================================================================
  {
    id: 'basic-mdm',
    name: 'Basic Mobility and Security (MDM)',
    friendlyName: 'Basic mobile device management',
    category: 'device-management',
    description: "Enrol phones and tablets so you can enforce passcodes, encrypt devices, and remotely wipe a lost phone. Built into all M365 plans.",
    businessImpact: "If someone loses their phone and they've got work email on it, you want to be able to wipe the business data remotely. Basic MDM lets you do that. It's not as full-featured as Intune, but it covers the basics and it's included in every plan.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'intune-p1',
    name: 'Microsoft Intune Plan 1',
    friendlyName: 'Full device and app management',
    category: 'device-management',
    description: "Manage laptops, phones, and tablets from one place — push security policies, deploy apps, enforce encryption, and control access based on device compliance.",
    businessImpact: "Intune is the big one for device management. You can make sure every device meets your security standards before it gets access to company data. Deploy apps remotely, enforce BitLocker, manage updates — all without touching the device. Most businesses with Premium or E3 are paying for it but haven't set it up.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'included'
    },
    commonlyUnused: true,
    setupComplexity: 'complex'
  },
  {
    id: 'windows-autopilot',
    name: 'Windows Autopilot',
    friendlyName: 'Set up new laptops without touching them',
    category: 'device-management',
    description: "Ship a new laptop straight to a team member and it configures itself — apps, policies, settings — when they sign in for the first time.",
    businessImpact: "Instead of your IT person spending an hour setting up each new laptop, Autopilot does it automatically. The new hire opens the laptop, signs in with their M365 account, and everything installs itself. Massive time saver if you're onboarding people regularly or have remote staff.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'moderate'
  },
  {
    id: 'remote-wipe',
    name: 'Remote Wipe',
    friendlyName: 'Erase company data from lost or stolen devices',
    category: 'device-management',
    description: "Remotely remove all company data from a device — or do a full factory reset — if it's lost, stolen, or when someone leaves.",
    businessImpact: "When someone loses a laptop at the airport or a staff member leaves the business, you need to get your data off their device quickly. Remote wipe lets you do a selective wipe (company data only) or a full wipe (everything). You need Intune or Basic MDM set up first for it to work.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'endpoint-analytics',
    name: 'Endpoint Analytics',
    friendlyName: 'See how your devices are actually performing',
    category: 'device-management',
    description: "Reports on device health, startup times, app reliability, and user experience — helps you spot problem devices before users complain.",
    businessImpact: "Ever wonder why some people's laptops are slow? Endpoint Analytics shows you startup times, crash rates, and which devices need attention. It's surprisingly useful for planning hardware refreshes and fixing problems proactively instead of waiting for help desk tickets.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },

  // =========================================================================
  // IDENTITY & ACCESS
  // =========================================================================
  {
    id: 'entra-id-free',
    name: 'Microsoft Entra ID Free',
    friendlyName: 'Basic identity and user management',
    category: 'identity',
    description: "Core identity service — single sign-on for M365 apps, basic MFA through Security Defaults, and user/group management.",
    businessImpact: "This is the identity backbone that comes with every M365 plan. It handles sign-ins, manages your user accounts, and provides basic MFA. It works, but if you want features like Conditional Access or self-service password reset, you'll need Entra ID P1.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'entra-id-p1',
    name: 'Microsoft Entra ID P1',
    friendlyName: 'Advanced identity with Conditional Access',
    category: 'identity',
    description: "Adds Conditional Access, self-service password reset, dynamic groups, and on-premises hybrid identity support on top of the free tier.",
    businessImpact: "P1 is what unlocks Conditional Access — the ability to set rules about who can sign in, from where, and on what devices. It also lets your staff reset their own passwords without calling IT, which alone saves hours every month. Included in Business Premium, E3, and E5.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'entra-id-p2',
    name: 'Microsoft Entra ID P2',
    friendlyName: 'Risk-based access and privileged identity management',
    category: 'identity',
    description: "Everything in P1 plus Identity Protection (risk-based sign-in policies) and Privileged Identity Management (just-in-time admin access).",
    businessImpact: "P2 adds intelligence to your sign-in process. It can detect risky sign-ins automatically — like someone signing in from a known botnet — and block or challenge them. It also lets you set up just-in-time admin access so nobody has permanent admin rights sitting around waiting to be compromised.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },
  {
    id: 'sspr',
    name: 'Self-Service Password Reset',
    friendlyName: 'Let staff reset their own passwords',
    category: 'identity',
    description: "Users can reset their own passwords through a secure web page or the Windows sign-in screen, without calling IT.",
    businessImpact: "Password reset requests are one of the most common IT help desk tickets. SSPR lets people sort it out themselves — verify their identity, pick a new password, get back to work. Saves your IT team time and gets people unblocked faster, especially outside business hours.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'included'
    },
    commonlyUnused: true,
    setupComplexity: 'simple'
  },
  {
    id: 'pim',
    name: 'Privileged Identity Management (PIM)',
    friendlyName: 'Just-in-time admin access',
    category: 'identity',
    description: "Give people admin access only when they need it, for a set time period, with approval workflows and audit trails.",
    businessImpact: "Instead of having people with permanent Global Admin rights, PIM lets them request elevated access when they need it — for a few hours, with approval. This means if an admin account gets compromised, the attacker doesn't automatically get the keys to the kingdom.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },
  {
    id: 'identity-protection',
    name: 'Identity Protection',
    friendlyName: 'Detect and respond to identity-based risks automatically',
    category: 'identity',
    description: "Uses machine learning to detect risky sign-ins and compromised accounts, then automatically enforces policies like requiring MFA or blocking access.",
    businessImpact: "Identity Protection watches every sign-in and flags anything unusual — impossible travel, sign-ins from anonymous networks, password spray attacks. It can automatically require MFA or block access when risk is detected, without you having to monitor anything manually.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },

  // =========================================================================
  // COMPLIANCE
  // =========================================================================
  {
    id: 'purview-dlp',
    name: 'Microsoft Purview Data Loss Prevention (DLP)',
    friendlyName: 'Stop sensitive data from leaving your organisation',
    category: 'compliance',
    description: "Automatically detect and block sensitive information — like credit card numbers, tax file numbers, or health records — from being shared via email, Teams, or SharePoint.",
    businessImpact: "DLP scans outgoing emails and shared files for sensitive data patterns. If someone tries to email a spreadsheet full of customer tax file numbers to their personal Gmail, DLP can warn them, block it, or notify an admin. It helps you meet Australian privacy obligations without relying on people doing the right thing.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'moderate'
  },
  {
    id: 'purview-advanced',
    name: 'Microsoft Purview Advanced Compliance',
    friendlyName: 'eDiscovery Premium, Insider Risk, and more',
    category: 'compliance',
    description: "Advanced compliance tools including eDiscovery Premium for legal investigations, Insider Risk Management, Communication Compliance, and advanced information governance.",
    businessImpact: "If you ever face a legal discovery request, eDiscovery Premium makes it manageable instead of a nightmare. Insider Risk Management watches for unusual data activity — like someone downloading hundreds of files before their last day. These are enterprise-grade tools that larger organisations and regulated industries rely on.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },
  {
    id: 'retention-policies',
    name: 'Retention Policies',
    friendlyName: 'Keep or delete data automatically based on rules',
    category: 'compliance',
    description: "Set rules to automatically retain or delete emails, documents, and Teams messages after a set period. Applies across Exchange, SharePoint, OneDrive, and Teams.",
    businessImpact: "Australian businesses often have legal requirements to keep certain records for 5 or 7 years. Retention policies handle this automatically — no one has to remember to keep things or clean things up. You can also set deletion rules so old data doesn't hang around forever creating risk.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'moderate'
  },
  {
    id: 'sensitivity-labels',
    name: 'Sensitivity Labels',
    friendlyName: 'Classify and protect documents based on sensitivity',
    category: 'compliance',
    description: "Label documents and emails as Internal, Confidential, or Highly Confidential — then automatically apply encryption, watermarks, or access restrictions based on the label.",
    businessImpact: "Sensitivity labels let you tag a document as 'Confidential' and have M365 automatically encrypt it and restrict who can open it — even if someone forwards it outside your organisation. It's a practical way to protect sensitive information without relying on people remembering to be careful.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'moderate'
  },
  {
    id: 'information-barriers',
    name: 'Information Barriers',
    friendlyName: 'Prevent specific groups from communicating',
    category: 'compliance',
    description: "Block communication and file sharing between specific groups in your organisation — like preventing a trading desk from chatting with the advisory team.",
    businessImpact: "Regulated industries sometimes need to enforce 'Chinese walls' between teams. Information Barriers block Teams chats, calls, and file sharing between defined groups. It's a niche feature, but if your industry requires it, having it built into M365 saves you buying a separate solution.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },
  {
    id: 'audit-standard',
    name: 'Audit (Standard)',
    friendlyName: 'Track who did what across M365',
    category: 'compliance',
    description: "Search audit logs to see who accessed what, when files were shared, and what changes were made across Exchange, SharePoint, Teams, and Entra ID.",
    businessImpact: "When something goes wrong — a file gets deleted, someone's account is compromised, or you need to prove compliance — audit logs tell you exactly what happened. Standard Audit keeps 180 days of logs and covers most of the events you'd want to investigate.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'audit-premium',
    name: 'Audit (Premium)',
    friendlyName: 'Extended audit logs with longer retention',
    category: 'compliance',
    description: "Longer retention (up to 10 years), more detailed events — like exactly which emails were read and which search queries were run — plus higher bandwidth for the audit API.",
    businessImpact: "Premium Audit keeps logs for a year by default (extendable to 10 years) and captures more granular events. If you're in a regulated industry or need long-term audit trails for compliance, this gives you the detail and retention that Standard Audit doesn't cover.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },

  // =========================================================================
  // PRODUCTIVITY
  // =========================================================================
  {
    id: 'office-web',
    name: 'Word, Excel, PowerPoint (Web)',
    friendlyName: 'Office apps in your browser',
    category: 'productivity',
    description: "Use Word, Excel, PowerPoint, and OneNote in your web browser — no installation needed. Great for quick edits and working from any device.",
    businessImpact: "The web versions of Office are included in every plan. They're lighter than the desktop apps but cover most everyday tasks — writing documents, updating spreadsheets, building presentations. Handy when you're on someone else's computer or a device that doesn't have Office installed.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'office-desktop',
    name: 'Word, Excel, PowerPoint (Desktop)',
    friendlyName: 'Full desktop Office apps',
    category: 'productivity',
    description: "Install the full versions of Word, Excel, PowerPoint, Outlook, and OneNote on up to 5 PCs/Macs and 5 mobile devices per user.",
    businessImpact: "The desktop apps are faster, work offline, and have features the web versions don't — advanced Excel formulas, mail merge, complex formatting. If your team works in Office apps daily, the desktop versions are essential. Business Basic and F1 don't include them.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'access-publisher',
    name: 'Access and Publisher (Desktop, Windows only)',
    friendlyName: 'Database and desktop publishing tools',
    category: 'productivity',
    description: "Access lets you build simple databases and forms. Publisher is for creating brochures, newsletters, and print layouts. Both are Windows-only desktop apps.",
    businessImpact: "Access is surprisingly useful for small businesses that need to track things beyond what a spreadsheet can handle — inventory, project logs, customer databases. Publisher is handy for marketing materials. They're niche tools, but they're included in your plan if you need them.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'bookings',
    name: 'Microsoft Bookings',
    friendlyName: 'Online appointment scheduling',
    category: 'productivity',
    description: "A booking page where clients can see your availability and schedule their own appointments. Integrates with your Outlook calendar and sends automatic reminders.",
    businessImpact: "If you take appointments — consultations, site visits, support sessions — Bookings eliminates the back-and-forth emails. Share a link, clients pick a time, it goes straight into your calendar. It handles reminders and cancellations too. A lot of businesses are paying for Calendly when this is already included.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'simple'
  },
  {
    id: 'loop',
    name: 'Microsoft Loop',
    friendlyName: 'Collaborative workspaces and live components',
    category: 'productivity',
    description: "Think of it as a flexible workspace where your team can co-create content — task lists, tables, notes — that stays synced everywhere it's shared, including Teams and Outlook.",
    businessImpact: "Loop components can be pasted into Teams chats, Outlook emails, and other Loop pages — and they stay live everywhere. Update a task list in one place and it updates everywhere else. It's useful for project tracking, meeting notes, and brainstorming without creating yet another document.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'simple'
  },
  {
    id: 'clipchamp',
    name: 'Clipchamp',
    friendlyName: 'Simple video editing in the browser',
    category: 'productivity',
    description: "A browser-based video editor for creating and editing videos — training content, social media clips, internal communications — without needing professional software.",
    businessImpact: "Need to make a quick training video or a social media clip? Clipchamp is a simple drag-and-drop video editor with templates, stock footage, and text overlays. It won't replace professional editing software, but it's more than enough for internal comms, onboarding videos, and marketing content.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: true,
    setupComplexity: 'simple'
  },

  // =========================================================================
  // COLLABORATION
  // =========================================================================
  {
    id: 'teams',
    name: 'Microsoft Teams',
    friendlyName: 'Chat, meetings, and calls in one place',
    category: 'collaboration',
    description: "Chat with colleagues, run video meetings, share files, and collaborate in channels — all in one app. Includes screen sharing, recording, and meeting transcription.",
    businessImpact: "Most businesses know they have Teams, but many only use it for meetings. The real value is in channels — organising conversations by project or department so information isn't buried in email threads. File sharing in Teams channels is backed by SharePoint, so it's all searchable and version-controlled.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'teams-webinars',
    name: 'Teams Webinars',
    friendlyName: 'Host professional webinars with registration',
    category: 'collaboration',
    description: "Run webinars with attendee registration, custom branding, presenter controls, and post-event reporting. Supports up to 1,000 attendees.",
    businessImpact: "If you run training sessions, client presentations, or marketing events, webinars give you a proper registration page, attendee tracking, and presenter controls that regular Teams meetings don't have. You get data on who registered, who showed up, and how long they stayed.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'teams-town-halls',
    name: 'Teams Town Halls',
    friendlyName: 'Large-scale broadcast events',
    category: 'collaboration',
    description: "Broadcast events to up to 10,000 attendees with presenter controls, Q&A moderation, real-time captions, and on-demand recording.",
    businessImpact: "Town Halls replace the old Live Events feature and are built for one-to-many communication — all-hands meetings, company announcements, CEO updates. Attendees watch and use Q&A, but can't unmute or share their cameras, keeping it structured and manageable at scale.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'sharepoint-online',
    name: 'SharePoint Online',
    friendlyName: 'Team sites and document management',
    category: 'collaboration',
    description: "Create team sites and communication sites to store, share, and collaborate on documents. Includes version history, co-authoring, and search across your organisation.",
    businessImpact: "SharePoint is the engine behind Teams file sharing and OneDrive for Business. On its own, it's a powerful intranet and document management platform. Most businesses have it but only use it as a file dump — with proper setup it can be your internal knowledge base, project hub, and company intranet.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'sharepoint-advanced',
    name: 'SharePoint Advanced Features',
    friendlyName: 'Hub sites, content types, and advanced governance',
    category: 'collaboration',
    description: "Hub sites for organising related sites, managed content types for consistency, advanced search customisation, and site lifecycle policies.",
    businessImpact: "Once you've got more than a handful of SharePoint sites, you need structure. Hub sites let you group related sites together with shared navigation and search. Content types enforce consistency — so every project site has the same document templates and metadata. This is where SharePoint goes from 'file storage' to 'information management platform'.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },

  // =========================================================================
  // STORAGE
  // =========================================================================
  {
    id: 'onedrive',
    name: 'OneDrive for Business',
    friendlyName: 'Personal cloud storage for every user',
    category: 'storage',
    description: "Each user gets 1 TB of personal cloud storage (2 GB on F1) that syncs across devices, with version history, file recovery, and sharing controls.",
    businessImpact: "OneDrive replaces saving files to your desktop or a USB drive. Everything is backed up to the cloud, syncs across your devices, and you can recover deleted files or roll back to older versions. If a laptop dies, no data is lost. Most businesses have it but haven't moved their files there yet.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'sharepoint-storage',
    name: 'SharePoint Storage Pool',
    friendlyName: 'Shared storage for your organisation',
    category: 'storage',
    description: "Your organisation gets 1 TB base storage plus 10 GB per licensed user, pooled across all SharePoint sites and Teams.",
    businessImpact: "This is your shared company storage — the total pool that gets divided across all your SharePoint sites and Teams channels. For a 50-person business, that's about 1.5 TB of shared storage. If you're running out, you might just need to clean up old sites rather than buy more.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },

  // =========================================================================
  // AI & AUTOMATION
  // =========================================================================
  {
    id: 'copilot-m365',
    name: 'Copilot for Microsoft 365',
    friendlyName: 'AI assistant across Office apps and Teams',
    category: 'ai-automation',
    description: "An AI assistant built into Word, Excel, PowerPoint, Outlook, and Teams — draft documents, summarise emails, generate presentations, and analyse data using natural language.",
    businessImpact: "Copilot can draft a document from bullet points, summarise a long email thread, generate a PowerPoint from a Word doc, or analyse an Excel spreadsheet using plain English questions. It's a paid add-on (~$45/user/month) and requires Business Standard or above. Worth trying for knowledge workers who spend a lot of time in Office apps.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'add-on',
      'biz-premium': 'add-on',
      'e3': 'add-on',
      'e5': 'add-on',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'power-automate',
    name: 'Power Automate',
    friendlyName: 'Automate repetitive tasks without code',
    category: 'ai-automation',
    description: "Build automated workflows between M365 apps and hundreds of other services — approval chains, data entry, notifications, file management — using a drag-and-drop designer.",
    businessImpact: "Think about the tasks your team does over and over — saving email attachments to SharePoint, sending approval requests, updating spreadsheets from forms. Power Automate can handle all of that automatically. The standard connectors (M365 apps, basic triggers) are included in every plan. Most businesses haven't touched it.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: true,
    setupComplexity: 'moderate'
  },
  {
    id: 'power-apps',
    name: 'Power Apps for Microsoft 365',
    friendlyName: 'Build simple business apps without code',
    category: 'ai-automation',
    description: "Create basic mobile and web apps connected to your M365 data — forms, dashboards, approval apps — using a visual designer. Included apps run within M365 context.",
    businessImpact: "Need a simple app for logging site inspections, tracking equipment, or running an approval process? Power Apps lets you build it visually without writing code. The M365-included version covers apps that work with SharePoint lists, Excel, and other M365 data sources. Premium connectors (like SQL or Dynamics) require additional licensing.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },

  // =========================================================================
  // ANALYTICS
  // =========================================================================
  {
    id: 'viva-insights-personal',
    name: 'Viva Insights (Personal)',
    friendlyName: 'Understand your own work patterns',
    category: 'analytics',
    description: "Personal productivity insights — how much time you spend in meetings, your focus time, after-hours work, and suggestions for improving work-life balance.",
    businessImpact: "Viva Insights shows each person how they spend their work time. Are you in meetings all day? Working after hours too often? It gives gentle nudges — like suggesting you block focus time or take a break. It's personal and private by default (managers can't see individual data).",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'viva-insights-advanced',
    name: 'Viva Insights (Manager & Leader)',
    friendlyName: 'Team and organisation-level work analytics',
    category: 'analytics',
    description: "Aggregated, anonymised insights for managers and leaders — team meeting load, collaboration patterns, focus time trends, and work-life balance indicators across the organisation.",
    businessImpact: "The advanced version gives managers and leaders a view of team-level patterns — without exposing individual data. Are your teams spending too much time in meetings? Is one department working excessive hours? It helps you spot problems before they become burnout. Available as a paid add-on.",
    tiers: {
      'biz-basic': 'add-on',
      'biz-standard': 'add-on',
      'biz-premium': 'add-on',
      'e3': 'add-on',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'planner',
    name: 'Microsoft Planner',
    friendlyName: 'Visual task and project management',
    category: 'analytics',
    description: "Kanban boards, task assignments, due dates, and progress tracking — built into Teams. Good for managing projects, sprints, and team to-do lists.",
    businessImpact: "Planner is a simple project management tool — think Trello but built into M365. Create boards, assign tasks, set due dates, and track progress. It lives inside Teams so your team doesn't need another app. For small to medium projects it covers what most teams need without the complexity of something like MS Project.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'usage-analytics',
    name: 'M365 Usage Analytics',
    friendlyName: 'See how your organisation uses M365',
    category: 'analytics',
    description: "Admin-level reports showing which M365 services your organisation actually uses — active users, email activity, Teams adoption, storage consumption, and more.",
    businessImpact: "Usage Analytics shows you the raw numbers — how many people are actually using Teams, who hasn't logged into OneDrive, how much storage you're consuming. It's in the admin centre and it's free with every plan. Useful for justifying your M365 spend and planning rollouts.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },

  // =========================================================================
  // ADDITIONAL PRODUCTIVITY FEATURES
  // =========================================================================
  {
    id: 'exchange-online',
    name: 'Exchange Online',
    friendlyName: 'Business email with 50 GB or 100 GB mailbox',
    category: 'productivity',
    description: "Business email hosting with a 50 GB mailbox (100 GB on E3/E5), shared mailboxes, calendars, contacts, and spam/malware filtering. Supports custom domains.",
    businessImpact: "This is your business email — yourname@yourcompany.com.au. It includes shared mailboxes (like info@ or accounts@) at no extra cost, shared calendars for booking rooms and resources, and built-in spam filtering. Most businesses are already using this one, but many don't realise shared mailboxes are free.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'forms',
    name: 'Microsoft Forms',
    friendlyName: 'Surveys, quizzes, and data collection',
    category: 'productivity',
    description: "Create forms, surveys, and quizzes that collect responses into Excel or trigger Power Automate workflows. Simple drag-and-drop builder.",
    businessImpact: "Need a feedback form, a site inspection checklist, or a customer satisfaction survey? Forms handles it — build it in minutes, share a link, and responses flow into a spreadsheet or trigger an automated workflow. A lot of businesses pay for third-party survey tools when this is sitting there unused.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'lists',
    name: 'Microsoft Lists',
    friendlyName: 'Track information with smart, shareable lists',
    category: 'productivity',
    description: "Create structured lists for tracking issues, assets, inventory, onboarding tasks, or anything else. Built on SharePoint but with a friendlier interface and ready-made templates.",
    businessImpact: "Lists is what happens when SharePoint lists get a proper makeover. Use it to track anything — IT assets, recruitment candidates, project issues, event planning. It has templates to get started fast, conditional formatting to highlight important items, and it integrates directly into Teams channels.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'outlook-mobile',
    name: 'Outlook Mobile',
    friendlyName: 'Email and calendar on your phone',
    category: 'productivity',
    description: "The Outlook app for iOS and Android — email, calendar, contacts, and file access in one app. Supports focused inbox and swipe gestures.",
    businessImpact: "Outlook Mobile gives your team a secure way to access work email on their phones with a focused inbox that prioritises important messages. It also supports app protection policies through Intune, so you can wipe work data from the app without touching personal stuff on the phone.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'sway',
    name: 'Sway',
    friendlyName: 'Create interactive presentations and reports',
    category: 'productivity',
    description: "Build interactive, web-based presentations, newsletters, and reports that look polished without design skills. Automatically adjusts layout based on content.",
    businessImpact: "Sway is useful for creating things like onboarding guides, project updates, or training materials that need to look good but don't need the formality of a PowerPoint. It's web-based and responsive, so it works on any device. Most people don't know it exists.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },

  // =========================================================================
  // ADDITIONAL COLLABORATION FEATURES
  // =========================================================================
  {
    id: 'teams-phone',
    name: 'Teams Phone',
    friendlyName: 'Make and receive phone calls through Teams',
    category: 'collaboration',
    description: "Replace your desk phone system with Teams — make and receive calls using your business number, auto-attendants, call queues, and voicemail transcription.",
    businessImpact: "Teams Phone turns Teams into your phone system. You can ditch the old PBX, port your existing numbers, and have staff make and receive calls from their laptop or mobile. It includes auto-attendants, call queues, and voicemail-to-email. Phone System is included in E5; other plans need an add-on plus a calling plan or operator connect.",
    tiers: {
      'biz-basic': 'add-on',
      'biz-standard': 'add-on',
      'biz-premium': 'add-on',
      'e3': 'add-on',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'add-on'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },
  {
    id: 'teams-rooms',
    name: 'Teams Rooms (Basic)',
    friendlyName: 'Meeting room devices and management',
    category: 'collaboration',
    description: "Connect meeting room hardware to Teams for one-touch join, room calendars, and a consistent meeting experience. Basic management for up to 25 rooms is included.",
    businessImpact: "If you have meeting rooms with screens and cameras, Teams Rooms brings them into the Teams ecosystem. Walk in, tap the screen, join the meeting. The basic licence covers up to 25 rooms and includes remote management. Larger deployments or advanced features need the Pro licence.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },

  // =========================================================================
  // ADDITIONAL SECURITY FEATURES
  // =========================================================================
  {
    id: 'exchange-online-protection',
    name: 'Exchange Online Protection',
    friendlyName: 'Built-in email spam and malware filtering',
    category: 'security',
    description: "Baseline email protection — anti-spam, anti-malware, and anti-phishing filtering for all inbound and outbound email. Included with every plan that has Exchange Online.",
    businessImpact: "This is the default email protection that comes with M365. It catches the vast majority of spam and known malware before it reaches your inbox. It's good baseline protection, but for targeted phishing and zero-day threats, you'll want Defender for Office 365 on top of it.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'azure-information-protection',
    name: 'Azure Information Protection (AIP)',
    friendlyName: 'Encrypt and control access to sensitive documents',
    category: 'security',
    description: "Encrypt documents and emails so only authorised people can open them — even if the file is forwarded, copied, or downloaded. Works with sensitivity labels.",
    businessImpact: "AIP lets you protect a document so that only specific people can open it, regardless of where the file ends up. Send a confidential proposal to a client and revoke access later. Email a sensitive document and prevent it from being forwarded. The encryption travels with the file, not just the storage location.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },

  // =========================================================================
  // ADDITIONAL DEVICE MANAGEMENT
  // =========================================================================
  {
    id: 'app-protection',
    name: 'App Protection Policies (MAM)',
    friendlyName: 'Protect company data in mobile apps',
    category: 'device-management',
    description: "Control how company data is handled inside mobile apps — prevent copy/paste to personal apps, require a PIN to open work apps, and wipe company data without touching personal files.",
    businessImpact: "If your team uses personal phones for work email, app protection policies let you protect company data without managing the whole device. You can stop people copying work emails into personal apps, require a PIN to open Outlook, and wipe only the company data if they leave — their photos and personal apps stay untouched.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'bitlocker-management',
    name: 'BitLocker Management',
    friendlyName: 'Manage disk encryption across your fleet',
    category: 'device-management',
    description: "Centrally manage BitLocker disk encryption on Windows devices through Intune — enforce encryption, store recovery keys, and monitor compliance.",
    businessImpact: "BitLocker encrypts the hard drive so if a laptop is lost or stolen, the data can't be read. With Intune, you can enforce this across all devices, store recovery keys centrally (so you don't lose them), and see which devices aren't encrypted yet. Essential for any business with laptops leaving the office.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },

  // =========================================================================
  // ADDITIONAL COMPLIANCE
  // =========================================================================
  {
    id: 'ediscovery-standard',
    name: 'eDiscovery (Standard)',
    friendlyName: 'Search and export content for investigations',
    category: 'compliance',
    description: "Search across mailboxes, SharePoint sites, and Teams conversations to find specific content. Place legal holds on mailboxes and export results for review.",
    businessImpact: "If you ever need to find all emails between two people about a specific topic — for an internal investigation, a legal matter, or a compliance audit — eDiscovery lets you search across everything and export the results. Legal holds prevent people from deleting relevant data while an investigation is active.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'communication-compliance',
    name: 'Communication Compliance',
    friendlyName: 'Monitor communications for policy violations',
    category: 'compliance',
    description: "Detect inappropriate, sensitive, or non-compliant content in emails, Teams messages, and third-party channels using built-in or custom policies.",
    businessImpact: "Communication Compliance scans messages for things like harassment, threats, sharing of sensitive information, or regulatory violations. It's primarily used in financial services, healthcare, and government where there are strict rules about what can and can't be communicated through business channels.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },

  // =========================================================================
  // ADDITIONAL AI & AUTOMATION
  // =========================================================================
  {
    id: 'power-virtual-agents',
    name: 'Copilot Studio (Power Virtual Agents)',
    friendlyName: 'Build chatbots without code',
    category: 'ai-automation',
    description: "Create chatbots for Teams, websites, and other channels that can answer common questions, look up information, and hand off to a human when needed.",
    businessImpact: "If your team answers the same questions over and over — IT help desk, HR policies, client FAQs — a chatbot can handle the common ones automatically. Copilot Studio (formerly Power Virtual Agents) lets you build these with a visual designer. Basic capabilities are included; advanced features need additional licensing.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },

  // =========================================================================
  // ADDITIONAL ANALYTICS
  // =========================================================================
  {
    id: 'power-bi-pro',
    name: 'Power BI Pro',
    friendlyName: 'Business intelligence and data visualisation',
    category: 'analytics',
    description: "Connect to data sources, build interactive dashboards and reports, and share them with colleagues. Included in E5; available as an add-on for other plans.",
    businessImpact: "Power BI turns your business data into visual dashboards and reports. Connect it to Excel, SharePoint, SQL databases, or hundreds of other sources and build live dashboards that update automatically. Useful for sales reporting, financial tracking, and operational metrics. Included in E5, otherwise around $15/user/month as an add-on.",
    tiers: {
      'biz-basic': 'add-on',
      'biz-standard': 'add-on',
      'biz-premium': 'add-on',
      'e3': 'add-on',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'add-on'
    },
    commonlyUnused: false,
    setupComplexity: 'moderate'
  },
  {
    id: 'microsoft-to-do',
    name: 'Microsoft To Do',
    friendlyName: 'Personal task management',
    category: 'analytics',
    description: "A simple task list app that syncs across devices and integrates with Outlook tasks and Planner. Set reminders, due dates, and organise with lists.",
    businessImpact: "To Do is a personal task manager that pulls together your Outlook flagged emails, Planner tasks, and anything else you add. It's simple — nothing fancy — but having everything in one place with reminders means fewer things fall through the cracks. Works on phone, desktop, and web.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },

  // =========================================================================
  // ADDITIONAL IDENTITY & ACCESS
  // =========================================================================
  {
    id: 'group-based-licensing',
    name: 'Group-Based Licence Assignment',
    friendlyName: 'Assign licences automatically based on groups',
    category: 'identity',
    description: "Automatically assign M365 licences based on group membership — add someone to a group and they get the right licence and services without manual admin work.",
    businessImpact: "Instead of manually assigning licences to each new user, group-based licensing does it automatically. Add someone to the 'Marketing' group and they get the right licence, apps, and services. Remove them and the licence is freed up. Saves admin time and reduces errors, especially as your team grows.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },

  // =========================================================================
  // ADDITIONAL COLLABORATION
  // =========================================================================
  {
    id: 'teams-recording-transcription',
    name: 'Meeting Recording & Transcription',
    friendlyName: 'Record meetings and get automatic transcripts',
    category: 'collaboration',
    description: "Record Teams meetings to OneDrive or SharePoint with automatic transcription. Search through transcripts to find specific discussions.",
    businessImpact: "Record important meetings so people who couldn't attend can catch up later. The automatic transcript means you can search for specific topics without watching the whole recording. Transcripts are surprisingly accurate and save someone from having to take detailed meeting notes.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },
  {
    id: 'teams-breakout-rooms',
    name: 'Teams Breakout Rooms',
    friendlyName: 'Split meetings into smaller groups',
    category: 'collaboration',
    description: "During a Teams meeting, split participants into smaller groups for discussions, workshops, or brainstorming sessions, then bring everyone back together.",
    businessImpact: "Breakout rooms are great for workshops, training sessions, and team brainstorming. Split 20 people into groups of 4, give them a task, and pull everyone back for a debrief. It's a feature that most people don't know exists but makes virtual workshops actually work.",
    tiers: {
      'biz-basic': 'included',
      'biz-standard': 'included',
      'biz-premium': 'included',
      'e3': 'included',
      'e5': 'included',
      'f1': 'included',
      'f3': 'included'
    },
    commonlyUnused: false,
    setupComplexity: 'simple'
  },

  // =========================================================================
  // ADDITIONAL SECURITY
  // =========================================================================
  {
    id: 'defender-cloud-apps',
    name: 'Microsoft Defender for Cloud Apps',
    friendlyName: 'See what cloud apps your team is using',
    category: 'security',
    description: "Discover and control which cloud apps your team is using — shadow IT detection, app risk scoring, session controls, and policy enforcement across cloud services.",
    businessImpact: "Your team is probably using cloud apps you don't know about — file sharing services, project management tools, AI tools. Defender for Cloud Apps discovers them, scores their risk, and lets you block or monitor the risky ones. It also gives you session controls for approved apps so you can prevent downloads of sensitive data.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  },
  {
    id: 'defender-identity',
    name: 'Microsoft Defender for Identity',
    friendlyName: 'Detect identity-based attacks in real time',
    category: 'security',
    description: "Monitors your on-premises Active Directory (if you have one) for signs of compromise — lateral movement, privilege escalation, and reconnaissance attacks.",
    businessImpact: "If you have on-premises Active Directory synced to M365, Defender for Identity watches for attacks targeting your identity infrastructure. It detects things like pass-the-hash attacks, lateral movement between machines, and reconnaissance. It's an enterprise-grade tool included in E5 that most businesses don't realise they have.",
    tiers: {
      'biz-basic': 'not-available',
      'biz-standard': 'not-available',
      'biz-premium': 'not-available',
      'e3': 'not-available',
      'e5': 'included',
      'f1': 'not-available',
      'f3': 'not-available'
    },
    commonlyUnused: false,
    setupComplexity: 'complex'
  }
];

// ---------------------------------------------------------------------------
// PRICING DISCLAIMER
// ---------------------------------------------------------------------------
const PRICING_DISCLAIMER = 'Prices shown are in AUD, ex-GST, per user per month on an annual commitment. Prices current as of March 2026. Check Microsoft\'s website for the latest pricing. Some plans may see price changes from July 2026.';

// ---------------------------------------------------------------------------
// EXPORT
// ---------------------------------------------------------------------------
window.M365Data = {
  LICENCE_TIERS,
  CATEGORIES,
  FEATURES,
  PRICING_DISCLAIMER,
  tiers: LICENCE_TIERS,
  licenceTiers: LICENCE_TIERS,
  categories: CATEGORIES,
  features: FEATURES
};
