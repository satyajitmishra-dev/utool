import { RegistryTool, IntentVariantType, ToolCategory } from '@/types/tool-registry';

export interface IntentVariantConfig {
  intent: IntentVariantType;
  /** Override slug suffix. Default: intent string. */
  slugSuffix?: string;
  /** Override display name suffix. */
  nameSuffix?: string;
}

export interface BaseToolConfig {
  id: string;
  slug: string;
  name: string;
  /** Verb phrase used in content, e.g. "convert PNG to PDF" */
  actionPhrase: string;
  description: string;
  category: ToolCategory;
  primaryTag: string;
  iconTag: string;
  isConverter?: boolean;
  supportedInputFormats?: string[];
  supportedOutputFormats?: string[];
  relatedTools?: string[];
  parentCategoryHref?: string;
}

// Intent-specific content blocks
const INTENT_METADATA: Record<IntentVariantType, {
  badge: string;
  nameSuffix: string;
  slugSuffix: string;
  intentKeyword: string;
  uniqueAngle: string;
}> = {
  'online':            { badge: 'Works Online',         nameSuffix: 'Online',              slugSuffix: 'online',              intentKeyword: 'online',               uniqueAngle: 'no software to install — works directly in your web browser' },
  'offline':           { badge: 'Works Offline',        nameSuffix: 'Offline',             slugSuffix: 'offline',             intentKeyword: 'offline',              uniqueAngle: 'fully offline after page load — no internet connection required' },
  'mobile':            { badge: 'Mobile-Friendly',      nameSuffix: 'on Mobile',           slugSuffix: 'mobile',              intentKeyword: 'on mobile',            uniqueAngle: 'optimized for phones and tablets — touch-friendly interface' },
  'windows':           { badge: 'Works on Windows',     nameSuffix: 'on Windows',          slugSuffix: 'windows',             intentKeyword: 'on Windows',           uniqueAngle: 'runs in any Windows browser — no desktop app or admin rights needed' },
  'mac':               { badge: 'Works on Mac',         nameSuffix: 'on Mac',              slugSuffix: 'mac',                 intentKeyword: 'on Mac',               uniqueAngle: 'fully compatible with macOS — works in Safari, Chrome, and Firefox' },
  'iphone':            { badge: 'Works on iPhone',      nameSuffix: 'on iPhone',           slugSuffix: 'iphone',              intentKeyword: 'on iPhone',            uniqueAngle: 'optimized for iOS Safari — no app download, runs in mobile browser' },
  'android':           { badge: 'Works on Android',     nameSuffix: 'on Android',          slugSuffix: 'android',             intentKeyword: 'on Android',           uniqueAngle: 'works in Chrome on Android — fast, responsive, no Play Store needed' },
  'batch':             { badge: 'Batch Processing',     nameSuffix: 'in Bulk',             slugSuffix: 'batch',               intentKeyword: 'batch',                uniqueAngle: 'process multiple files at once — ideal for large workloads' },
  'high-quality':      { badge: 'High Quality',         nameSuffix: 'High Quality',        slugSuffix: 'high-quality',        intentKeyword: 'high quality',         uniqueAngle: 'preserves maximum resolution, DPI, and fidelity — lossless output' },
  'without-uploading': { badge: 'No Upload Required',   nameSuffix: 'Without Uploading',   slugSuffix: 'without-uploading',   intentKeyword: 'without uploading',    uniqueAngle: 'completely private — files are never sent to any server' },
  'in-browser':        { badge: 'In-Browser',           nameSuffix: 'in Browser',          slugSuffix: 'in-browser',          intentKeyword: 'in browser',           uniqueAngle: 'runs 100% client-side using WebAssembly — no backend involved' },
  'large-files':       { badge: 'No Size Limits',       nameSuffix: 'Large Files',         slugSuffix: 'large-files',         intentKeyword: 'large files',          uniqueAngle: 'no file size caps — processing runs on your own device CPU' },
  'lossless':          { badge: 'Lossless Output',      nameSuffix: 'Lossless',            slugSuffix: 'lossless',            intentKeyword: 'lossless',             uniqueAngle: 'zero quality loss — pixel-perfect conversion with no compression artifacts' },
  'free':              { badge: '100% Free',            nameSuffix: 'Free',                slugSuffix: 'free',                intentKeyword: 'free',                 uniqueAngle: 'completely free with no watermarks, no limits, and no sign-up required' },
  'fast':              { badge: 'Lightning Fast',       nameSuffix: 'Fast',                slugSuffix: 'fast',                intentKeyword: 'fast',                 uniqueAngle: 'executes in milliseconds using optimized WebAssembly engines' },
};

function buildIntentIntro(base: BaseToolConfig, meta: typeof INTENT_METADATA[IntentVariantType]): string {
  const { actionPhrase, name } = base;
  const { intentKeyword, uniqueAngle } = meta;
  return `Looking to ${actionPhrase} ${intentKeyword}? utool's ${name} is ${uniqueAngle}. Unlike cloud-based tools that upload your files to remote servers, utool processes everything locally in your browser — so your documents stay completely private and the results arrive instantly, with no waiting for uploads or downloads.`;
}

function buildHowItWorks(base: BaseToolConfig, intent: IntentVariantType): string[] {
  const open = `Open the ${base.name} page on utool${
    intent === 'mobile' || intent === 'iphone' || intent === 'android'
      ? ' in your mobile browser'
      : intent === 'offline'
      ? ' (one-time page load required)'
      : ''
  }.`;

  const steps: Record<string, string[]> = {
    batch: [
      open,
      `Click "Add Files" and select multiple files at once from your device.`,
      `Review the file list and adjust any per-file settings if needed.`,
      `Click the action button to process all files simultaneously in your browser.`,
      `Download each output file or use the "Download All" option for a ZIP archive.`,
    ],
    offline: [
      open,
      `After the page loads, you may disconnect from the internet.`,
      `Select your file or paste your input into the tool workspace.`,
      `Click the action button — processing runs entirely offline in your browser.`,
      `Download the result directly to your device.`,
    ],
    mobile: [
      open,
      `Tap "Select File" and choose from your phone's photo library or file storage.`,
      `Adjust any settings using the mobile-optimized controls.`,
      `Tap the action button — conversion runs locally on your device.`,
      `Tap "Download" to save the output to your phone.`,
    ],
    iphone: [
      open,
      `Tap "Select File" and pick your file from Photos, Files, or iCloud Drive.`,
      `Adjust settings as needed — all controls are touch-optimised for iOS.`,
      `Tap the action button to process. Safari runs the conversion natively.`,
      `Tap "Download" or use the share sheet to save to Files or iCloud Drive.`,
    ],
    android: [
      open,
      `Tap "Select File" and choose from Google Drive, Downloads, or local storage.`,
      `Adjust settings — the interface is fully responsive for Android screens.`,
      `Tap the action button. Chrome on Android runs the full WebAssembly engine.`,
      `Tap "Download" to save the result to your device storage.`,
    ],
    'high-quality': [
      open,
      `Select your input file. utool reads metadata to detect original quality settings.`,
      `Choose "High Quality" or "Lossless" output mode from the settings panel.`,
      `Click the action button. The engine preserves all resolution, DPI, and color data.`,
      `Download your high-fidelity output file.`,
    ],
    'without-uploading': [
      open,
      `Select your file from your local drive — it loads directly into browser memory.`,
      `Verify the file preview: your data never leaves your computer at this stage.`,
      `Click the action button. All processing happens in WebAssembly inside your browser tab.`,
      `Download the output. No data was transmitted to any server at any point.`,
    ],
    'large-files': [
      open,
      `Click "Select File" and choose your large file. Browser memory handles it locally.`,
      `Monitor the progress bar — large files are processed in streaming chunks.`,
      `Click the action button. Your device CPU handles the conversion with no size caps.`,
      `Download the output when processing completes.`,
    ],
  };

  const defaultSteps = [
    open,
    `Select or drop your input file into the workspace.`,
    `Adjust any output settings to match your requirements.`,
    `Click the action button to process your file instantly in the browser.`,
    `Download the result to your device.`,
  ];

  return steps[intent] ?? defaultSteps;
}

function buildFAQs(base: BaseToolConfig, intent: IntentVariantType, meta: typeof INTENT_METADATA[IntentVariantType]) {
  const { name, actionPhrase } = base;
  const { intentKeyword } = meta;

  const sharedFAQ = {
    question: `Is it safe to ${actionPhrase} on utool?`,
    answer: `Yes, completely safe. utool processes your files locally inside your browser using WebAssembly. Your data is never sent to our servers, logged, or stored anywhere.`,
  };

  const intentFAQs: Record<string, typeof sharedFAQ[]> = {
    online: [
      sharedFAQ,
      { question: `Do I need to install any software to use ${name} online?`, answer: `No installation required. utool runs fully in your web browser — Chrome, Firefox, Edge, and Safari are all supported. Just open the page and start using it.` },
      { question: `Is there a file size limit for using this tool online?`, answer: `No. Because processing happens in your browser on your own device, there are no server-side size limits or paywalls.` },
      { question: `Does utool work on all browsers?`, answer: `Yes. utool is compatible with all modern browsers — Chrome, Firefox, Edge, Safari, and Opera — on both desktop and mobile.` },
    ],
    offline: [
      sharedFAQ,
      { question: `How do I use ${name} offline?`, answer: `Simply open the utool page while you have internet access. After the page fully loads, you can disconnect from the internet and the tool will continue to work locally using browser-cached resources.` },
      { question: `Does utool require an active internet connection?`, answer: `Only for the initial page load. Once loaded, all processing runs offline in your browser. No internet is needed to ${actionPhrase}.` },
      { question: `Will my progress be saved if I go offline?`, answer: `Yes, the tool session stays active in your browser tab whether you're online or offline. Your input data remains in browser memory until you close the tab.` },
    ],
    mobile: [
      sharedFAQ,
      { question: `Can I ${actionPhrase} on my phone?`, answer: `Yes. utool is fully responsive and works on smartphones and tablets. The interface adapts to touchscreens, and all processing runs locally on your mobile device.` },
      { question: `Do I need to download an app to use this on mobile?`, answer: `No app needed. Just open utool in your mobile browser (Chrome on Android, Safari on iPhone) and the tool is ready to use.` },
      { question: `Will conversion be slower on mobile?`, answer: `Performance depends on your device. Modern mid-range smartphones can process most files in a few seconds. For very large files, a desktop browser will be faster.` },
    ],
    iphone: [
      sharedFAQ,
      { question: `Does ${name} work on iPhone?`, answer: `Yes. utool works in Safari on iPhone and iPad. No app download is needed — open the page in Safari and use the tool directly.` },
      { question: `How do I save the output to my iPhone?`, answer: `After processing, tap "Download". Safari will prompt you to open with Files, save to iCloud Drive, or share via AirDrop. You can also long-press the download button for more options.` },
      { question: `Does it work on older iPhones?`, answer: `utool requires iOS 14 or later for full WebAssembly support. iPhones from 2017 onwards (iPhone 6s+) with updated iOS should work without issues.` },
    ],
    android: [
      sharedFAQ,
      { question: `Does ${name} work on Android phones?`, answer: `Yes. Chrome on Android supports the full WebAssembly engine that utool uses. Just open utool in Chrome and the tool works exactly as on desktop.` },
      { question: `Can I access files from Google Drive on Android?`, answer: `Yes. When selecting files, Android's file picker lets you access Google Drive, local storage, and SD cards. Choose your file and the tool loads it into browser memory.` },
      { question: `Where are downloaded files saved on Android?`, answer: `Files are saved to your Downloads folder by default in Chrome on Android. You can access them via the Files app or Downloads manager.` },
    ],
    batch: [
      sharedFAQ,
      { question: `How many files can I process at once in batch mode?`, answer: `You can process dozens of files simultaneously. Since processing runs on your own device's CPU, the only limits are your available browser memory and device performance.` },
      { question: `Can I batch ${actionPhrase} with different settings per file?`, answer: `Yes. After adding multiple files, you can individually adjust settings for each file, or apply global settings to all files at once for speed.` },
      { question: `Will I get separate output files for each input in batch mode?`, answer: `Yes. Each input file produces its own output file. You can download them individually or use the "Download All as ZIP" option.` },
    ],
    'high-quality': [
      sharedFAQ,
      { question: `Will the output quality be the same as the original?`, answer: `Yes. utool's high-quality mode preserves the original DPI, color depth, and resolution. No lossy compression is applied unless you explicitly choose it.` },
      { question: `What does "lossless" mean in this context?`, answer: `Lossless means no image or data quality is sacrificed during conversion. Every pixel, vector element, and metadata value is preserved exactly as it was in the source file.` },
      { question: `Can I choose the output DPI when using high-quality mode?`, answer: `Yes. The settings panel lets you specify target DPI (72, 150, 300, or custom). For print, 300 DPI is recommended. For screen use, 72–150 DPI is typically sufficient.` },
    ],
    'without-uploading': [
      sharedFAQ,
      { question: `Does utool upload my files to a server?`, answer: `Never. utool processes files 100% in your browser using WebAssembly. Your files are read into browser memory locally and are never transmitted over the network.` },
      { question: `How can I verify that my files are not being uploaded?`, answer: `You can open your browser's developer tools (F12), go to the Network tab, and monitor network activity while using the tool. You will see zero file upload requests.` },
      { question: `Is this tool GDPR-compliant?`, answer: `Yes. Since no personal data or file content is transmitted to our servers, utool's client-side processing model is inherently GDPR and CCPA compliant.` },
    ],
    'large-files': [
      sharedFAQ,
      { question: `Is there a maximum file size limit?`, answer: `No server-imposed limit. utool processes files in your browser using your own device memory. Practical limits depend on your device RAM — most computers can handle files up to several gigabytes.` },
      { question: `Why is local processing better for large files?`, answer: `Cloud tools make you upload large files to their servers, which takes time and consumes your bandwidth. utool bypasses this entirely — your large file is processed instantly without any upload wait.` },
      { question: `Will processing a large file slow down my browser?`, answer: `utool processes large files in streaming chunks to avoid freezing your browser tab. For very large files (1GB+), we recommend closing other heavy browser tabs to free up memory.` },
    ],
    lossless: [
      sharedFAQ,
      { question: `What makes the output truly lossless?`, answer: `utool reads the source file's raw binary data and re-encodes it using lossless algorithms. No pixel values are approximated, averaged, or discarded during conversion.` },
      { question: `Is lossless the same as high quality?`, answer: `Lossless is the highest quality tier — it means zero information is lost during conversion. "High quality" may still apply gentle compression, while lossless applies none.` },
      { question: `Will a lossless output file be larger than a compressed one?`, answer: `Usually yes. Lossless files retain all data, which produces larger file sizes than lossy-compressed formats. If file size matters, consider using the high-quality (not lossless) option.` },
    ],
    'in-browser': [
      sharedFAQ,
      { question: `What does "in-browser" processing mean?`, answer: `It means the entire conversion happens inside your browser tab using JavaScript and WebAssembly. No data is sent anywhere — your CPU does the work, not a cloud server.` },
      { question: `What technology powers the in-browser processing?`, answer: `utool uses WebAssembly (WASM) — a binary instruction format that runs at near-native speed in browsers. This enables complex file operations without any server-side code.` },
      { question: `Does in-browser processing work in all browsers?`, answer: `WebAssembly is supported in all modern browsers including Chrome 57+, Firefox 52+, Safari 11+, and Edge 16+. If your browser is up to date, utool will work.` },
    ],
    free: [
      sharedFAQ,
      { question: `Is ${name} really free with no hidden costs?`, answer: `Yes. utool's free tools have no watermarks, no file count limits, and no sign-up requirements. The tool is free to use for everyone, forever.` },
      { question: `Do I need to create an account to use this free tool?`, answer: `No account needed. Just open the page and start using the tool immediately. Creating an account unlocks additional premium features, but the core functionality is always free.` },
      { question: `Are there any ads or upsells during free use?`, answer: `No intrusive ads or forced upsells. utool is free to use without interruptions. Premium plans are available for power users who need advanced features.` },
    ],
    fast: [
      sharedFAQ,
      { question: `Why is utool faster than other online tools?`, answer: `Because utool processes files locally in your browser. Other tools make you upload your file to a cloud server, wait for processing, then download the result. utool skips all of that — processing starts instantly the moment you click the button.` },
      { question: `What technology makes utool fast?`, answer: `utool uses WebAssembly (WASM), which runs compiled code at near-native CPU speeds inside the browser. This is orders of magnitude faster than interpreted JavaScript for compute-intensive file operations.` },
      { question: `How fast is the processing typically?`, answer: `Most standard files (under 10MB) are processed in under 2 seconds. Large files (50–200MB) typically take 5–15 seconds depending on your device CPU speed.` },
    ],
  };

  return intentFAQs[intent] ?? [sharedFAQ,
    { question: `Do I need to create an account?`, answer: `No account is required. All tools are freely accessible without registration.` },
    { question: `Is there a file size limit?`, answer: `No server-side limits. Processing is local to your device, so limits depend only on your available memory.` },
  ];
}

function buildLongFormContent(base: BaseToolConfig, intent: IntentVariantType, meta: typeof INTENT_METADATA[IntentVariantType]) {
  const { name, actionPhrase } = base;
  const { intentKeyword, uniqueAngle } = meta;

  const sections: Record<string, { sectionTitle: string; paragraphs: string[] }[]> = {
    offline: [{
      sectionTitle: `How ${name} Works Without an Internet Connection`,
      paragraphs: [
        `Most online tools misleadingly call themselves "online" but actually require a constant internet connection to upload your files to remote servers for processing. utool is different — it runs entirely inside your browser using WebAssembly, which means processing happens locally on your CPU.`,
        `The only network request utool makes is the initial page load. After that, you can disconnect your Wi-Fi or unplug your ethernet cable, and the tool will continue to work perfectly. This makes utool ideal for offline environments like airplanes, rural areas with spotty coverage, or secure network-isolated workstations.`,
      ]
    }, {
      sectionTitle: `Why Offline Processing Matters for Privacy`,
      paragraphs: [
        `When you ${actionPhrase} on a server-based tool, your file travels through the internet to a third-party data center. This exposes your document to man-in-the-middle risks, server-side logging, and potential data retention. With utool's offline-capable engine, your file never leaves your machine — not even during the initial page load.`,
        `This architecture is compliant with strict data governance policies, including GDPR and HIPAA, because no personal data or file content is ever transmitted externally.`,
      ]
    }],
    mobile: [{
      sectionTitle: `${name} Optimised for Mobile Browsers`,
      paragraphs: [
        `Mobile users often struggle with desktop-only web tools that require mouse interactions, show tiny text, or break on small screens. utool's interface is built responsive-first — every control, button, and file picker is designed for touch input and small viewports.`,
        `On mobile, utool uses the browser's native file picker API to access your camera roll, file app, or cloud storage (Google Drive, iCloud) without requiring any app installation. The WebAssembly engine runs on your phone's CPU, so conversion speeds are comparable to desktop for standard file sizes.`,
      ]
    }],
    batch: [{
      sectionTitle: `Why Batch Processing Saves Time for High-Volume Workflows`,
      paragraphs: [
        `Manual one-by-one file processing is a productivity bottleneck. For teams handling invoice archives, photo collections, or document exports, the ability to ${actionPhrase} in bulk is essential. utool's batch engine queues all selected files and processes them concurrently using your device's available CPU threads.`,
        `Unlike server-based batch tools that impose per-session limits or require paid plans for bulk processing, utool's client-side batch mode is unlimited. You can process 5 files or 500 files with exactly the same workflow.`,
      ]
    }],
    'high-quality': [{
      sectionTitle: `Preserving Quality During File Conversion`,
      paragraphs: [
        `Many free online converters degrade quality to save server bandwidth and storage costs. They compress images more aggressively, reduce DPI, or strip metadata. utool's high-quality mode is designed around a different principle: preserve every bit of data from the source file.`,
        `When you ${actionPhrase} in high-quality mode on utool, the WebAssembly engine reads the raw binary data of your source file and re-encodes it at the target format's maximum fidelity settings. No pixel averaging, no lossy compression steps, no metadata stripping — unless you explicitly choose those options.`,
      ]
    }],
    'without-uploading': [{
      sectionTitle: `The Privacy Case for Client-Side File Processing`,
      paragraphs: [
        `Every time you upload a file to a web service, you create a risk surface. The file travels over the internet, lands on a third-party server, gets processed by code you cannot inspect, and may be retained for days. Even "privacy-focused" cloud tools store temporary copies for their processing pipelines.`,
        `utool eliminates this entirely. The moment you select a file, it is read into your browser's sandboxed memory using the FileReader API. WebAssembly code compiled from battle-tested C++ libraries then processes it entirely within that sandbox. When processing completes, your input file is garbage-collected from memory — it was never sent anywhere.`,
      ]
    }],
    'large-files': [{
      sectionTitle: `Handling Large Files Without Server Upload Bottlenecks`,
      paragraphs: [
        `Cloud-based file tools impose size limits for a reason: uploading large files is expensive for them (bandwidth costs, storage costs) and slow for you (upload time). A 500MB file on a 50 Mbps connection takes around 80 seconds to upload, before processing even starts.`,
        `utool bypasses upload latency entirely. Your large file goes straight into browser memory and is processed by your CPU at full local bus speeds. A 500MB file that would take 2 minutes to process on a cloud tool can often be done in 10–20 seconds on utool — with no internet speed bottleneck.`,
      ]
    }],
    fast: [{
      sectionTitle: `Why Browser-Native Processing is Faster Than Cloud Tools`,
      paragraphs: [
        `The speed advantage of utool comes from eliminating the upload-process-download cycle entirely. When you click the action button, processing starts in the same millisecond. There's no HTTP request leaving your browser, no queuing on a remote server, no download of the result from across the internet.`,
        `utool's WebAssembly engine runs compiled binary code in your browser at near-native CPU speeds. For a typical file operation, this means results in 1–3 seconds, regardless of your internet speed — which is entirely irrelevant once the page is loaded.`,
      ]
    }],
  };

  const defaultSection = [{
    sectionTitle: `Why ${name} Is Better Than Server-Based Alternatives`,
    paragraphs: [
      `Traditional web tools process your files on external cloud servers. This introduces upload latency, privacy risks, and arbitrary file size limits. utool solves all of these problems by shifting every computation to your local browser using WebAssembly.`,
      `The result is a tool that is faster (no upload wait), more private (no server contact), and unlimited (no server costs to pass on to you). Whether you need to ${actionPhrase} ${intentKeyword} occasionally or hundreds of times per day, utool handles it with consistent, instant performance.`,
    ]
  }];

  return sections[intent] ?? defaultSection;
}

function buildCommonMistakes(base: BaseToolConfig, intent: IntentVariantType): string[] {
  const { actionPhrase } = base;
  const intentMistakes: Record<string, string[]> = {
    offline: [
      'Closing the browser tab before the page fully loads — the offline engine requires one complete page load to cache correctly.',
      'Assuming other browser tabs will work offline — only the loaded utool page is cached for offline use.',
    ],
    batch: [
      'Adding more files than your device can hold in RAM — for very large batches of large files, process in smaller groups.',
      'Expecting all files to have identical output settings — review per-file settings before processing if files have different requirements.',
    ],
    'high-quality': [
      'Confusing "high quality" with lossless — high quality applies minimal compression while lossless applies zero compression.',
      'Assuming higher DPI always looks better on screen — for digital display, 72–96 DPI is optimal; 300 DPI is for print only.',
    ],
    'large-files': [
      'Running other memory-heavy applications simultaneously — close unused apps and browser tabs before processing very large files.',
      'Expecting instant results for multi-gigabyte files — local processing is fast but still bounded by your CPU and RAM speed.',
    ],
  };

  return intentMistakes[intent] ?? [
    `Not checking the output file before closing the browser tab — always preview or save the result first.`,
    `Using an outdated browser — utool requires modern WebAssembly support. Update to the latest version of Chrome, Firefox, or Safari.`,
    `Trying to ${actionPhrase} a password-protected file directly — remove protection first using the utool Unlock PDF tool.`,
  ];
}

/** Generate a full RegistryTool entry for a specific intent variant of a base tool */
export function generateIntentVariant(base: BaseToolConfig, variantCfg: IntentVariantConfig): RegistryTool {
  const { intent, slugSuffix, nameSuffix } = variantCfg;
  const meta = INTENT_METADATA[intent];

  const resolvedSlugSuffix = slugSuffix ?? meta.slugSuffix;
  const resolvedNameSuffix = nameSuffix ?? meta.nameSuffix;

  const slug = `${base.slug}-${resolvedSlugSuffix}`;
  const name = `${base.name} ${resolvedNameSuffix}`;
  const id = slug;

  const titleKeyword = `${base.name} ${resolvedNameSuffix}`;

  return {
    id,
    slug,
    name,
    description: `${base.description} ${meta.badge} — ${meta.uniqueAngle}.`,
    primaryTag: base.primaryTag,
    category: base.category,
    iconTag: base.iconTag,
    isActive: true,
    isConverter: base.isConverter,
    supportedInputFormats: base.supportedInputFormats,
    supportedOutputFormats: base.supportedOutputFormats,

    // pSEO variant fields
    intentVariant: intent,
    parentToolSlug: base.slug,
    intentContext: meta.badge,
    noIndex: false,

    seoMeta: {
      title: `${titleKeyword} — Free, Private & Instant | utool`,
      description: `${base.description} ${resolvedNameSuffix.toLowerCase()}. ${meta.uniqueAngle}. No uploads, no limits, no sign-up required. Try utool free.`,
      keywords: [
        `${base.name.toLowerCase()} ${meta.intentKeyword}`,
        `${base.name.toLowerCase()} ${meta.slugSuffix.replace(/-/g, ' ')}`,
        base.name.toLowerCase(),
        meta.intentKeyword,
        'free',
        'browser',
        'no upload',
      ],
      h1: `${base.name} ${resolvedNameSuffix}`,
    },

    intro: buildIntentIntro(base, meta),
    howItWorks: buildHowItWorks(base, intent),
    benefits: [
      {
        title: meta.badge,
        desc: `This tool is specifically ${meta.uniqueAngle}. No compromises, no workarounds needed.`,
      },
      {
        title: '100% Client-Side Privacy',
        desc: 'Your files are never uploaded to any server. Processing runs entirely inside your browser using WebAssembly.',
      },
      {
        title: 'Free, No Sign-Up',
        desc: 'Use the full tool without creating an account, entering payment details, or dealing with watermarks.',
      },
    ],
    faqs: buildFAQs(base, intent, meta),
    longFormContent: buildLongFormContent(base, intent, meta),
    commonMistakes: buildCommonMistakes(base, intent),
    privacyExplanation: `All file processing for ${name} happens exclusively inside your browser tab. utool uses WebAssembly (WASM) compiled from open-source libraries to perform operations locally on your device. At no point during the process is any data transmitted over the network. You can verify this yourself by opening your browser's Network Inspector (F12 → Network) and observing that no file upload requests are made.`,

    relatedTools: [
      base.slug,
      ...(base.relatedTools ?? []),
    ].filter(Boolean),
  };
}

/** Generate multiple intent variants for a single base tool */
export function generateIntentVariants(base: BaseToolConfig, intents: IntentVariantConfig[]): RegistryTool[] {
  return intents.map(cfg => generateIntentVariant(base, cfg));
}
