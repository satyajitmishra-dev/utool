import { RegistryTool } from '@/types/tool-registry';

const STATIC_TOOL_REGISTRY: RegistryTool[] = [
  {
    "id": "merge-pdf",
    "slug": "merge-pdf",
    "name": "Merge PDF",
    "description": "Combine PDF files online instantly.",
    "primaryTag": "PDF",
    "category": "PDF",
    "iconTag": "FileText",
    "isActive": true,
    "seoMeta": {
      "title": "Merge PDF Online Free — 100% Secure & No File Limits | utool",
      "description": "Combine PDF files online instantly. 100% secure client-side merging—your documents never leave your browser. Free forever with zero limits. Try utool!",
      "keywords": [],
      "h1": "Merge PDF Documents Online Free"
    },
    "intro": "Need to combine report sections, compile invoices, or merge client presentations? utool's Merge PDF utility offers a seamless, secure, and lightning-fast way to compile multiple files in any sequence. Unlike other online converters that process your private documents on remote cloud servers, utool's compression and compilation engine operates entirely in your local browser, meaning your files never leave your computer.",
    "howItWorks": [
      "Select and upload the PDF documents you want to merge.",
      "Drag and drop the file cards to arrange them in your preferred sequence.",
      "Click the 'Merge PDF' button to compile the files instantly.",
      "Download your combined document directly to your device."
    ],
    "benefits": [
      {
        "title": "100% Client-Side Privacy",
        "desc": "Your documents never touch our servers. All merging is compiled locally in your browser sandbox, keeping confidential records safe."
      },
      {
        "title": "Zero Size & Count Limits",
        "desc": "Since processing runs on your own device's CPU, you can compile massive files or merge dozens of PDFs without paywalls."
      },
      {
        "title": "Formatting & Quality Safe",
        "desc": "We preserve vector fonts, high-definition images, active links, tables of contents, and structural layouts perfectly."
      }
    ],
    "faqs": [
      {
        "question": "Is it safe to merge my PDFs on utool?",
        "answer": "Yes, 100% secure. utool uses WebAssembly and local JavaScript processing to combine your files directly within your web browser. Your documents are never uploaded to our servers, ensuring absolute confidentiality and compliance with privacy standard acts."
      },
      {
        "question": "What is the maximum file size limit for merging PDFs?",
        "answer": "There are no size limits. Because the processing occurs locally on your own computer, you can merge exceptionally large PDF files without running into paywalls or file caps."
      },
      {
        "question": "Can I merge PDF files offline?",
        "answer": "Yes. Once the utool app page is loaded in your browser, the local tools run offline. You can disconnect from the internet and still merge, split, or compress your PDF documents."
      },
      {
        "question": "Will merging PDFs degrade page quality?",
        "answer": "No. The local merging process compiles document streams directly without rasterizing the pages. Your text, vector elements, fonts, active links, and images remain identical in quality and formatting."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Why Local Browser PDF Merging is Safer than Cloud Tools",
        "paragraphs": [
          "When you merge PDF files on traditional platforms like iLovePDF or Smallpdf, your files are uploaded to their cloud servers. This exposes sensitive financial statements, patient records, or business contracts to security vulnerabilities and compliance risks. utool solves this by shifting the entire compilation process to your local browser.",
          "Our client-side processing uses optimized JavaScript engines to compile your documents locally. This means zero data latency, zero upload wait times, and compliance with strict privacy standards like GDPR and HIPAA."
        ]
      },
      {
        "sectionTitle": "Best Practices for Compiling PDF Documents Online",
        "paragraphs": [
          "To merge files smoothly, ensure none of the source documents are password-protected. If a PDF is encrypted, remove the protection before loading it into the workspace. Additionally, organizing your files with logical names helps you sequence them easily in our drag-and-drop builder.",
          "utool automatically manages pages of different sizes and orientations (portrait and landscape), scaling and fitting them seamlessly into the output file while retaining active links, form elements, and annotations."
        ]
      },
      {
        "sectionTitle": "A Professional Free Alternative to Paid Desktop PDF Software",
        "paragraphs": [
          "Instead of purchasing expensive PDF editing licenses, you can use utool as a fast and secure desktop-alternative web app. Since it runs inside your browser, it is compatible with Windows, macOS, Linux, and mobile devices, providing a unified, high-performance toolset for remote teams and individuals alike."
        ]
      }
    ],
    "relatedTools": [
      "split-pdf",
      "compress-pdf"
    ]
  },
  {
    "id": "split-pdf",
    "slug": "split-pdf",
    "name": "Split PDF",
    "description": "Extract pages or split ranges from any PDF document.",
    "primaryTag": "PDF",
    "category": "PDF",
    "iconTag": "Scissors",
    "isActive": true,
    "seoMeta": {
      "title": "Split PDF Online Free — Extract Pages Securely | Utool",
      "description": "Extract pages or split ranges from any PDF document. Free, 100% secure client-side splitting. No sign-up, no size limits, with real-time visual preview.",
      "keywords": [],
      "h1": "Split PDF Documents Online Free"
    },
    "intro": "Extracting specific pages, chapters, or contract sections from a bloated document should not require downloading expensive desktop software or uploading sensitive documents to public cloud databases. Utool's Split PDF utility lets you extract custom page ranges or split a document into separate pages instantly. Because it uses client-side compilation, the page splitting executes entirely in your browser sandbox, ensuring your private records remain secure.",
    "howItWorks": [
      "Upload the PDF document you want to split into Utool's local compiler.",
      "Enter custom page numbers, indices, or specific ranges (e.g. 1-4, 7, 9-12) in the range input.",
      "Review page count parameters and confirm your page ranges.",
      "Click the 'Split PDF' button to extract the document streams locally.",
      "Download your newly compiled PDF files directly to your device."
    ],
    "benefits": [
      {
        "title": "Visual Range Selection",
        "desc": "Select and extract individual pages or custom ranges with ease, compiling exactly what you need in a single pass."
      },
      {
        "title": "100% Browser Security",
        "desc": "Your files never leave your computer. Processing runs locally on your device, preventing database logs or leaks."
      },
      {
        "title": "High-Fidelity Formats",
        "desc": "Our engine preserves vector text, font formatting, links, annotations, and image resolutions perfectly."
      }
    ],
    "faqs": [
      {
        "question": "How do I specify which pages to extract?",
        "answer": "You can specify individual pages separated by commas (e.g., 1, 3, 5) or input custom ranges using hyphens (e.g., 2-6). You can also mix these styles, such as '1, 3-7, 10' to extract precisely what you need."
      },
      {
        "question": "Does splitting a PDF degrade its quality?",
        "answer": "No. Splitting simply extracts the requested object streams and packages them into a new document. The text, fonts, layout, and images remain identical in resolution and visual layout."
      },
      {
        "question": "Can I split encrypted or password-protected PDFs?",
        "answer": "You must remove the password protection from the document using Utool's Unlock PDF tool before loading it to allow our client-side engine to read and extract the pages."
      },
      {
        "question": "Is there a file size limit for splitting PDFs?",
        "answer": "No. Since the processing runs on your own device's CPU and memory, you can split massive, multi-page files without facing standard cloud limits."
      },
      {
        "question": "Does Utool store a backup of my split files?",
        "answer": "No. Utool operates entirely client-side. We have no databases or cloud storage holding your private documents."
      },
      {
        "question": "Can I split a PDF file on my mobile phone?",
        "answer": "Yes. Utool's visual responsive layout works on iOS and Android devices, allowing you to split PDFs directly in your mobile web browser."
      },
      {
        "question": "Can I split a PDF into individual pages?",
        "answer": "Yes. You can extract individual page indices one by one to save them as standalone document files."
      },
      {
        "question": "What library does Utool use to split PDFs?",
        "answer": "Utool utilizes optimized pdf-lib JavaScript wrappers running locally inside the browser's sandbox to read and write PDF streams."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Why Local Browser Splitting is Critical for Compliance",
        "paragraphs": [
          "For compliance-sensitive industries such as healthcare, finance, legal, and government, uploading files to public web servers is a major data security risk. Standard online PDF splitters process your documents on remote cloud servers, which are susceptible to data sniffing, database leaks, and server breaches. If a document containing client bank details or private patient medical histories is intercepted, it could violate privacy laws like HIPAA, GDPR, and CCPA.",
          "Utool solves this security issue by keeping the entire file processing local. Our client-side WebAssembly architecture compiles the new PDF streams within the browser memory on your device. This guarantees that your business records remain confidential and compliant with data handling rules, as no data is sent over the network to external systems."
        ]
      },
      {
        "sectionTitle": "A Visual Approach to Document Page Extraction",
        "paragraphs": [
          "Unlike standard tools that force you to guess page numbers without context, Utool provides a visual grid workspace. After uploading your document, Utool reads its page structure and displays individual page index metrics, allowing you to define precise page ranges.",
          "You can choose to extract a single continuous block of pages, mix individual pages with custom page ranges (e.g., page 1, pages 4 to 8, and page 12), or split the entire document into individual pages. Our responsive workspace updates in real-time, giving you total control before you compile the output."
        ]
      },
      {
        "sectionTitle": "Technical Breakdown of PDF Page Trees and Cross-Reference Streams",
        "paragraphs": [
          "Every PDF document is structured as an object graph (catalogs, page trees, content streams, and resource dictionaries) indexed by a cross-reference table. Standard splitters often rasterize pages into images, destroying searchable text and swelling file sizes.",
          "Utool's compiler reads the PDF object map, copies only the requested page nodes and their resource dependencies (fonts, images, color profiles), and writes a clean cross-reference table. This preserves vector paths, links, and searchability, resulting in lightweight, high-fidelity PDF documents."
        ]
      },
      {
        "sectionTitle": "Speed and Efficiency in High-Volume Document Workflows",
        "paragraphs": [
          "Uploading a 500-page book to a cloud converter wastes bandwidth and introduces latency. Utool bypasses this network bottleneck entirely. Because it processes files on your local CPU, a 100MB PDF document can be parsed and split in milliseconds. This makes it an ideal solution for remote workers, students, and office teams operating on slow or metered public Wi-Fi connections."
        ]
      }
    ],
    "relatedTools": [
      "merge-pdf",
      "compress-pdf"
    ]
  },
  {
    "id": "compress-pdf",
    "slug": "compress-pdf",
    "name": "Compress PDF",
    "description": "Compress and shrink PDF size online without losing quality.",
    "primaryTag": "PDF",
    "category": "PDF",
    "iconTag": "Maximize2",
    "isActive": true,
    "seoMeta": {
      "title": "Compress PDF Free — Reduce PDF File Size | Utool",
      "description": "Compress and shrink PDF size online without losing quality. 100% secure client-side compression. Optimize documents for email attachments in seconds.",
      "keywords": [],
      "h1": "Compress PDF Documents Online Free"
    },
    "intro": "Sending documents via email or uploading them to online portals often runs into strict file size limits. Most email services block attachments larger than 20MB or 25MB, while government, academic, and business portals frequently cap uploads at 5MB or 10MB. Utool’s Compress PDF utility offers a fast, clean, and private solution. Built on client-side WebAssembly compilers, Utool compresses your PDF files directly inside your browser cache. Since no documents are uploaded to remote servers, your private records remain secure. The system strips redundant metadata, deduplicates font files, and optimizes image layers locally, reducing file sizes while keeping your text and charts readable. Shrink your PDFs in seconds with zero limits.",
    "howItWorks": [
      "Select and upload the PDF file you want to compress into the workspace.",
      "Our local utility automatically analyzes the document's cross-reference tables and image streams.",
      "Choose a compression profile (Medium Compression for visual balance, High Compression for maximum size reduction).",
      "Click the 'Compress PDF' button to execute the optimization pipeline locally.",
      "Download your optimized, lightweight PDF immediately."
    ],
    "benefits": [
      {
        "title": "Smart Local Compression",
        "desc": "Balances size reduction with visual clarity, ensuring vector text and charts stay sharp and readable."
      },
      {
        "title": "Browser-Only Security",
        "desc": "No files are transmitted to the cloud. Safe for sensitive financial, health, or personal identity records."
      },
      {
        "title": "Email & Upload Ready",
        "desc": "Quickly shrink files to fit under standard 10MB or 25MB email attachment limits in seconds."
      }
    ],
    "faqs": [
      {
        "question": "Is it safe to compress my PDFs on Utool?",
        "answer": "Yes, 100% secure. Utool uses local JavaScript and WebAssembly compiled binaries to compress your documents directly inside your web browser. Your private files are never uploaded to our servers, keeping them completely safe from data leaks and complying with GDPR and HIPAA."
      },
      {
        "question": "Will the text in my PDF become blurry after compression?",
        "answer": "No. Our compression engine optimizes fonts, strips redundant metadata, and intelligently rescales raster images to a web-friendly 150 DPI resolution. All vector shapes, text coordinates, and mathematical curves remain identical in clarity and sharpness."
      },
      {
        "question": "How much file size can I save using this compressor?",
        "answer": "Scanned PDFs containing high-resolution images or photo pages can typically be reduced in size by 40% to 80% without any noticeable drop in visual quality. Clean vector text documents with fewer images see smaller savings because they are already optimized."
      },
      {
        "question": "Is there a maximum file size limit for compression?",
        "answer": "There are no server-side limits. Because Utool runs locally on your computer, the processing cap is determined entirely by your device's memory (RAM) and browser limits, letting you compress large files easily."
      },
      {
        "question": "Does Utool save a copy of my compressed PDF?",
        "answer": "No. Utool processes documents client-side. The original file never leaves your computer, and we have no database or storage server collecting your uploaded document assets."
      },
      {
        "question": "Can I compress scanned PDF documents?",
        "answer": "Yes. Scanned PDFs are usually large because they store raw images of pages. Utool downscales these embedded image streams and reapplies compression algorithms (like Flate/DCTDecode) to reduce their size."
      },
      {
        "question": "How does client-side PDF compression work?",
        "answer": "Utool loads WebAssembly tools into your browser. This worker parses the PDF's internal cross-reference table, strips unused assets and duplicate fonts, deletes document revisions, and downscales raster image blocks locally."
      },
      {
        "question": "Can I compress password-protected PDF files?",
        "answer": "You must remove the password protection from the document using Utool's Unlock PDF tool before loading it into the compressor workspace to allow the compression parser to read and compile the object streams."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Why Local Browser PDF Compression is Safer than Cloud Converters",
        "paragraphs": [
          "For compliance-sensitive industries such as healthcare, finance, legal, and government, uploading files to public web servers is a major data security risk. Standard online PDF compressors process your documents on remote cloud servers, which are susceptible to data sniffing, database leaks, and server breaches. If a document containing client bank details or private patient medical histories is intercepted, it could violate privacy laws like HIPAA, GDPR, and CCPA.",
          "Utool solves this security issue by keeping the entire file processing local. Our client-side WebAssembly architecture compiles the new PDF streams within the browser memory on your device. This guarantees that your business records remain confidential and compliant with data handling rules, as no data is sent over the network to external systems."
        ]
      },
      {
        "sectionTitle": "How PDF Compression Algorithms Work Under the Hood",
        "paragraphs": [
          "Every PDF is built as an object graph (XRef tables, resource dictionaries, page nodes, and content streams). The size of a document is driven by three main factors: uncompressed high-resolution images, redundant embedded fonts, and historical revision markers. When you edit a PDF, some software appends changes to the end of the file instead of rewriting it, leading to document bloating.",
          "Utool's compression engine addresses all three areas: it downscales high-res raster images (e.g. from 300 to 150 DPI) using modern canvas scaling, embeds only the specific font characters used (subsetting), and strips metadata histories and unreferenced objects. This produces a compact, clean PDF file."
        ]
      },
      {
        "sectionTitle": "A Developer's Perspective on Client-Side WebAssembly Compression",
        "paragraphs": [
          "Historically, high-performance file compression required system-level libraries like C++ or Java, which forced web tools to run server-side. With the advent of WebAssembly (WASM), we can compile these native libraries into bytecode that runs directly in the browser's sandbox at native speeds.",
          "By running our compression logic in WebAssembly workers, Utool avoids the latency of network uploads. It parses, scales, and recompiles PDF data arrays on your local CPU. This reduces network overhead and enables offline file processing."
        ]
      },
      {
        "sectionTitle": "Best Practices for Shrinking PDF Sizes for Email & Portals",
        "paragraphs": [
          "For the best balance of file size and readability, start with clean document scans. Scan documents in grayscale or black-and-white at 150 DPI if they contain only text. Avoid embedding high-resolution color profiles (like CMYK) unless you are printing them commercially.",
          "Before compressing, check if your file contains duplicate images or unnecessary attachments. Running Utool's compressor on a pre-optimized file strips any remaining historical revisions, securing and shrinking the file for web distribution."
        ]
      }
    ],
    "relatedTools": [
      "merge-pdf",
      "split-pdf"
    ]
  },
  {
    "id": "qr-generator",
    "slug": "qr-generator",
    "name": "QR Code Generator",
    "description": "Generate custom QR codes for URLs, text, email, or Wi-Fi networks.",
    "primaryTag": "Utilities",
    "category": "Utilities",
    "iconTag": "QrCode",
    "isActive": true,
    "seoMeta": {
      "title": "Free QR Code Generator — Create Custom QR Codes Online | utool",
      "description": "Generate custom QR codes for URLs, text, email, or Wi-Fi networks. Free, customizable colors and sizes, instant download in high-resolution.",
      "keywords": [],
      "h1": "Create Custom QR Codes Online Free"
    },
    "intro": "Looking to create custom QR codes for a restaurant menu, business card, event flyer, or Wi-Fi login? utool's QR Code Generator provides a clean, fast, and completely free way to generate high-resolution QR codes. Customize foreground and background colors, adjust canvas padding, and choose error correction levels to suit your marketing needs.",
    "howItWorks": [
      "Select your data type: URL, plain text, email template, or Wi-Fi network.",
      "Input your data (e.g., destination URL or Wi-Fi credentials).",
      "Customize colors, padding, and error correction levels.",
      "Generate and download your high-quality QR code in PNG format."
    ],
    "benefits": [
      {
        "title": "Multi-Format Support",
        "desc": "Generate codes for standard URLs, emails, Wi-Fi networks, or plain text messages."
      },
      {
        "title": "High-Resolution Output",
        "desc": "Download high-quality PNG graphics suitable for print posters, signs, and digital screens."
      },
      {
        "title": "Color Customization",
        "desc": "Personalize the foreground and background colors to match your brand design palette."
      }
    ],
    "faqs": [
      {
        "question": "Do these QR codes expire?",
        "answer": "No. These are static QR codes, meaning the destination data is encoded directly into the grid pattern. They will work forever and have no scan limits."
      },
      {
        "question": "How does the Wi-Fi QR code work?",
        "answer": "When scanned by a smartphone, it prompts the user to join the network automatically. It encodes the network name (SSID), password, and security type securely."
      },
      {
        "question": "What is error correction level?",
        "answer": "Error correction allows a QR code to be scanned even if part of it is dirty or damaged. High (H) correction allows up to 30% damage but makes the pattern more dense."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Designing High-Performing Brand QR Codes",
        "paragraphs": [
          "When utilizing QR codes in physical print marketing, color contrast is critical. Ensure your foreground color is significantly darker than your background color (e.g., dark blue on a white card) to guarantee fast scanning on all phone models. Avoid reversing the contrast, as some older barcode scanners struggle to read light-on-dark codes.",
          "utool allows you to preview and fine-tune padding and error correction dynamically. Static QR codes generated here are 100% free of ads, tracking redirect loops, or subscription locks, providing a direct link between the user and your destination content."
        ]
      }
    ],
    "relatedTools": [
      "url-shortener",
      "resume-builder"
    ]
  },
  {
    "id": "url-shortener",
    "slug": "url-shortener",
    "name": "URL Shortener",
    "description": "Compile long destination URLs into clean, shortened redirection strings.",
    "primaryTag": "Utilities",
    "category": "Utilities",
    "iconTag": "LinkIcon",
    "isActive": true,
    "seoMeta": {
      "title": "Free URL Shortener — Create Clean Short Links Online | utool",
      "description": "Compile long destination URLs into clean, shortened redirection strings. Free, secure, and tracks click counts in real-time.",
      "keywords": [],
      "h1": "Shorten Long URLs Online Free"
    },
    "intro": "Long, messy links look unprofessional and eat up character limits on social media and SMS campaigns. utool's URL Shortener creates compact, readable links instantly. Perfect for Twitter, Instagram bios, and promotional emails. Track redirect success and monitor aggregate analytics in real-time.",
    "howItWorks": [
      "Paste your long destination URL into the input field.",
      "Click the 'Shorten Link' button to generate a clean alias.",
      "Copy your new compact short link to your clipboard.",
      "Share your link and monitor clicks in your dashboard history panel."
    ],
    "benefits": [
      {
        "title": "Instant Redirection",
        "desc": "Fast redirection protocols guarantee your visitors land on the target page in milliseconds."
      },
      {
        "title": "Real-Time Tracking",
        "desc": "Log click counts, timestamps, and execution success details in your personal dashboard."
      },
      {
        "title": "Clean Appearance",
        "desc": "Convert bulky query parameters and tracking hashes into short, sleek links."
      }
    ],
    "faqs": [
      {
        "question": "Are these short links permanent?",
        "answer": "Yes. Short links created on utool remain active indefinitely, as long as they are not used for spam or malicious purposes."
      },
      {
        "question": "Can I track how many people clicked my link?",
        "answer": "Yes. Registered users can view their shortening transaction history and click counters directly in the utool History Dashboard."
      },
      {
        "question": "Do you inject ads during redirection?",
        "answer": "No. utool does not show ads or intermediate redirect landing pages. Your users are forwarded straight to the destination page instantly."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Improve CTR with Clean Redirection Links",
        "paragraphs": [
          "Short links improve user confidence and increase click-through rates (CTR). A clean, concise URL looks trustworthy and fits naturally into SMS messages, social posts, and print advertising materials. By removing bulky URL parameters, your links look less like tracking spam and more like helpful recommendations.",
          "Our system runs on high-speed serverless route redirects backed by Upstash Redis caching, ensuring that redirection takes place in a fraction of a second. This minimizes bounce rates caused by slow forwarding pages."
        ]
      }
    ],
    "relatedTools": [
      "qr-generator",
      "resume-builder"
    ]
  },
  {
    "id": "resume-builder",
    "slug": "resume-builder",
    "name": "Resume Builder",
    "description": "Create professional, ATS-friendly resumes in minutes.",
    "primaryTag": "Utilities",
    "category": "Utilities",
    "iconTag": "User",
    "isActive": true,
    "seoMeta": {
      "title": "Free ATS Resume Builder — Create Professional Resumes | utool",
      "description": "Create professional, ATS-friendly resumes in minutes. Free customizable sections, clean templates, and instant download in PDF format.",
      "keywords": [],
      "h1": "Free ATS-Friendly Resume Builder"
    },
    "intro": "Searching for a job is tough, and your resume is your first impression. utool's ATS Resume Builder helps you compile a professional, clean, and layout-perfect resume that stands out to hiring managers and passes Applicant Tracking Systems (ATS) with ease. Enter your experience, skills, and education, and download a polished PDF instantly.",
    "howItWorks": [
      "Fill in your contact info, professional summary, and job history.",
      "Add your educational background, core skills, and custom sections.",
      "Review the real-time preview to ensure the layout is perfect.",
      "Download your polished, ATS-optimized PDF resume instantly."
    ],
    "benefits": [
      {
        "title": "ATS-Friendly Layouts",
        "desc": "Designed with standard single-column text structures that parsing algorithms read flawlessly."
      },
      {
        "title": "Real-Time Preview",
        "desc": "Watch your resume layout adapt dynamically as you type in your credentials and job details."
      },
      {
        "title": "100% Free",
        "desc": "No watermarks, no locked templates, and no hidden payment screens upon download."
      }
    ],
    "faqs": [
      {
        "question": "What makes a resume ATS-friendly?",
        "answer": "ATS software reads resumes from top to bottom, left to right. Single-column layouts, standard headers, and readable font styles ensure the system extracts your job history, contact info, and skills correctly without glitches."
      },
      {
        "question": "Is my personal data safe here?",
        "answer": "Yes. utool compiles your resume on your device. We do not store your personal resume inputs or contact details in a database unless you explicitly save them."
      },
      {
        "question": "Can I download my resume in other formats?",
        "answer": "Our builder exports high-quality vector PDFs directly. PDF is the gold standard for job applications because it locks in your typography and design across all devices."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Writing a Resume That Wins Interviews",
        "paragraphs": [
          "To stand out to recruiters, tailor your professional summary and work history to match the keywords in the job description. Focus on action verbs and quantify your achievements (e.g., 'increased sales by 20%' instead of 'responsible for sales'). A clean, standard resume that highlights concrete achievements is far more effective than colorful, multi-column templates that confuse scanning software.",
          "utool's resume creator guarantees your document follows industry-standard formatting guidelines. It handles line spacing, margin alignment, and section dividers automatically, giving you a polished layout in minutes."
        ]
      }
    ],
    "relatedTools": [
      "qr-generator",
      "url-shortener"
    ]
  },
  {
    "id": "protect-pdf",
    "slug": "protect-pdf",
    "name": "Protect PDF",
    "description": "Secure your PDF files with AES-256 password encryption.",
    "primaryTag": "PDF",
    "category": "PDF",
    "iconTag": "Lock",
    "isActive": true,
    "seoMeta": {
      "title": "Protect PDF Online — Encrypt PDF with Password | Utool",
      "description": "Secure your PDF files with AES-256 password encryption. 100% secure client-side protection—neither your files nor passwords ever touch our servers.",
      "keywords": [],
      "h1": "Encrypt and Protect PDF Documents Online"
    },
    "intro": "Securing private financial statements, contracts, or legal agreements should not require uploading sensitive documents to public cloud databases. Utool's Protect PDF utility lets you encrypt your files with military-grade AES-256 password security. Our unique client-side engine executes the encryption directly in your web browser, meaning your document and password are never uploaded to a cloud server, ensuring complete data security.",
    "howItWorks": [
      "Select and load the PDF document you want to secure in the workspace.",
      "Enter a strong, secure password in the input field.",
      "Our local utility automatically validates the password parameters.",
      "Click the 'Protect PDF' button to encrypt your file locally via WebAssembly.",
      "Download your secure, password-protected PDF instantly."
    ],
    "benefits": [
      {
        "title": "AES-256 Encryption",
        "desc": "Encrypts your PDF document streams to block unauthorized access, copying, or printing."
      },
      {
        "title": "Local Browser Protection",
        "desc": "No files or passwords are ever sent to external servers. Your credentials stay strictly private."
      },
      {
        "title": "100% Free & Fast",
        "desc": "Secure unlimited PDF files instantly without subscription paywalls or registration requirements."
      }
    ],
    "faqs": [
      {
        "question": "What encryption standard does Utool use?",
        "answer": "Utool uses standard 256-bit AES encryption to protect PDF documents, making it virtually impossible for unauthorized users to bypass or decrypt without the password."
      },
      {
        "question": "Is my password safe when encrypting here?",
        "answer": "Yes. All encryption runs in your browser using qpdf WASM compilers. Neither your PDF file nor your password touches our servers, keeping them completely safe from data leaks."
      },
      {
        "question": "Can I recover a lost password?",
        "answer": "No. Since we do not store any passwords or data, we cannot recover or reset passwords for protected documents. Make sure to keep your password in a safe place."
      },
      {
        "question": "What is the difference between a user password and owner password?",
        "answer": "A user password restricts viewing of the document, requiring readers to enter the password to open it. An owner password restricts permissions like printing, copying text, or editing, which can be custom-configured."
      },
      {
        "question": "Does Utool support batch file protection?",
        "answer": "Currently, Utool encrypts documents individually to ensure processing integrity and allow custom password allocations for each secure file."
      },
      {
        "question": "Will encrypting a PDF increase its file size?",
        "answer": "Encryption itself adds negligible overhead to the PDF cross-reference map, keeping file sizes virtually identical to the original."
      },
      {
        "question": "Can I unlock the PDF later on Utool?",
        "answer": "Yes. If you know the password, you can remove the encryption using Utool's Unlock PDF utility at any time."
      },
      {
        "question": "Can I encrypt scanned PDFs?",
        "answer": "Yes. Utool protects all PDF types (text-based, vector graphics, and image scans) since it locks the parent object catalog directly."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Understanding AES-256 Military-Grade PDF Encryption",
        "paragraphs": [
          "Advanced Encryption Standard (AES) with a 256-bit key length is the cryptographic standard approved by the National Security Agency (NSA) for protecting top-secret information. When you apply a password to a PDF, the document streams are encrypted using a cryptographic key derived from your password. Without the correct key, the PDF reader receives scrambled data blocks, preventing unauthorized access.",
          "Utool's Protect PDF engine wraps these encryption routines in WebAssembly, rendering the document unreadable to anyone who does not possess the password. This level of protection makes Utool a strong alternative for corporate legal teams, accounting firms, and government workers handling compliance-heavy audits."
        ]
      },
      {
        "sectionTitle": "The Privacy Advantage of Offline Client-Side Encryption",
        "paragraphs": [
          "Most online PDF lockers require you to upload your files and passwords to remote servers. This introduces a major vulnerability: if the site's database is hacked, your files and passwords could be leaked. Additionally, server-side tools often retain documents in temporary directories, leaving a digital footprint.",
          "Utool removes this security risk by processing your files locally. Our client-side qpdf WASM compiler performs the encryption within your browser's sandboxed memory. Neither the source document nor the password you type is ever sent over the network, providing security for confidential financial sheets and legal filings."
        ]
      },
      {
        "sectionTitle": "Standardizing File Locks for Legal and Financial Compliance",
        "paragraphs": [
          "For compliance-sensitive industries such as healthcare, finance, legal, and government, document distribution must adhere to strict guidelines. Sending unencrypted contracts, bookkeeping sheets, or medical records via email violates compliance laws like HIPAA, GDPR, and CCPA.",
          "By using Utool's local browser protection, you can encrypt files before sharing them. This helps secure your documents and ensure compliance with regulatory standards."
        ]
      },
      {
        "sectionTitle": "Managing User Passwords and Document Ownership Safely",
        "paragraphs": [
          "When securing your files, we recommend using passwords that combine uppercase letters, lowercase letters, numbers, and symbols. Avoid using easily guessable passphrases like 'password123' or 'admin'.",
          "Since Utool operates entirely client-side, we do not store your files or passwords on a server. Therefore, we cannot recover or reset lost passwords. Make sure to keep a secure record of the passwords you use."
        ]
      }
    ],
    "relatedTools": [
      "unlock-pdf",
      "compress-pdf"
    ]
  },
  {
    "id": "unlock-pdf",
    "slug": "unlock-pdf",
    "name": "Unlock PDF",
    "description": "Remove password protection and restrictions from PDF files.",
    "primaryTag": "PDF",
    "category": "PDF",
    "iconTag": "LockOpen",
    "isActive": true,
    "seoMeta": {
      "title": "Unlock PDF Online Free — Remove PDF Passwords | Utool",
      "description": "Remove password protection and restrictions from PDF files. Decrypt and save a clean, accessible copy instantly. 100% private and secure.",
      "keywords": [],
      "h1": "Unlock Protected PDF Documents Online"
    },
    "intro": "Need to print, edit, copy text, or extract pages from a restricted PDF? Utool's Unlock PDF utility strips passwords and editing permissions. By entering the correct user password, our client-side engine decrypts the document instantly in your browser, generating an unlocked, clean copy without risking file privacy or sharing your credentials with third parties.",
    "howItWorks": [
      "Select and upload the password-protected PDF document into the workspace.",
      "Enter the file's current user or owner password in the input prompt to authorize decryption.",
      "Click the 'Unlock PDF' button to process the file locally.",
      "Our WASM compiler strips the security handler from the document header.",
      "Download your fully unlocked, restriction-free PDF copy immediately."
    ],
    "benefits": [
      {
        "title": "Strip Permissions & Locks",
        "desc": "Remove print blocks, text copying restrictions, and layout modification limits instantly."
      },
      {
        "title": "Client-Side Decryption",
        "desc": "Decrypt files securely in your local browser sandbox. Your files and passwords remain confidential."
      },
      {
        "title": "Fidelity Preserved",
        "desc": "We retain all structural formats, fonts, links, and high-definition image qualities perfectly."
      }
    ],
    "faqs": [
      {
        "question": "Do I need to know the password to unlock the PDF?",
        "answer": "Yes. To strip security, you must provide the current password. Utool decrypts the file authorized by your password, then removes all print and edit restrictions."
      },
      {
        "question": "Are unlocked files sent to your servers?",
        "answer": "No. Decryption takes place locally in your browser. Your decrypted files and passwords never leave your computer."
      },
      {
        "question": "Can I unlock files with print-only restrictions?",
        "answer": "Yes. If a file has owner restrictions (like blocking printing or copying), entering the password will remove these blocks forever."
      },
      {
        "question": "Can Utool crack or bypass a PDF password if I forgot it?",
        "answer": "No. Utool is an authorized decryptor, not a password cracker. To remove security blocks, you must provide the password to verify ownership."
      },
      {
        "question": "Does unlocking a PDF file affect its layout or quality?",
        "answer": "No. Decryption only modifies the document security dictionary flags without altering content streams. All text, fonts, links, and page structures remain unchanged."
      },
      {
        "question": "What security standard does Utool decrypt?",
        "answer": "Utool supports decrypting PDF standards secured by standard RC4, AES-128, and AES-256 password protection."
      },
      {
        "question": "Can I unlock multiple PDF documents at once?",
        "answer": "To maintain client-side processing speeds and ensure correct password alignment, documents are unlocked individually."
      },
      {
        "question": "Is the Unlock PDF tool free to use?",
        "answer": "Yes. Like all tools on Utool, the Unlock PDF utility is free with no subscription blocks, page limits, or watermarks."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "How to Legally and Safely Remove Passwords from PDFs",
        "paragraphs": [
          "PDF security is managed using two types of passwords: a user password (document open password) and an owner password (permissions password). A user password restricts viewing, while an owner password restricts permissions like copying text, printing pages, or making structural edits. Removing password locks is a common task when combining documents, archiving invoices, or editing client agreements.",
          "To remove passwords, you must have the legal right or explicit permission from the document owner. Utool is designed as an authorized decryptor, meaning it uses your input password to compile a clean, unlocked PDF file. It is not a password-cracking utility, ensuring compliance with document security and ownership laws."
        ]
      },
      {
        "sectionTitle": "Removing Print Blocks, Text Copying, and Editing Restrictions",
        "paragraphs": [
          "Many corporate files are distributed with owner-level restrictions to prevent tampering. However, these blocks can slow down internal workflows, especially when pages need to be edited in Microsoft Word, compiled into report packages, or printed for archiving.",
          "Utool's Unlock PDF tool removes owner restrictions by clearing the protection flags in the PDF's security handler. This restores editability, printing, and text copying capabilities, allowing you to work with the document without limitation."
        ]
      },
      {
        "sectionTitle": "Local Decryption: Keeping Financial Records Secure",
        "paragraphs": [
          "Decrypted documents often contain sensitive information, such as employee payroll data, financial reports, or legal transcripts. Uploading these files to remote cloud decrypters increases the risk of data exposure. If the cloud provider's database is breached, your unencrypted data could be exposed.",
          "Utool removes this risk by performing all decryption locally. Our client-side WASM engine processes files in your browser's sandboxed memory. No decrypted data is transmitted over the network, providing security for sensitive corporate filings."
        ]
      },
      {
        "sectionTitle": "Technical Analysis of PDF Security Decryption Pipelines",
        "paragraphs": [
          "When a PDF is encrypted, its cross-reference streams and metadata directories are scrambled using cryptographic hash functions. Removing these locks requires parsing the document header, validating the password against the file's encryption key derivation parameters, and rebuilding the catalog structure.",
          "Utool utilizes compiled WASM binaries to perform these operations in browser memory. By stripping the encryption key dictionaries and resetting the permission flags, Utool writes a clean, unlocked PDF that is compatible with all PDF viewers."
        ]
      }
    ],
    "relatedTools": [
      "protect-pdf",
      "merge-pdf"
    ]
  },
  {
    "id": "image-to-pdf",
    "slug": "image-to-pdf",
    "name": "Image to PDF",
    "description": "Convert and compile PNG, JPG, JPEG, and WebP images into a single clean PDF document.",
    "primaryTag": "PDF",
    "category": "PDF",
    "iconTag": "ImageIcon",
    "isActive": true,
    "seoMeta": {
      "title": "Convert Image to PDF Free — PNG, JPG, WebP to PDF | utool",
      "description": "Convert and compile PNG, JPG, JPEG, and WebP images into a single clean PDF document. 100% secure client-side converter with drag-and-drop ordering.",
      "keywords": [],
      "h1": "Convert Images to PDF Online Free"
    },
    "intro": "Need to compile photo receipts, scanned ID cards, or design mocks into a single document? utool's Image to PDF converter fits your images into high-fidelity PDF pages. All conversion processes occur locally inside your browser sandbox, keeping your personal photos private.",
    "howItWorks": [
      "Drag and drop or select the images (PNG, JPG, WebP) you want to compile.",
      "Drag and drop image preview cards to reorder the PDF page layout.",
      "Click the 'Convert to PDF' button to execute the compilation.",
      "Download your newly created PDF document immediately."
    ],
    "benefits": [
      {
        "title": "Multi-Format Import",
        "desc": "Supports importing JPG, JPEG, PNG, and WebP graphics simultaneously."
      },
      {
        "title": "Visual Re-ordering",
        "desc": "Arrange page order visually in our grid sandbox before compiling the document."
      },
      {
        "title": "Local Conversion Quality",
        "desc": "Maintains original image dimensions and resolutions without quality compression loss."
      }
    ],
    "faqs": [
      {
        "question": "Is there a limit to how many images I can convert?",
        "answer": "No. Because compilation runs locally on your device, you can compile dozens of images at once without paywall restrictions."
      },
      {
        "question": "Does utool convert PNG files with transparency?",
        "answer": "Yes. Transparent PNGs are rendered correctly and embedded onto white canvas pages within the output PDF."
      },
      {
        "question": "Are my private pictures safe on utool?",
        "answer": "Yes. Your images never leave your browser. Processing occurs strictly client-side, making it safe for personal IDs and bank statements."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Programmatic PDF Compilation from Browser Canvas",
        "paragraphs": [
          "Unlike generic converters that bloat files or downsample image quality, utool draws each uploaded graphic to an offline browser canvas and embeds it directly onto vector document pages. This results in lightweight PDF files that open quickly and print beautifully."
        ]
      }
    ],
    "relatedTools": [
      "jpg-to-pdf",
      "pdf-to-jpg"
    ]
  },
  {
    "id": "jpg-to-pdf",
    "slug": "jpg-to-pdf",
    "name": "JPG to PDF",
    "description": "Convert JPG and JPEG photos into aligned PDF documents.",
    "primaryTag": "PDF",
    "category": "PDF",
    "iconTag": "ImageIcon",
    "isActive": true,
    "seoMeta": {
      "title": "Convert JPG to PDF Free Online — JPG, JPEG to PDF | utool",
      "description": "Convert JPG and JPEG photos into aligned PDF documents. 100% free client-side conversion. Reorder pages and compile instantly.",
      "keywords": [],
      "h1": "Convert JPG Images to PDF Online Free"
    },
    "intro": "Transform your JPEG screenshots, receipts, or documents into clean PDF files. utool's JPG to PDF tool handles alignment and packages your photos into standard PDFs. Enjoy absolute privacy since files are compiled locally in your web browser.",
    "howItWorks": [
      "Select or drop JPG/JPEG photos into the upload zone.",
      "Arrange the photo layout sequence in the visual grid.",
      "Click 'Convert to PDF' to compile the pages locally.",
      "Download your output PDF file instantly."
    ],
    "benefits": [
      {
        "title": "JPG & JPEG Optimization",
        "desc": "Optimized parsing of JPEG compression streams for lightweight outputs."
      },
      {
        "title": "Page-Fit Scaling",
        "desc": "Images are scaled to create full-bleed PDF pages, maintaining correct aspect ratios."
      },
      {
        "title": "Instant Compilation",
        "desc": "Local WASM compiling processes multiple high-res photos in milliseconds."
      }
    ],
    "faqs": [
      {
        "question": "Can I combine portrait and landscape JPGs?",
        "answer": "Yes. The compiler dynamically calculates dimensions for each page based on the source image's orientation, preventing layout stretching."
      },
      {
        "question": "Will converting JPG to PDF reduce image sharpness?",
        "answer": "No. We embed JPEG streams directly into the PDF container object, retaining 100% of the original photo pixels."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "High-Performance Local PDF Packaging",
        "paragraphs": [
          "utool's JPG to PDF packaging engine operates entirely on client-side React and PDF-Lib wrappers. This guarantees that your business records, tax files, and passport scans are never exposed to remote databases, delivering high security and processing speed."
        ]
      }
    ],
    "relatedTools": [
      "image-to-pdf",
      "pdf-to-jpg"
    ]
  },
  {
    "id": "pdf-to-jpg",
    "slug": "pdf-to-jpg",
    "name": "PDF to JPG",
    "description": "Convert PDF documents to high-resolution JPG images.",
    "primaryTag": "PDF",
    "category": "PDF",
    "iconTag": "Camera",
    "isActive": true,
    "seoMeta": {
      "title": "Convert PDF to JPG Free — Extract PDF Pages to JPEG | utool",
      "description": "Convert PDF documents to high-resolution JPG images. 100% secure client-side extraction. Preview pages and download them instantly.",
      "keywords": [],
      "h1": "Convert PDF Pages to JPG Images Online"
    },
    "intro": "Need to insert a PDF page into a presentation, document, or upload it to social media? utool's PDF to JPG extractor rasterizes pages into crisp, high-definition JPEG files. Powered by dynamic browser rendering, your document sheets are processed entirely on your local machine.",
    "howItWorks": [
      "Upload the PDF document you want to extract as images.",
      "Verify the page count and view extracted image tiles.",
      "Click to download individual pages or save all sheets at once.",
      "Get high-resolution, uncompressed JPEGs on your device."
    ],
    "benefits": [
      {
        "title": "HD Image Extraction",
        "desc": "Renders vector text and images at a 2.0x zoom multiplier for sharp, readable JPEGs."
      },
      {
        "title": "Select Page Download",
        "desc": "Download specific pages of interest instead of downloading the entire file catalog."
      },
      {
        "title": "No Server Uploads",
        "desc": "Process secure records locally in your browser. Absolute confidentiality for business documents."
      }
    ],
    "faqs": [
      {
        "question": "How are the pages rendered without server assistance?",
        "answer": "We use a customized, sandboxed instance of PDF.js inside your browser. It parses the document and draws pages directly onto canvas elements, which are then saved as JPEG files."
      },
      {
        "question": "Can I convert large PDFs with many pages?",
        "answer": "Yes. However, since processing runs on your local CPU and RAM, documents with hundreds of pages may take several seconds to render."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Crisp Client-Side PDF Rasterization",
        "paragraphs": [
          "Standard PDF to image converters compress file output, making the extracted page text fuzzy and unreadable. utool optimizes this by using a high-density viewport multiplier during canvas rendering. This ensures that charts, small prints, and handwriting remain legible."
        ]
      }
    ],
    "relatedTools": [
      "image-to-pdf",
      "jpg-to-pdf"
    ]
  },
  {
    "id": "json-formatter",
    "slug": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format, validate, and parse raw JSON strings.",
    "primaryTag": "Utilities",
    "category": "Utilities",
    "iconTag": "FileCode",
    "isActive": true,
    "seoMeta": {
      "title": "JSON Formatter & Beautifier — Format & Validate JSON | utool",
      "description": "Format, validate, and parse raw JSON strings. 100% secure client-side formatting with deep syntax checking and instant copy tools.",
      "keywords": [],
      "h1": "Beautify and Format JSON Strings Online"
    },
    "intro": "Tired of dealing with unreadable, minified JSON payloads? utool's JSON Formatter cleans up your structures and highlights syntax. Paste your raw payload and get clean, readable JSON with indentation, while running structural checks in real-time.",
    "howItWorks": [
      "Paste your raw, minified JSON payload into the input panel.",
      "Click the 'Run Utility Pipeline' button to format.",
      "Review the parsed JSON and inspect any syntax warning errors.",
      "Copy the formatted, clean output directly to your clipboard."
    ],
    "benefits": [
      {
        "title": "Beautify & Indent",
        "desc": "Formats raw strings into clean, indented code hierarchies (2 spaces)."
      },
      {
        "title": "Syntax Error Logs",
        "desc": "Identifies missing commas, unclosed brackets, or invalid keys instantly."
      },
      {
        "title": "Instant Copy Tool",
        "desc": "Save code blocks to your clipboard with a single click."
      }
    ],
    "faqs": [
      {
        "question": "Is my JSON payload secure on utool?",
        "answer": "Yes. All parsing and formatting occur client-side on your device. We do not store or transmit your developer configs or data payloads."
      },
      {
        "question": "Does the formatter support large payloads?",
        "answer": "Yes, it can parse and format large JSON datasets inside the browser page quickly."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "High-Speed Client-Side Code Beautification",
        "paragraphs": [
          "utool's JSON parsing engine runs directly in the browser's JavaScript V8 thread, avoiding network latency and keeping your data private. This is ideal for developers handling database records, private API payloads, or config setups."
        ]
      }
    ],
    "relatedTools": [
      "css-gradient-generator",
      "meta-tag-generator"
    ]
  },
  {
    "id": "css-gradient-generator",
    "slug": "css-gradient-generator",
    "name": "CSS Gradient Generator",
    "description": "Create premium CSS linear and radial HSL gradients.",
    "primaryTag": "Utilities",
    "category": "Utilities",
    "iconTag": "ImageIcon",
    "isActive": true,
    "seoMeta": {
      "title": "CSS Gradient Generator — Compile Custom CSS HSL Gradients | utool",
      "description": "Create premium CSS linear and radial HSL gradients. 100% client-side compilation with real-time browser preview and clean code export.",
      "keywords": [],
      "h1": "Compile CSS Gradients Online Free"
    },
    "intro": "Add visual depth to your designs. utool's CSS Gradient Generator helps you create smooth linear and radial HSL gradients. Enter your hues and export clean, production-ready CSS code.",
    "howItWorks": [
      "Enter HSL hue values separated by commas in the input field.",
      "Click the 'Run Utility Pipeline' button to render.",
      "Preview the generated gradient block instantly in the workspace.",
      "Copy the compiled CSS code block for your style sheets."
    ],
    "benefits": [
      {
        "title": "HSL Color Engine",
        "desc": "Utilizes clean HSL color wheels to generate rich visual transitions."
      },
      {
        "title": "Instant CSS Export",
        "desc": "Generates standard CSS styles that copy directly into stylesheet templates."
      },
      {
        "title": "Live Preview Layout",
        "desc": "Inspect and preview visual gradients dynamically in real-time."
      }
    ],
    "faqs": [
      {
        "question": "What is HSL and why use it?",
        "answer": "HSL stands for Hue, Saturation, and Lightness. It makes color adjustment intuitive compared to Hex or RGB, allowing designers to balance shade tones easily."
      },
      {
        "question": "Is the generated CSS code cross-browser compatible?",
        "answer": "Yes. The tool outputs standard CSS linear-gradient codes supported by all modern web browsers."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Design Premium UI Background Gradients",
        "paragraphs": [
          "Modern web aesthetics rely on smooth gradient transitions. By using HSL coordinates, our generator compiles clean, vector-rendered backgrounds that scale smoothly across screen sizes, avoiding heavy image downloads."
        ]
      }
    ],
    "relatedTools": [
      "json-formatter",
      "meta-tag-generator"
    ]
  },
  {
    "id": "meta-tag-generator",
    "slug": "meta-tag-generator",
    "name": "Meta Tag Generator",
    "description": "Create search-optimized HTML meta tags with real-time Google search snippet and social card previews.",
    "primaryTag": "Utilities",
    "category": "Utilities",
    "iconTag": "FileCode",
    "isActive": true,
    "seoMeta": {
      "title": "Meta Tag Generator Online — SEO Google & Social Preview | utool",
      "description": "Create search-optimized HTML meta tags with real-time Google search snippet and social card previews. Free, secure, and fast.",
      "keywords": [],
      "h1": "Generate and Preview HTML Meta Tags"
    },
    "intro": "Struggling to make your website stand out on Google, Facebook, or Twitter? utool's Meta Tag Generator lets you build search-optimized metadata. Enter your page details to view real-time Google search snippet previews and social share cards, then copy the generated HTML header tags with one click.",
    "howItWorks": [
      "Input your website Title, Description, and target Keywords.",
      "Add Author tags and insert a premium Open Graph (OG) Image URL.",
      "Preview the layout on Google Search and social media card previews.",
      "Copy the generated HTML tags and paste them into your page head."
    ],
    "benefits": [
      {
        "title": "Google SERP Preview",
        "desc": "Inspect title lengths and snippet limits to prevent text truncation in search results."
      },
      {
        "title": "Social Share Cards",
        "desc": "Preview Facebook, LinkedIn, and Twitter share layouts dynamically."
      },
      {
        "title": "Clean HTML Output",
        "desc": "Exports semantic tags, including structured Open Graph and Twitter Card tags."
      }
    ],
    "faqs": [
      {
        "question": "What is the recommended title and description length?",
        "answer": "For optimal display, keep titles under 60 characters and meta descriptions under 160 characters. This prevents search engines from truncating your snippets."
      },
      {
        "question": "What are Open Graph tags used for?",
        "answer": "Open Graph (OG) tags tell social media platforms how to display your page when shared, helping you control the title, description, and thumbnail image."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Optimize Click-Through Rates with Meta Previews",
        "paragraphs": [
          "Perfect meta properties are essential for raising organic click-through rates (CTR). A well-formatted title and description that fit search engine character limits look professional and build user trust. utool helps you align metadata, configure social previews, and generate clean tags in seconds."
        ]
      }
    ],
    "relatedTools": [
      "json-formatter",
      "css-gradient-generator"
    ]
  },
  {
    "id": "webp-converter",
    "slug": "webp-converter",
    "name": "WebP Converter",
    "description": "Convert PNG, JPG, and JPEG images to WebP format.",
    "primaryTag": "Utilities",
    "category": "Utilities",
    "iconTag": "RefreshCw",
    "isActive": true,
    "seoMeta": {
      "title": "WebP Converter Free — JPG/PNG to WebP | Utool",
      "description": "Convert PNG, JPG, and JPEG images to WebP format. Reduce image filesizes up to 80% while retaining full quality locally. No signup required.",
      "keywords": [],
      "h1": "Convert Images to WebP Format Online Free"
    },
    "intro": "Need to optimize your website loading speed and reduce bandwidth usage? Utool's WebP Converter converts standard PNG, JPG, and JPEG images into Google's highly efficient WebP format. The conversion is performed 100% locally in your browser sandbox, keeping your private assets secure and off remote servers.",
    "howItWorks": [
      "Select or drop PNG/JPG images into the conversion panel.",
      "Adjust the quality compression percentage slider (default 80%).",
      "Click the conversion pipeline button to optimize pages.",
      "Download your optimized WebP images instantly."
    ],
    "benefits": [
      {
        "title": "Shrink File Sizes 80%",
        "desc": "Significantly reduce storage footprints and boost website SEO page speed."
      },
      {
        "title": "Client-Side Processing",
        "desc": "Your images are processed locally. Safe for sensitive graphics, blueprints, or documents."
      },
      {
        "title": "Batch Conversion Mode",
        "desc": "Convert multiple images simultaneously in a single pass without limits."
      }
    ],
    "faqs": [
      {
        "question": "Will converting images to WebP degrade clarity?",
        "answer": "No. The WebP format supports both lossy and lossless compression, letting you reduce size by up to 80% with minimal visual degradation."
      },
      {
        "question": "Is WebP supported by all browsers?",
        "answer": "Yes. WebP is supported by all modern browsers (Chrome, Safari, Firefox, Edge) and is the recommended standard for web assets."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Improve SEO Page Speed with WebP Assets",
        "paragraphs": [
          "Google uses page loading speed as a primary ranking signal in search results. Heavy PNG and JPEG assets slow down page loads, increasing bounce rates and hurting rankings. Converting your images to WebP helps you achieve high optimization scores on Google PageSpeed Insights.",
          "Utool's local compiler uses modern browser APIs to compress and convert images in milliseconds. Since no upload bandwidth is used, it handles large files quickly even on slow internet connections."
        ]
      }
    ],
    "relatedTools": [
      "image-to-pdf",
      "jpg-to-pdf"
    ]
  },
  {
    "id": "media-workspace",
    "slug": "media-workspace",
    "name": "Media Workspace",
    "description": "The ultimate browser-native Media Workspace.",
    "primaryTag": "Media",
    "category": "Media",
    "iconTag": "Video",
    "isActive": true,
    "seoMeta": {
      "title": "Premium Online Media Workspace — Download, Convert, Compress, Edit & Enhance | utool",
      "description": "The ultimate browser-native Media Workspace. Downloader, converter, compressor, editor, and AI media enhancer running entirely in your browser. 100% private.",
      "keywords": [],
      "h1": "Client-Side Media Workspace Online"
    },
    "intro": "Managing video, audio, and images shouldn't require bloated desktop software or uploading your sensitive personal files to remote clouds. Utool's Media Workspace provides a complete, professional, browser-native suite of media tools. Everything executes locally on your device's hardware, ensuring immediate processing, zero queues, and absolute privacy.",
    "howItWorks": [
      "Paste any media link or upload your files directly into the client workspace.",
      "Select your task: download, convert formats, trim clips, compress files, or generate subtitles.",
      "Fine-tune output parameters, formats, resolutions, and quality sliders.",
      "Run the pipeline to process media locally and download files directly."
    ],
    "benefits": [
      {
        "title": "100% Secure & Client-Side",
        "desc": "No file uploads or server-side logging. All files are converted, edited, and enhanced locally inside your secure browser sandbox."
      },
      {
        "title": "High-Speed Pipelines",
        "desc": "Process audio, video, and images at the speed of your local CPU and GPU, avoiding remote server queues."
      },
      {
        "title": "Universal Formats & Tools",
        "desc": "Equipped with downloader, converter, compressor, editor, subtitle generator, and AI upscalers in one integrated dashboard."
      }
    ],
    "faqs": [
      {
        "question": "Is downloading videos allowed on Utool?",
        "answer": "Downloads are only available where the user has explicit permission from the copyright owner or where the platform allows. Utool provides a browser-native tool that respects legal boundaries and processes streams client-side."
      },
      {
        "question": "Are my media files uploaded to a server?",
        "answer": "No. Your files are processed entirely within your web browser using HTML5 APIs, canvas elements, and WebAssembly compilation. No media is ever sent to Utool servers, ensuring absolute privacy."
      },
      {
        "question": "What formats does the converter and compressor support?",
        "answer": "The workspace supports major formats including MP4, WebM, MP3, M4A, WAV, PNG, JPG, WebP, GIF, and PDF. Since it runs in the client, compatibility is optimized for browser-supported decoders."
      },
      {
        "question": "Do I need to sign up to use the Media Workspace?",
        "answer": "No. The core workspace utilities are free to use directly in your browser. Higher volume tasks or premium cloud enhancements can be accessed by signing in."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Why a Client-Side Browser Media Workspace is Superior",
        "paragraphs": [
          "Traditional online downloaders and media converters parse your media files on cloud servers, exposing your private videos, records, or recordings. This architecture is slow because it relies on upload bandwidth. Utool changes this by performing media analysis and processing directly in your browser.",
          "By shifting decoders and metadata parsers into client-side scripts, Utool is extremely fast. Huge files are processed instantly on your CPU, saving time and keeping your personal data safe from remote database storage or logs."
        ]
      }
    ],
    "relatedTools": [
      "webp-converter",
      "image-to-pdf"
    ]
  },
  {
    "id": "image-resizer",
    "slug": "image-resizer",
    "name": "Smart Image Resizer",
    "description": "Resize, crop, and convert your images online.",
    "primaryTag": "Utilities",
    "category": "Utilities",
    "iconTag": "Sliders",
    "isActive": true,
    "seoMeta": {
      "title": "Smart Image Resizer Online — Resize, Crop & Convert Images | utool",
      "description": "Resize, crop, and convert your images online. High-quality transformations with custom aspect ratios, formats, and quality controls.",
      "keywords": [],
      "h1": "Smart Image Resizer & Converter Online"
    },
    "intro": "Need to prepare images for social media, optimize web assets, or resize photos for applications? Utool's Smart Image Resizer provides a comprehensive suite for resizing, cropping, and converting image formats. Powered by secure Cloudinary APIs, it processes your requests instantly while keeping details sharp and aspect ratios intact.",
    "howItWorks": [
      "Upload the image you want to resize into the upload zone.",
      "Configure your desired width, height, crop mode, and format.",
      "Click 'Process & Resize' to transform the image.",
      "Preview the result side-by-side and click download."
    ],
    "benefits": [
      {
        "title": "Smart Aspect Ratios",
        "desc": "Crop, fit, scale, or use AI-driven thumbnails to preserve faces and primary focus elements automatically."
      },
      {
        "title": "Multi-Format Conversions",
        "desc": "Convert images to WebP, PNG, JPEG, or GIF instantly during the resizing process."
      },
      {
        "title": "Optimized Quality",
        "desc": "Adjust quality sliders to compress image file size by up to 80% with minimal loss in clarity."
      }
    ],
    "faqs": [
      {
        "question": "What image formats are supported?",
        "answer": "You can upload JPEG, PNG, WebP, and GIF images. The tool can output to WebP, JPG, PNG, and GIF formats."
      },
      {
        "question": "What does the AI Thumbnail option do?",
        "answer": "The AI thumbnail option uses face-detection algorithms on the server to automatically detect the main subject of your image and crop around it, ensuring faces or key elements aren't cut off."
      },
      {
        "question": "Are my original images saved?",
        "answer": "Your files are uploaded to secure Cloudinary buckets for conversion and are subject to cache cleanup schedules. No personal logs or assets are permanently retained."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Why Image Compression and Resizing is Crucial for Web Performance",
        "paragraphs": [
          "Large, unoptimized images are the primary cause of slow web page loading speeds. By utilizing formats like WebP, you can compress images significantly while maintaining high visual quality. The Smart Image Resizer lets you control the dimensions and quality directly before publishing.",
          "Combining cropping, resizing, and format changes into a single workspace streamlines asset workflows, enabling you to output the exact dimensions and compression levels for your site in seconds."
        ]
      }
    ],
    "relatedTools": [
      "webp-converter"
    ]
  },
  {
    "id": "background-remover",
    "slug": "background-remover",
    "name": "Background Remover",
    "requiresAuth": true,
    "freeLimit": 1,
    "description": "Remove background from images online automatically.",
    "primaryTag": "Utilities",
    "category": "Utilities",
    "iconTag": "ImageIcon",
    "isActive": true,
    "seoMeta": {
      "title": "Free AI Background Remover Online — Extract Transparent PNGs | utool",
      "description": "Remove background from images online automatically. AI isolates subjects, people, or products cleanly, returning high-quality transparent PNG outputs.",
      "keywords": [],
      "h1": "AI Background Remover Online"
    },
    "intro": "Isolating product photos or subject images manually takes time and precise editing skill. Utool's AI Background Remover does it in seconds automatically. Powered by secure Clipdrop API, it extracts clear transparent PNG overlays while preserving fine details like hair edges and product shadows.",
    "howItWorks": [
      "Upload the JPEG or PNG photo to extract subjects from.",
      "Click 'Remove Background' to initiate AI isolation.",
      "Review the output overlaid on a transparent checkerboard preview.",
      "Download your transparent PNG file directly."
    ],
    "benefits": [
      {
        "title": "Automatic Isolation",
        "desc": "Advanced neural networks detect subjects, products, or characters instantly without manual brushing."
      },
      {
        "title": "Edge Preservation",
        "desc": "Maintains edge transitions, fine details, and silhouettes accurately for professional composts."
      },
      {
        "title": "Transparent PNGs",
        "desc": "Outputs lossless transparency formats perfectly suited for web overlays, e-commerce, or composites."
      }
    ],
    "faqs": [
      {
        "question": "What types of images work best?",
        "answer": "Photos with clear distinction between the primary subject and the background yield the best visual cuts. AI detects people, products, animals, and objects."
      },
      {
        "question": "Is transparency preserved in the output?",
        "answer": "Yes. The tool saves the output file as a transparent PNG, letting you place it directly over any background."
      },
      {
        "question": "Are my images private?",
        "answer": "Yes. We process file transformations on secure sandboxed workers, and files are cleaned immediately upon session completion."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Using Transparent Images in Graphic Design and E-Commerce",
        "paragraphs": [
          "In digital marketing and online sales, presenting products on clean, transparent backgrounds is standard practice. It increases user focus, enhances aesthetics, and allows graphics designers to construct promotional assets or banners easily.",
          "Our automated AI remover replaces hours of pen-tool trace work with a single-click script, giving you a ready-to-use PNG element in seconds."
        ]
      }
    ],
    "relatedTools": [
      "image-resizer",
      "webp-converter"
    ]
  },
  {
    "id": "subtitle-generator",
    "slug": "subtitle-generator",
    "name": "Subtitle Generator",
    "isPremium": true,
    "description": "Transcribe audio/video files and generate timed subtitles automatically using Groq Whisper.",
    "primaryTag": "Media",
    "category": "Media",
    "iconTag": "Video",
    "isActive": true,
    "seoMeta": {
      "title": "Free AI Subtitle Generator — Auto Transcription & SRT Creator | utool",
      "description": "Transcribe audio/video files and generate timed subtitles automatically using Groq Whisper. Download SRT, TXT formats.",
      "keywords": [],
      "h1": "AI Subtitle Generator Online"
    },
    "intro": "Adding captions increases video watch time and accessibility. Utool's AI Subtitle Generator automatically transcribes audio or video file speech with high precision. Powered by Groq Whisper, it supports formats like MP3, MP4, WAV, and outputs timed SRT tracks.",
    "howItWorks": [
      "Upload your video (MP4, MOV) or audio (MP3, WAV) file.",
      "Click 'Generate Subtitles' to run transcription.",
      "Review the timed transcription text segments in the preview.",
      "Download timed SRT or plain TXT files."
    ],
    "benefits": [
      {
        "title": "Whisper-Large AI Accuracy",
        "desc": "Utilizes Groq's high-speed Whisper pipeline to transcribe complex accents and voices clearly."
      },
      {
        "title": "Timed SRT Subtitles",
        "desc": "Outputs timed segments in SRT subtitle format, ready to load directly into video editors."
      },
      {
        "title": "Universal Formats",
        "desc": "Supports MP3, MP4, WAV, MOV, M4A with high-performance local buffer streaming."
      }
    ],
    "faqs": [
      {
        "question": "What files can I upload?",
        "answer": "The tool supports audio and video formats including MP3, WAV, M4A, MP4, MOV, and WebM."
      },
      {
        "question": "What subtitle output formats are supported?",
        "answer": "You can download SubRip subtitle tracks (.srt) or plain text transcripts (.txt)."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Increasing Accessibility and Reach with Subtitles",
        "paragraphs": [
          "Captions are vital for video accessibility on social channels where clips autoplay on mute. Utilizing high-performance AI engines to write transcripts ensures accuracy and saves time compared to manual transcription workflows."
        ]
      }
    ],
    "relatedTools": [
      "media-workspace"
    ]
  },
  {
    "id": "pdf-ocr",
    "slug": "pdf-ocr",
    "name": "PDF Text Extractor",
    "description": "Extract plain text elements from PDF documents and image scans online using OCR.",
    "primaryTag": "PDF",
    "category": "PDF",
    "iconTag": "FileCheck",
    "isActive": true,
    "seoMeta": {
      "title": "Free PDF OCR Text Extractor Online — Extract Text from Scans | utool",
      "description": "Extract plain text elements from PDF documents and image scans online using OCR.Space. Safe, fast, with direct copying.",
      "keywords": [],
      "h1": "PDF Text Extractor & OCR Online"
    },
    "intro": "Extracting editable text from scans, photocopies, or image assets shouldn't require manual typing. Utool's PDF Text Extractor uses advanced OCR algorithms to parse text blocks from PDF and image files, returning formatted plain text.",
    "howItWorks": [
      "Upload your scanned PDF document or image file.",
      "Click 'Extract Text' to run optical character recognition.",
      "Review the parsed text formatting in the canvas editor.",
      "Click to copy to clipboard or download as a TXT file."
    ],
    "benefits": [
      {
        "title": "Scanned Document OCR",
        "desc": "Reads text embedded in flat image layers and photocopies where text selection is blocked."
      },
      {
        "title": "Multi-Format Support",
        "desc": "Supports PDFs, PNGs, and JPEG image uploads."
      },
      {
        "title": "Local Safety",
        "desc": "Processed secure backend APIs validate buffers without caching or preserving your sensitive documents."
      }
    ],
    "faqs": [
      {
        "question": "Can I parse handwritten notes?",
        "answer": "OCR accuracy is optimized for printed fonts and digital documents. Handwritten note parsing quality varies based on writing clarity."
      },
      {
        "question": "What is the maximum file page limit?",
        "answer": "Standard limits allow processing of files up to 10MB."
      }
    ],
    "longFormContent": [
      {
        "sectionTitle": "Optimizing Document Indexing with OCR Technology",
        "paragraphs": [
          "Converting flat PDFs and images into indexed plain text allows search engines and text readers to parse contents easily. OCR (Optical Character Recognition) bridges the gap between printed pages and digital systems."
        ]
      }
    ],
    "relatedTools": [
      "merge-pdf",
      "split-pdf"
    ]
  },
  {
    "id": "png-to-jpg",
    "slug": "png-to-jpg",
    "name": "PNG to JPG Converter",
    "description": "Convert PNG images to JPG format instantly with high quality.",
    "primaryTag": "Converter",
    "category": "Converters",
    "iconTag": "RefreshCw",
    "isActive": true,
    "isConverter": true,
    "supportedInputFormats": [
      ".png"
    ],
    "supportedOutputFormats": [
      ".jpg",
      ".jpeg"
    ],
    "seoMeta": {
      "title": "Convert PNG to JPG Online | Fast & Free | Utool",
      "description": "Easily convert PNG images to JPG format online. No registration required, high quality, and 100% secure.",
      "keywords": [
        "png to jpg",
        "convert png",
        "image converter",
        "free online converter"
      ]
    },
    "heroContent": "Fast, secure, and free online PNG to JPG converter. Drag and drop your files to convert them in seconds.",
    "faqs": [
      {
        "question": "Is it free to convert PNG to JPG?",
        "answer": "Yes, our converter is completely free to use."
      },
      {
        "question": "Is my data secure?",
        "answer": "Absolutely. We automatically delete your files after conversion."
      }
    ],
    "relatedTools": [
      "jpg-to-png"
    ]
  },
  {
    "id": "jpg-to-png",
    "slug": "jpg-to-png",
    "name": "JPG to PNG Converter",
    "description": "Convert JPG images to PNG format to preserve transparency.",
    "primaryTag": "Converter",
    "category": "Converters",
    "iconTag": "RefreshCw",
    "isActive": true,
    "isConverter": true,
    "supportedInputFormats": [
      ".jpg",
      ".jpeg"
    ],
    "supportedOutputFormats": [
      ".png"
    ],
    "seoMeta": {
      "title": "Convert JPG to PNG Online | Fast & Free | Utool",
      "description": "Easily convert JPG images to PNG format online to add transparency. High quality and secure.",
      "keywords": [
        "jpg to png",
        "convert jpg",
        "image converter",
        "free online converter"
      ]
    },
    "heroContent": "Easily transform your JPG images into high-quality PNG files. Fast and secure.",
    "faqs": [
      {
        "question": "Does converting JPG to PNG add transparency?",
        "answer": "Converting from JPG to PNG does not automatically create transparency, but it allows you to edit the PNG later to add a transparent background."
      }
    ],
    "relatedTools": [
      "png-to-jpg"
    ]
  },
  {
    "id": "json-to-csv",
    "slug": "json-to-csv",
    "name": "JSON to CSV",
    "description": "Convert JSON to CSV instantly online.",
    "primaryTag": "Converter",
    "category": "Converters",
    "iconTag": "RefreshCw",
    "isActive": true,
    "isConverter": true,
    "supportedInputFormats": [
      ".json"
    ],
    "supportedOutputFormats": [
      ".csv"
    ],
    "seoMeta": {
      "title": "Convert JSON to CSV Online | Free Tool | Utool",
      "description": "Fast and secure JSON to CSV converter. No upload required, runs locally in your browser.",
      "keywords": [
        "json to csv",
        "converter",
        "online tool"
      ],
      "h1": "JSON to CSV Converter"
    },
    "heroContent": "Easily convert your .json files to .csv. 100% free and secure client-side conversion.",
    "howItWorks": [
      "Select your .json file or paste the text.",
      "Click the Convert button.",
      "Download or copy your new .csv file instantly."
    ],
    "benefits": [
      {
        "title": "Fast Conversion",
        "desc": "Instantly process files locally."
      },
      {
        "title": "100% Secure",
        "desc": "No data is sent to our servers."
      }
    ],
    "faqs": [
      {
        "question": "Is it safe to use this JSON to CSV tool?",
        "answer": "Yes, all processing happens in your browser."
      }
    ],
    "relatedTools": []
  },
  {
    "id": "csv-to-json",
    "slug": "csv-to-json",
    "name": "CSV to JSON",
    "description": "Convert CSV to JSON instantly online.",
    "primaryTag": "Converter",
    "category": "Converters",
    "iconTag": "RefreshCw",
    "isActive": true,
    "isConverter": true,
    "supportedInputFormats": [
      ".csv"
    ],
    "supportedOutputFormats": [
      ".json"
    ],
    "seoMeta": {
      "title": "Convert CSV to JSON Online | Free Tool | Utool",
      "description": "Fast and secure CSV to JSON converter. No upload required, runs locally in your browser.",
      "keywords": [
        "csv to json",
        "converter",
        "online tool"
      ],
      "h1": "CSV to JSON Converter"
    },
    "heroContent": "Easily convert your .csv files to .json. 100% free and secure client-side conversion.",
    "howItWorks": [
      "Select your .csv file or paste the text.",
      "Click the Convert button.",
      "Download or copy your new .json file instantly."
    ],
    "benefits": [
      {
        "title": "Fast Conversion",
        "desc": "Instantly process files locally."
      },
      {
        "title": "100% Secure",
        "desc": "No data is sent to our servers."
      }
    ],
    "faqs": [
      {
        "question": "Is it safe to use this CSV to JSON tool?",
        "answer": "Yes, all processing happens in your browser."
      }
    ],
    "relatedTools": []
  },
  {
    "id": "markdown-to-html",
    "slug": "markdown-to-html",
    "name": "Markdown to HTML",
    "description": "Convert Markdown to HTML instantly online.",
    "primaryTag": "Converter",
    "category": "Converters",
    "iconTag": "RefreshCw",
    "isActive": true,
    "isConverter": true,
    "supportedInputFormats": [
      ".md"
    ],
    "supportedOutputFormats": [
      ".html"
    ],
    "seoMeta": {
      "title": "Convert Markdown to HTML Online | Free Tool | Utool",
      "description": "Fast and secure Markdown to HTML converter. No upload required, runs locally in your browser.",
      "keywords": [
        "markdown to html",
        "converter",
        "online tool"
      ],
      "h1": "Markdown to HTML Converter"
    },
    "heroContent": "Easily convert your .md files to .html. 100% free and secure client-side conversion.",
    "howItWorks": [
      "Select your .md file or paste the text.",
      "Click the Convert button.",
      "Download or copy your new .html file instantly."
    ],
    "benefits": [
      {
        "title": "Fast Conversion",
        "desc": "Instantly process files locally."
      },
      {
        "title": "100% Secure",
        "desc": "No data is sent to our servers."
      }
    ],
    "faqs": [
      {
        "question": "Is it safe to use this Markdown to HTML tool?",
        "answer": "Yes, all processing happens in your browser."
      }
    ],
    "relatedTools": []
  },
  {
    "id": "html-to-markdown",
    "slug": "html-to-markdown",
    "name": "HTML to Markdown",
    "description": "Convert HTML to Markdown instantly online.",
    "primaryTag": "Converter",
    "category": "Converters",
    "iconTag": "RefreshCw",
    "isActive": true,
    "isConverter": true,
    "supportedInputFormats": [
      ".html"
    ],
    "supportedOutputFormats": [
      ".md"
    ],
    "seoMeta": {
      "title": "Convert HTML to Markdown Online | Free Tool | Utool",
      "description": "Fast and secure HTML to Markdown converter. No upload required, runs locally in your browser.",
      "keywords": [
        "html to markdown",
        "converter",
        "online tool"
      ],
      "h1": "HTML to Markdown Converter"
    },
    "heroContent": "Easily convert your .html files to .md. 100% free and secure client-side conversion.",
    "howItWorks": [
      "Select your .html file or paste the text.",
      "Click the Convert button.",
      "Download or copy your new .md file instantly."
    ],
    "benefits": [
      {
        "title": "Fast Conversion",
        "desc": "Instantly process files locally."
      },
      {
        "title": "100% Secure",
        "desc": "No data is sent to our servers."
      }
    ],
    "faqs": [
      {
        "question": "Is it safe to use this HTML to Markdown tool?",
        "answer": "Yes, all processing happens in your browser."
      }
    ],
    "relatedTools": []
  },
  {
    "id": "yaml-to-json",
    "slug": "yaml-to-json",
    "name": "YAML to JSON",
    "description": "Convert YAML to JSON instantly online.",
    "primaryTag": "Converter",
    "category": "Converters",
    "iconTag": "RefreshCw",
    "isActive": true,
    "isConverter": true,
    "supportedInputFormats": [
      ".yaml",
      ".yml"
    ],
    "supportedOutputFormats": [
      ".json"
    ],
    "seoMeta": {
      "title": "Convert YAML to JSON Online | Free Tool | Utool",
      "description": "Fast and secure YAML to JSON converter. No upload required, runs locally in your browser.",
      "keywords": [
        "yaml to json",
        "converter",
        "online tool"
      ],
      "h1": "YAML to JSON Converter"
    },
    "heroContent": "Easily convert your .yaml,.yml files to .json. 100% free and secure client-side conversion.",
    "howItWorks": [
      "Select your .yaml file or paste the text.",
      "Click the Convert button.",
      "Download or copy your new .json file instantly."
    ],
    "benefits": [
      {
        "title": "Fast Conversion",
        "desc": "Instantly process files locally."
      },
      {
        "title": "100% Secure",
        "desc": "No data is sent to our servers."
      }
    ],
    "faqs": [
      {
        "question": "Is it safe to use this YAML to JSON tool?",
        "answer": "Yes, all processing happens in your browser."
      }
    ],
    "relatedTools": []
  },
  {
    "id": "base64-encoder-decoder",
    "slug": "base64-encoder-decoder",
    "name": "Base64 Encoder / Decoder",
    "description": "Convert Base64 Encoder / Decoder to Text instantly online.",
    "primaryTag": "Converter",
    "category": "Converters",
    "iconTag": "RefreshCw",
    "isActive": true,
    "isConverter": true,
    "supportedInputFormats": [
      ".txt"
    ],
    "supportedOutputFormats": [
      ".txt"
    ],
    "seoMeta": {
      "title": "Convert Base64 Encoder / Decoder Online | Free Tool | Utool",
      "description": "Fast and secure Base64 Encoder / Decoder converter. No upload required, runs locally in your browser.",
      "keywords": [
        "base64 encoder / decoder",
        "converter",
        "online tool"
      ],
      "h1": "Base64 Encoder / Decoder Converter"
    },
    "heroContent": "Easily convert your .txt files to .txt. 100% free and secure client-side conversion.",
    "howItWorks": [
      "Select your .txt file or paste the text.",
      "Click the Convert button.",
      "Download or copy your new .txt file instantly."
    ],
    "benefits": [
      {
        "title": "Fast Conversion",
        "desc": "Instantly process files locally."
      },
      {
        "title": "100% Secure",
        "desc": "No data is sent to our servers."
      }
    ],
    "faqs": [
      {
        "question": "Is it safe to use this Base64 Encoder / Decoder tool?",
        "answer": "Yes, all processing happens in your browser."
      }
    ],
    "relatedTools": []
  }
];

import { ToolCategory } from '@/types/tool-registry';
import { ALL_INTENT_VARIANTS } from './registry/intent-variants';

// ─────────────────────────────────────────────────────────────────────────────
// Category-aware dynamic tool generator
// Produces distinct, non-generic content for each tool category.
// ─────────────────────────────────────────────────────────────────────────────
function generateDynamicTool(base: {
  id: string;
  slug: string;
  name: string;
  description: string;
  primaryTag: string;
  category: ToolCategory;
  iconTag: string;
  isConverter?: boolean;
  supportedInputFormats?: string[];
  supportedOutputFormats?: string[];
}): RegistryTool {
  const { name, description: desc, category: cat } = base;

  // ── Category-specific intro paragraphs ──────────────────────────────────
  const introMap: Partial<Record<ToolCategory, string>> = {
    PDF: `Working with PDF documents shouldn't require cloud uploads or expensive software. ${name} runs entirely inside your browser using WebAssembly — so your files never leave your machine, processing starts instantly, and there are no server-side size limits or subscription paywalls.`,
    Image: `Image processing that respects your privacy. ${name} converts and edits your photos locally in your browser — no file upload, no server processing, no waiting. Your originals stay on your device at all times.`,
    Developer: `${name} helps developers format, validate, and transform data directly in the browser. No backend calls, no rate limits — results appear in milliseconds as you type or paste your input.`,
    Media: `Edit and convert media files without giving up your content to a third-party server. ${name} processes audio and video directly in your browser tab using the WebAssembly codec suite, keeping your creative assets private.`,
    AI: `Harness AI-powered assistance without sacrificing speed or data privacy. ${name} delivers intelligent results in seconds, processing your input client-side wherever possible.`,
    Text: `${name} handles text formatting, analysis, and transformation entirely in your browser. Paste any amount of text and get instant results — no copy limits, no signup, no data retention.`,
    Converters: `${name} converts your files or data 100% in-browser with zero uploads. The WebAssembly engine reads your input locally and writes the output directly to your download — bypassing any server entirely.`,
    Calculators: `${name} performs calculations instantly in your browser. Enter your values and get results in real time — no account needed, no data sent anywhere, works offline once loaded.`,
    Color: `${name} gives designers and developers precise color values instantly. All calculations run locally in the browser — paste a color code and get every format you need in one click.`,
    SEO: `${name} helps you analyse and improve your site's search performance. Input your data and get actionable results immediately — no API keys, no rate limits on free usage.`,
    Security: `${name} handles sensitive cryptographic operations locally in your browser. No private key, password, or hash is ever transmitted to our servers — security operations run in the sandboxed browser environment.`,
    Finance: `${name} performs financial calculations precisely and instantly. Input your figures and get clear, formatted results in real time — useful for both quick estimates and detailed planning.`,
    Documents: `${name} processes document formats directly in your browser. Your content stays on your device throughout — no upload required, no cloud processing, full offline capability after page load.`,
    Utilities: `${name} is a lightweight browser utility that runs instantly without any installation or sign-up. Open the page, use the tool, and close it — it's that simple.`,
  };

  // ── Category-specific how-it-works ─────────────────────────────────────
  const howItWorksMap: Partial<Record<ToolCategory, string[]>> = {
    PDF: [
      `Upload your PDF file or drop it into the workspace — it loads into browser memory, not a server.`,
      `Configure any options such as page range, quality level, or output format.`,
      `Click the action button. WebAssembly processes the document locally on your CPU.`,
      `Download the output PDF directly to your device.`,
    ],
    Image: [
      `Select your image file from your device or drag it into the upload zone.`,
      `Adjust parameters — resize dimensions, quality slider, format, or filters.`,
      `The browser engine processes the image locally. Preview updates in real time.`,
      `Click Download to save your processed image.`,
    ],
    Developer: [
      `Paste your code, data string, or configuration into the input panel.`,
      `The tool parses and processes your input instantly as you type.`,
      `Review the formatted, validated, or converted output on the right panel.`,
      `Copy the result to your clipboard or download it as a file.`,
    ],
    Converters: [
      `Select your source file or paste the input data into the workspace.`,
      `Choose the target format or output settings from the options panel.`,
      `Click Convert — the WebAssembly engine transforms your data in milliseconds.`,
      `Download or copy the converted output.`,
    ],
    Security: [
      `Enter your text, file, or credentials into the secure input field.`,
      `The cryptographic function runs locally in your browser's sandboxed memory.`,
      `Copy the generated hash, token, or encrypted output.`,
      `Your input data is cleared from memory when you close or refresh the page.`,
    ],
    Calculators: [
      `Enter your input values into the clearly labelled fields.`,
      `Results calculate automatically in real time as you type.`,
      `Review the breakdown and summary in the output panel.`,
      `Copy or screenshot the results for your records.`,
    ],
    Finance: [
      `Enter your financial figures — principal, rate, period, or other parameters.`,
      `The calculator updates instantly, showing the computed result and a full breakdown.`,
      `Review the amortization table or growth chart if available.`,
      `Export or screenshot your results for reporting.`,
    ],
  };

  // ── Category-specific FAQs ───────────────────────────────────────────────
  const extraFaqsMap: Partial<Record<ToolCategory, Array<{question: string; answer: string}>>> = {
    PDF: [
      { question: `Does ${name} work with password-protected PDFs?`, answer: `PDFs with user-level password protection must be unlocked before processing. Use the utool Unlock PDF tool first, then re-open them in ${name}.` },
      { question: `Will ${name} preserve fonts and vector elements?`, answer: `Yes. utool's PDF engine preserves vector fonts, embedded images, active hyperlinks, and structural elements without rasterizing or degrading the document.` },
    ],
    Image: [
      { question: `What image formats does ${name} support?`, answer: `utool supports PNG, JPG, JPEG, WebP, GIF, BMP, TIFF, and SVG across its image tools. Specific format support varies per tool and is shown in the upload dropzone.` },
      { question: `Will ${name} affect the original image on my device?`, answer: `Never. utool reads your image into browser memory without modifying the original file. The processed output is a new file that you download separately.` },
    ],
    Developer: [
      { question: `Can ${name} handle large code files?`, answer: `Yes. The browser-native engine processes text and data entirely in memory. There is no server-side file size limit — only your device's available RAM.` },
      { question: `Does ${name} support multiple programming languages or formats?`, answer: `Support varies by tool. Check the tool's input panel for accepted formats. Most developer tools accept plain text, JSON, XML, YAML, HTML, CSS, and JavaScript.` },
    ],
    Security: [
      { question: `Are my passwords or hashes stored by utool?`, answer: `Absolutely not. Security tools on utool run in your browser's isolated sandbox. No input data is transmitted to our servers or retained after you close the page.` },
    ],
  };

  // ── Category-specific long-form content ─────────────────────────────────
  const longFormMap: Partial<Record<ToolCategory, Array<{sectionTitle: string; paragraphs: string[]}>>> = {
    PDF: [{
      sectionTitle: `The Advantage of Browser-Native PDF Processing`,
      paragraphs: [
        `Traditional PDF tools require uploading your documents to third-party cloud servers for processing. This creates unnecessary privacy risks — especially for legal contracts, financial statements, medical records, and business documents that may contain personally identifiable information.`,
        `utool's ${name} solves this by running the entire PDF operation inside your browser using a WebAssembly-compiled PDF engine. Your document loads into sandboxed browser memory, gets processed there, and the result is downloaded directly — never touching any external infrastructure.`,
      ]
    }],
    Image: [{
      sectionTitle: `Client-Side Image Processing: Speed and Privacy Combined`,
      paragraphs: [
        `Image processing on the web has historically required server infrastructure — you upload your photo, it gets processed by a remote server, and you download the result. This approach leaks your photos to external systems and creates upload/download latency.`,
        `utool flips this model. ${name} uses a WebAssembly image codec compiled from production-grade C++ libraries (like libvips and sharp) to process your images directly in the browser. The result is instant processing, zero privacy risk, and no file size limits imposed by server cost constraints.`,
      ]
    }],
    Developer: [{
      sectionTitle: `Why Developers Choose Browser-Native Tools`,
      paragraphs: [
        `Developer tools that run server-side create friction: rate limits, API key requirements, data privacy concerns, and latency. For quick formatting, hashing, or conversion tasks, these hurdles slow down workflow unnecessarily.`,
        `${name} runs entirely in your browser. Paste your input, get your result immediately — no authentication, no rate limits, no concerns about what happens to your code or data on the other end.`,
      ]
    }],
    Security: [{
      sectionTitle: `Security Tool Privacy: Why Local Execution Matters`,
      paragraphs: [
        `Cryptographic operations should never be performed on a server you don't control. Sending a password, private key, or sensitive hash to a third-party API introduces a fundamental security contradiction — you're trusting someone else with the data you're trying to secure.`,
        `${name} performs all operations in your browser's isolated sandbox. The cryptographic primitives are implemented using the Web Crypto API and WebAssembly — the same standards used by your operating system and browser for built-in security features.`,
      ]
    }],
    Finance: [{
      sectionTitle: `Financial Calculations You Can Trust`,
      paragraphs: [
        `${name} uses standard financial formulas without rounding errors or approximations. All computation runs locally in JavaScript with IEEE 754 double-precision arithmetic, giving you the same accuracy you'd expect from a spreadsheet or financial calculator.`,
        `Your financial input — loan amounts, interest rates, personal income figures — is never sent to any server. The entire calculation happens in your browser, so your financial data stays completely private.`,
      ]
    }],
    Calculators: [{
      sectionTitle: `Instant, Accurate Calculations in Your Browser`,
      paragraphs: [
        `${name} updates results in real time as you type, using validated mathematical formulas. All calculations run locally in your browser — no server round-trip means zero latency and complete offline capability.`,
        `Unlike many online calculators that are basic and ad-heavy, utool's ${name} provides a clean, professional interface with formatted output, clear formula breakdowns, and copy-to-clipboard functionality for easy use in reports and documents.`,
      ]
    }],
  };

  const defaultIntro = `${name} runs entirely in your browser using WebAssembly — your data is processed locally with zero uploads, zero server contact, and zero waiting. Unlike cloud-based alternatives, utool guarantees that your files and inputs stay private on your device throughout the entire operation.`;
  const defaultHowItWorks = [
    `Open the ${name} tool page in your browser.`,
    `Select your file or paste your input into the workspace.`,
    `Review and adjust settings — all processing previews update in real time.`,
    `Download or copy your result directly to your device.`,
  ];
  const defaultFaqs = [
    {
      question: `Is it safe to use ${name} on utool?`,
      answer: `Yes, 100% secure. All processing runs locally inside your browser using WebAssembly. No data is transmitted to our servers, stored, or logged.`,
    },
    {
      question: `Do I need to install software to use ${name}?`,
      answer: `No installation needed. utool runs directly in Chrome, Firefox, Edge, and Safari on Windows, macOS, Linux, iOS, and Android.`,
    },
    {
      question: `Can I use ${name} offline?`,
      answer: `Yes. Once the page has loaded, all processing runs locally. You can disconnect from the internet and continue using the tool without interruption.`,
    },
    {
      question: `Is there a file size limit?`,
      answer: `No server-imposed limits. Processing runs on your own device, so limits are determined only by your available browser memory.`,
    },
  ];
  const defaultLongForm = [{
    sectionTitle: `Why ${name} is Better Than Server-Based Alternatives`,
    paragraphs: [
      `Traditional web tools process your data on external cloud servers, introducing upload latency, privacy risks, and arbitrary file size limits. utool eliminates these problems by running ${name} entirely inside your browser.`,
      `The result: instant processing (no upload wait), complete privacy (no server contact), and no limits (no server costs to recover through paywalls). Whether you use ${name} once a week or dozens of times per day, the experience is consistently fast, free, and private.`,
    ]
  }];

  return {
    ...base,
    isActive: true,
    seoMeta: {
      title: `${name} Online Free — Secure, Private & No Upload Required | utool`,
      description: `${desc} Runs 100% in your browser — no uploads, no size limits, no sign-up. Free forever. Powered by WebAssembly for instant, private results.`,
      keywords: [name.toLowerCase(), cat.toLowerCase(), 'no upload', 'browser tool', 'free', 'privacy-first', 'webassembly'],
      h1: `${name} — Free Online Tool`,
    },
    intro: introMap[cat] ?? defaultIntro,
    howItWorks: howItWorksMap[cat] ?? defaultHowItWorks,
    benefits: [
      {
        title: '100% Client-Side Privacy',
        desc: 'Your data never leaves your browser. Everything is processed in the local sandbox using WebAssembly, keeping your files and inputs safe from third-party exposure.',
      },
      {
        title: 'No Size Limits or Paywalls',
        desc: 'Since processing runs on your own device CPU, there are no server-side file size caps or subscription paywalls to work around.',
      },
      {
        title: 'Works on All Devices',
        desc: 'utool runs in any modern browser on Windows, macOS, Linux, iOS, and Android — no installation, no account, no friction.',
      },
    ],
    faqs: [
      ...defaultFaqs,
      ...(extraFaqsMap[cat] ?? []),
    ],
    longFormContent: longFormMap[cat] ?? defaultLongForm,
    relatedTools: [],
  };
}

const DYNAMIC_TOOL_BASES: Array<{
  id: string;
  slug: string;
  name: string;
  description: string;
  primaryTag: string;
  category: ToolCategory;
  iconTag: string;
  isConverter?: boolean;
  supportedInputFormats?: string[];
  supportedOutputFormats?: string[];
  isPremium?: boolean;
}> = [
  // PDF
  { id: "merge-multiple-pdfs", slug: "merge-multiple-pdfs", name: "Merge Multiple PDFs", description: "Combine multiple PDF documents together in any sequence.", primaryTag: "PDF", category: "PDF", iconTag: "Layers" },
  { id: "merge-password-pdfs", slug: "merge-password-pdfs", name: "Merge Password-Protected PDFs", description: "Unlock and merge password-encrypted PDF files online.", primaryTag: "PDF", category: "PDF", iconTag: "Lock" },
  { id: "merge-large-pdfs", slug: "merge-large-pdfs", name: "Merge Large PDFs", description: "Combine massive PDF documents locally without size limits.", primaryTag: "PDF", category: "PDF", iconTag: "Maximize2" },
  { id: "merge-scanned-pdfs", slug: "merge-scanned-pdfs", name: "Merge Scanned PDFs", description: "Compile scanned pages and documents into a clean PDF file.", primaryTag: "PDF", category: "PDF", iconTag: "FileText" },
  { id: "merge-pdfs-offline", slug: "merge-pdfs-offline", name: "Merge PDFs Offline", description: "Run local browser compilations to merge PDF documents fully offline.", primaryTag: "PDF", category: "PDF", iconTag: "Layers" },
  { id: "rotate-pdf", slug: "rotate-pdf", name: "Rotate PDF", description: "Rotate PDF pages and adjust document orientation locally.", primaryTag: "PDF", category: "PDF", iconTag: "RotateCcw" },
  { id: "delete-pdf-pages", slug: "delete-pdf-pages", name: "Delete PDF Pages", description: "Remove unwanted pages from your PDF file dynamically.", primaryTag: "PDF", category: "PDF", iconTag: "Trash2" },
  { id: "extract-pdf-pages", slug: "extract-pdf-pages", name: "Extract PDF Pages", description: "Isolate and save specific pages from any PDF document.", primaryTag: "PDF", category: "PDF", iconTag: "Maximize2" },
  { id: "repair-pdf", slug: "repair-pdf", name: "Repair PDF", description: "Fix corrupt PDF file headers and recover document elements.", primaryTag: "PDF", category: "PDF", iconTag: "Activity" },
  { id: "sign-pdf", slug: "sign-pdf", name: "Sign PDF", description: "Add secure electronic signatures and initials to PDF contracts.", primaryTag: "PDF", category: "PDF", iconTag: "PenTool", isPremium: true },
  { id: "redact-pdf", slug: "redact-pdf", name: "Redact PDF", description: "Permanently black out and sanitize sensitive information in PDFs.", primaryTag: "PDF", category: "PDF", iconTag: "EyeOff" },
  { id: "organize-pdf", slug: "organize-pdf", name: "Organize PDF", description: "Rearrange, sort, and reorder pages in your PDF file visually.", primaryTag: "PDF", category: "PDF", iconTag: "Sliders" },

  // Image
  { id: "png-to-pdf-converter", slug: "png-to-pdf", name: "PNG to PDF Converter", description: "Convert PNG images into standard PDF documents.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "webp-to-pdf-converter", slug: "webp-to-pdf", name: "WebP to PDF Converter", description: "Convert WebP images into high-fidelity PDF documents.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "heic-to-pdf", slug: "heic-to-pdf", name: "HEIC to PDF Converter", description: "Convert iPhone HEIC photos into high-fidelity PDF documents.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "gif-to-pdf", slug: "gif-to-pdf", name: "GIF to PDF Converter", description: "Compile animated or static GIF files into readable PDFs.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "tiff-to-pdf", slug: "tiff-to-pdf", name: "TIFF to PDF Converter", description: "Convert large TIFF graphics into standard PDF document files.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "svg-to-pdf", slug: "svg-to-pdf", name: "SVG to PDF Converter", description: "Convert scalable vector SVG illustrations to PDF format.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "bmp-to-pdf", slug: "bmp-to-pdf", name: "BMP to PDF Converter", description: "Convert bitmap BMP images into high-quality PDF files.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "ico-to-pdf", slug: "ico-to-pdf", name: "ICO to PDF Converter", description: "Convert website ICO favicon objects into PDF records.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "raw-to-pdf", slug: "raw-to-pdf", name: "RAW to PDF Converter", description: "Convert digital camera RAW photos into PDF layouts.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "avif-to-pdf", slug: "avif-to-pdf", name: "AVIF to PDF Converter", description: "Convert modern AVIF images into standard PDF documents.", primaryTag: "Image", category: "Image", iconTag: "FileImage" },
  { id: "pdf-to-png", slug: "pdf-to-png", name: "PDF to PNG Extractor", description: "Extract pages of any PDF document as high-resolution PNGs.", primaryTag: "Image", category: "Image", iconTag: "Image" },
  { id: "pdf-to-webp", slug: "pdf-to-webp", name: "PDF to WebP Extractor", description: "Convert PDF pages into lightweight modern WebP images.", primaryTag: "Image", category: "Image", iconTag: "Image" },
  { id: "pdf-to-svg", slug: "pdf-to-svg", name: "PDF to SVG Converter", description: "Export PDF page vectors as scalable SVG illustrations.", primaryTag: "Image", category: "Image", iconTag: "Image" },
  { id: "image-crop", slug: "image-crop", name: "Image Cropper", description: "Crop and adjust image dimensions online with exact aspect ratios.", primaryTag: "Image", category: "Image", iconTag: "Crop" },
  { id: "image-blur", slug: "image-blur", name: "Image Blur", description: "Apply blur filters and anonymize sections of your images locally.", primaryTag: "Image", category: "Image", iconTag: "EyeOff" },
  { id: "image-sharpen", slug: "image-sharpen", name: "Image Sharpen", description: "Enhance details and sharpen fuzzy edges in your photos.", primaryTag: "Image", category: "Image", iconTag: "Sparkles" },
  { id: "image-upscale", slug: "image-upscale", name: "Image Upscaler", description: "Increase image resolution using client-side details interpolation.", primaryTag: "Image", category: "Image", iconTag: "Maximize2" },
  { id: "image-watermark", slug: "image-watermark", name: "Image Watermark", description: "Add overlay text or logo watermarks to protect your photos.", primaryTag: "Image", category: "Image", iconTag: "Sliders" },
  { id: "exif-removal", slug: "exif-removal", name: "EXIF Metadata Remover", description: "Strip camera info, GPS coordinates, and private EXIF tags from photos.", primaryTag: "Image", category: "Image", iconTag: "Shield" },
  { id: "convert-color-space", slug: "convert-color-space", name: "Color Space Converter", description: "Convert image files between RGB, CMYK, and grayscale profiles.", primaryTag: "Image", category: "Image", iconTag: "Sliders" },
  { id: "batch-rename-images", slug: "batch-rename-images", name: "Batch Rename Images", description: "Rename groups of photos matching dynamic patterns locally.", primaryTag: "Image", category: "Image", iconTag: "Type" },

  // Developer Tools
  { id: "json-validator", slug: "json-validator", name: "JSON Validator", description: "Validate and debug JSON data with clear syntax error lines.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "json-compare", slug: "json-compare", name: "JSON Compare & Diff", description: "Compare two JSON payloads and highlight nested differences.", primaryTag: "Developer", category: "Developer", iconTag: "Sliders" },
  { id: "xml-formatter", slug: "xml-formatter", name: "XML Formatter", description: "Prettify, format, and indent XML elements dynamically.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "xml-validator", slug: "xml-validator", name: "XML Validator", description: "Check XML documents for schema formatting compliance.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "xml-to-json", slug: "xml-to-json", name: "XML to JSON Converter", description: "Convert XML schemas into structured JSON objects.", primaryTag: "Developer", category: "Developer", iconTag: "Sliders" },
  { id: "json-to-xml", slug: "json-to-xml", name: "JSON to XML Converter", description: "Convert JSON key-values into structured XML syntax.", primaryTag: "Developer", category: "Developer", iconTag: "Sliders" },
  { id: "yaml-validator", slug: "yaml-validator", name: "YAML Validator", description: "Validate syntax of YAML configuration files.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "json-to-yaml", slug: "json-to-yaml", name: "JSON to YAML Converter", description: "Format standard JSON payloads into YAML scripts.", primaryTag: "Developer", category: "Developer", iconTag: "Sliders" },
  { id: "base64-image-encoder", slug: "base64-image-encoder", name: "Base64 Image Encoder", description: "Convert PNG, JPG, or SVG graphics into Base64 DataURI strings.", primaryTag: "Developer", category: "Developer", iconTag: "Image" },
  { id: "jwt-decoder", slug: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect headers, payload, and signatures of JWT tokens.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "jwt-generator", slug: "jwt-generator", name: "JWT Generator", description: "Generate JSON Web Tokens (JWT) for testing Auth configurations.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "regex-tester", slug: "regex-tester", name: "Regex Tester", description: "Test regular expressions in real-time with sample input logs.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "regex-generator", slug: "regex-generator", name: "Regex Generator", description: "Generate regular expression patterns based on text descriptions.", primaryTag: "Developer", category: "Developer", iconTag: "Sparkles" },
  { id: "uuid-generator", slug: "uuid-generator", name: "UUID Generator", description: "Generate custom batches of unique UUID identifiers.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "uuid-v4-generator", slug: "uuid-v4-generator", name: "UUID v4 Generator", description: "Generate RFC-compliant cryptographically secure UUID version 4 IDs.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "hash-md5-generator", slug: "hash-md5-generator", name: "MD5 Hash Generator", description: "Calculate secure MD5 cryptographic hash keys locally.", primaryTag: "Developer", category: "Developer", iconTag: "Lock" },
  { id: "hash-sha256-generator", slug: "hash-sha256-generator", name: "SHA-256 Hash Generator", description: "Generate secure SHA-256 check sums for verify files.", primaryTag: "Developer", category: "Developer", iconTag: "Lock" },
  { id: "checksum-calculator", slug: "checksum-calculator", name: "Checksum Calculator", description: "Verify files checksum matching SHA-1, SHA-256 or MD5 signatures.", primaryTag: "Developer", category: "Developer", iconTag: "Lock" },
  { id: "color-picker", slug: "color-picker", name: "Color Picker", description: "Select colors from eye-droppers and copy Hex/RGB codes.", primaryTag: "Developer", category: "Developer", iconTag: "Sliders" },
  { id: "cron-builder", slug: "cron-builder", name: "Cron Expression Builder", description: "Build scheduled cron jobs schedules visually.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "cron-parser", slug: "cron-parser", name: "Cron Expression Parser", description: "Translate cron expressions into human-readable schedules.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "diff-checker", slug: "diff-checker", name: "Diff Checker & Compare", description: "Compare two text snippets and see highlighted line differences.", primaryTag: "Developer", category: "Developer", iconTag: "Sliders" },
  { id: "markdown-preview", slug: "markdown-preview", name: "Markdown Live Preview", description: "Render Markdown syntax into styled HTML in real-time.", primaryTag: "Developer", category: "Developer", iconTag: "Eye" },
  { id: "html-formatter", slug: "html-formatter", name: "HTML Formatter", description: "Format, beautify and properly indent markup HTML code.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "css-minifier", slug: "css-minifier", name: "CSS Minifier", description: "Compress and minify CSS styles to optimize page sizes.", primaryTag: "Developer", category: "Developer", iconTag: "Minimize2" },
  { id: "js-beautifier", slug: "js-beautifier", name: "JavaScript Beautifier", description: "Format, un-minify, and prettify raw JavaScript scripts.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "url-encoder", slug: "url-encoder", name: "URL Encoder", description: "Percent-encode parameters and special characters in links.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "url-decoder", slug: "url-decoder", name: "URL Decoder", description: "Decode percent-encoded URL links and query queries.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "sql-formatter", slug: "sql-formatter", name: "SQL Query Formatter", description: "Beautify, uppercase keywords and format database SQL queries.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },
  { id: "sql-minifier", slug: "sql-minifier", name: "SQL Query Minifier", description: "Minify and strip comments from SQL code for clean logs.", primaryTag: "Developer", category: "Developer", iconTag: "Minimize2" },
  { id: "text-diff", slug: "text-diff", name: "Text Diff Checker", description: "See side-by-side textual diff mappings in browser.", primaryTag: "Developer", category: "Developer", iconTag: "Sliders" },
  { id: "user-agent-parser", slug: "user-agent-parser", name: "User Agent Parser", description: "Inspect browser, OS, and hardware parameters from agent strings.", primaryTag: "Developer", category: "Developer", iconTag: "Laptop" },
  { id: "ip-lookup", slug: "ip-lookup", name: "IP Address Lookup", description: "Find country, city and network info of any IP address.", primaryTag: "Developer", category: "Developer", iconTag: "Globe" },
  { id: "dns-lookup", slug: "dns-lookup", name: "DNS Lookup Utility", description: "Perform A, AAAA, MX, TXT and CNAME lookups in browser.", primaryTag: "Developer", category: "Developer", iconTag: "Globe" },
  { id: "port-scanner", slug: "port-scanner", name: "Online Port Scanner", description: "Scan common TCP ports of targets to test firewall rules.", primaryTag: "Developer", category: "Developer", iconTag: "Activity" },
  { id: "subnet-calculator", slug: "subnet-calculator", name: "IP Subnet Calculator", description: "Calculate subnet masks, CIDR network ranges, and host limits.", primaryTag: "Developer", category: "Developer", iconTag: "Terminal" },

  // AI Productivity
  { id: "cover-letter-generator", slug: "cover-letter-generator", name: "Cover Letter Generator", description: "Generate custom, highly persuasive cover letters in seconds.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "speech-to-text", slug: "speech-to-text", name: "Speech to Text Converter", description: "Convert raw voice recordings or microphone input into text.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "image-ocr", slug: "image-ocr", name: "Image OCR Scanner", description: "Extract editable text from pictures, receipts, and scans.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "pdf-summarizer", slug: "pdf-summarizer", name: "PDF Summarizer", description: "Generate key takeaways and outline summaries of large PDFs.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "meeting-notes", slug: "meeting-notes", name: "Meeting Notes AI", description: "Structure transcript logs into summaries, goals and action items.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "text-simplifier", slug: "text-simplifier", name: "Text Simplifier", description: "Rewrite jargon and complex texts into simple, plain wording.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "grammar-checker", slug: "grammar-checker", name: "AI Grammar Checker", description: "Correct syntax, spelling and proofread text instantly.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "paragraph-writer", slug: "paragraph-writer", name: "AI Paragraph Writer", description: "Write persuasive, engaging paragraphs on any topic.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "essay-writer", slug: "essay-writer", name: "AI Essay Writer", description: "Draft structural essays and reviews with clear headings.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "ai-code-generator", slug: "ai-code-generator", name: "AI Code Generator", description: "Generate CSS, JS, Python, HTML or SQL code arrays from prompts.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "code-explainer", slug: "code-explainer", name: "AI Code Explainer", description: "Deconstruct and explain programming logic in human terms.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "text-to-speech", slug: "text-to-speech", name: "AI Text to Speech", description: "Convert written script files into natural-sounding voice files.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },
  { id: "image-prompt-generator", slug: "image-prompt-generator", name: "AI Image Prompt Generator", description: "Formulate descriptive artwork prompts for Midjourney or Stable Diffusion.", primaryTag: "AI", category: "AI", iconTag: "Sparkles" },

  // Media Tools
  { id: "audio-converter", slug: "audio-converter", name: "Audio Converter", description: "Convert audio files between MP3, WAV, M4A, OGG, and FLAC.", primaryTag: "Media", category: "Media", iconTag: "Music" },
  { id: "audio-trimmer", slug: "audio-trimmer", name: "Audio Trimmer & Cutter", description: "Cut and trim MP3 audio files directly in your browser.", primaryTag: "Media", category: "Media", iconTag: "Music" },
  { id: "audio-joiner", slug: "audio-joiner", name: "Audio Joiner & Merger", description: "Combine multiple audio files into a single output track.", primaryTag: "Media", category: "Media", iconTag: "Music" },
  { id: "video-to-gif", slug: "video-to-gif", name: "Video to GIF Converter", description: "Convert MP4 or WebM video clips into looping animated GIFs.", primaryTag: "Media", category: "Media", iconTag: "Video" },
  { id: "video-trimmer", slug: "video-trimmer", name: "Video Trimmer", description: "Cut and isolate sections of video files client-side.", primaryTag: "Media", category: "Media", iconTag: "Video" },
  { id: "mute-video", slug: "mute-video", name: "Mute Video", description: "Strip audio tracks from video files locally.", primaryTag: "Media", category: "Media", iconTag: "Video" },
  { id: "mp3-to-wav", slug: "mp3-to-wav", name: "MP3 to WAV Converter", description: "Convert compressed MP3 files into raw WAV tracks.", primaryTag: "Media", category: "Media", iconTag: "Music" },
  { id: "wav-to-mp3", slug: "wav-to-mp3", name: "WAV to MP3 Converter", description: "Convert raw WAV audio files into lightweight MP3 tracks.", primaryTag: "Media", category: "Media", iconTag: "Music" },
  { id: "mp4-to-mp3", slug: "mp4-to-mp3", name: "MP4 to MP3 Extractor", description: "Extract audio tracks from MP4 video files locally.", primaryTag: "Media", category: "Media", iconTag: "Music" },
  { id: "webm-to-mp4", slug: "webm-to-mp4", name: "WebM to MP4 Converter", description: "Convert modern web-friendly WebM videos into MP4 format.", primaryTag: "Media", category: "Media", iconTag: "Video" },
  { id: "screen-recorder", slug: "screen-recorder", name: "Screen Recorder", description: "Record browser tabs, windows or full screens locally.", primaryTag: "Media", category: "Media", iconTag: "Video" },
  { id: "voice-recorder", slug: "voice-recorder", name: "Voice Recorder", description: "Record audio from your microphone and download as MP3.", primaryTag: "Media", category: "Media", iconTag: "Music" },
  { id: "video-compressor", slug: "video-compressor", name: "Video Compressor", description: "Compress video files by adjusting bitrates and frames.", primaryTag: "Media", category: "Media", iconTag: "Video" },
  { id: "audio-compressor", slug: "audio-compressor", name: "Audio Compressor", description: "Reduce MP3/WAV sizes by shifting bitrates locally.", primaryTag: "Media", category: "Media", iconTag: "Music" },
  { id: "metronome", slug: "metronome", name: "BPM Metronome", description: "Play audio click trackers with custom BPM and tempos.", primaryTag: "Media", category: "Media", iconTag: "Activity" },
  { id: "guitar-tuner", slug: "guitar-tuner", name: "Guitar Tuner", description: "Tune string instruments using your microphone receiver.", primaryTag: "Media", category: "Media", iconTag: "Activity" },

  // Text Tools
  { id: "word-counter", slug: "word-counter", name: "Word Counter", description: "Count words, letters, paragraphs, and read times in real-time.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "character-counter", slug: "character-counter", name: "Character Counter", description: "Count characters with and without space limits.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "line-counter", slug: "line-counter", name: "Line Counter", description: "Calculate the exact line count of raw text snippets.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "case-converter", slug: "case-converter", name: "Case Converter", description: "Convert texts to uppercase, lowercase, titlecase or sentencecase.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "text-reverser", slug: "text-reverser", name: "Text Reverser", description: "Reverse characters, words or entire lines of text.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "binary-to-text", slug: "binary-to-text", name: "Binary to Text Converter", description: "Decode binary code arrays back into readable texts.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "text-to-binary", slug: "text-to-binary", name: "Text to Binary Converter", description: "Encode raw text sentences into binary code bytes.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "morse-code-encoder", slug: "morse-code-encoder", name: "Morse Code Encoder", description: "Translate text characters into Morse code dots and dashes.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "morse-code-decoder", slug: "morse-code-decoder", name: "Morse Code Decoder", description: "Translate Morse code signals back into readable characters.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "lorem-ipsum-generator", slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", description: "Create customized placeholder text arrays for mockups.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "random-word-generator", slug: "random-word-generator", name: "Random Word Generator", description: "Generate lists of random nouns, adjectives or verbs.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "text-sorter", slug: "text-sorter", name: "Text Sorter", description: "Sort text list lines alphabetically or numerically.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "remove-duplicate-lines", slug: "remove-duplicate-lines", name: "Remove Duplicate Lines", description: "Clean text by stripping identical repeating lines.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "strip-html-tags", slug: "strip-html-tags", name: "HTML Tags Stripper", description: "Strip all markup elements and isolate raw text logs.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "slug-generator", slug: "slug-generator", name: "URL Slug Generator", description: "Convert headings into SEO-friendly web link slugs.", primaryTag: "Text", category: "Text", iconTag: "Type" },
  { id: "find-and-replace", slug: "find-and-replace", name: "Find and Replace", description: "Replace specific strings in texts with custom matches.", primaryTag: "Text", category: "Text", iconTag: "Type" },

  // Document Tools
  { id: "docx-to-pdf", slug: "docx-to-pdf", name: "DOCX to PDF Converter", description: "Convert Microsoft Word documents into secure PDF files.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "odt-to-pdf", slug: "odt-to-pdf", name: "ODT to PDF Converter", description: "Convert OpenOffice ODT documents into standard PDFs.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "rtf-to-pdf", slug: "rtf-to-pdf", name: "RTF to PDF Converter", description: "Convert rich text formatting files into secure PDF layouts.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "pdf-to-docx", slug: "pdf-to-docx", name: "PDF to DOCX Converter", description: "Convert PDF documents into editable Microsoft Word files.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "xlsx-to-pdf", slug: "xlsx-to-pdf", name: "Excel to PDF Converter", description: "Convert Microsoft Excel worksheets into standard PDF layouts.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "pdf-to-xlsx", slug: "pdf-to-xlsx", name: "PDF to Excel Converter", description: "Convert PDF data tables back into editable Excel worksheets.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "pptx-to-pdf", slug: "pptx-to-pdf", name: "PowerPoint to PDF Converter", description: "Convert PowerPoint presentations into secure PDF slides.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "pdf-to-pptx", slug: "pdf-to-pptx", name: "PDF to PowerPoint Converter", description: "Convert PDF pages back into editable PowerPoint slide presentations.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "epub-reader", slug: "epub-reader", name: "EPUB Reader", description: "Read EPUB e-books in your web browser locally.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "text-to-pdf", slug: "text-to-pdf", name: "TXT to PDF Converter", description: "Convert raw text file logs into secure PDF documents.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "html-to-pdf", slug: "html-to-pdf", name: "HTML to PDF Converter", description: "Print or export HTML codes as document files.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "excel-to-csv", slug: "excel-to-csv", name: "Excel to CSV Converter", description: "Convert Excel worksheets into comma-separated value tables.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "csv-to-excel", slug: "csv-to-excel", name: "CSV to Excel Converter", description: "Compile CSV table structures into Excel worksheets.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "xml-reader", slug: "xml-reader", name: "XML Reader & Viewer", description: "View and browse structured XML files in tree forms.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },
  { id: "csv-reader", slug: "csv-reader", name: "CSV Table Reader", description: "Open and analyze CSV data in visual table sheets.", primaryTag: "Documents", category: "Documents", iconTag: "FileText" },

  // Calculators
  { id: "scientific-calculator", slug: "scientific-calculator", name: "Scientific Calculator", description: "Solve trigonometry, log, and complex math equations online.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "percentage-calculator", slug: "percentage-calculator", name: "Percentage Calculator", description: "Find percentage gains, ratios, and relative changes instantly.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "age-calculator", slug: "age-calculator", name: "Age Calculator", description: "Calculate age, days lived, and weekday milestones from birthdates.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "date-calculator", slug: "date-calculator", name: "Date Calculator", description: "Calculate date intervals and relative days from date points.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "gpa-calculator", slug: "gpa-calculator", name: "GPA Calculator", description: "Translate grades and credits into weighted average GPA indexes.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "loan-calculator", slug: "loan-calculator", name: "EMI Loan Calculator", description: "Calculate monthly EMI repayments and principal-interest flows.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "compound-interest", slug: "compound-interest", name: "Compound Interest Calculator", description: "Model compound returns and yield gains over time horizons.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "mortgage-calculator", slug: "mortgage-calculator", name: "Mortgage Calculator", description: "Evaluate home mortgage loan sizes, taxes, and monthly bills.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "bmi-calculator", slug: "bmi-calculator", name: "BMI Calculator", description: "Calculate body mass index values for health assessments.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "calorie-calculator", slug: "calorie-calculator", name: "Calorie Calculator", description: "Estimate daily energy burns and weight-goal intake limits.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "tax-calculator", slug: "tax-calculator", name: "Income Tax Calculator", description: "Estimate brackets tax liability and net pay levels.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "discount-calculator", slug: "discount-calculator", name: "Discount Calculator", description: "Calculate price cuts, savings, and net costs after discounts.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "tip-calculator", slug: "tip-calculator", name: "Tip Calculator", description: "Calculate food tips, bills split and custom percentages.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "fraction-calculator", slug: "fraction-calculator", name: "Fraction Calculator", description: "Add, subtract, multiply, and divide standard fractions.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },
  { id: "matrix-calculator", slug: "matrix-calculator", name: "Matrix Calculator", description: "Solve matrix determinant, transpose, inverse and multiplication.", primaryTag: "Calculators", category: "Calculators", iconTag: "Gauge" },

  // Unit Converters
  { id: "length-converter", slug: "length-converter", name: "Length Unit Converter", description: "Convert measurements between meters, feet, inches, and miles.", primaryTag: "Converters", category: "Converters", iconTag: "Scale" },
  { id: "weight-converter", slug: "weight-converter", name: "Weight Unit Converter", description: "Convert weight scales between grams, kilograms, pounds, and ounces.", primaryTag: "Converters", category: "Converters", iconTag: "Scale" },
  { id: "temperature-converter", slug: "temperature-converter", name: "Temperature Converter", description: "Convert values between Celsius, Fahrenheit, and Kelvin scales.", primaryTag: "Converters", category: "Converters", iconTag: "Scale" },
  { id: "area-converter", slug: "area-converter", name: "Area Unit Converter", description: "Convert surfaces sizes between square meters, feet, and acres.", primaryTag: "Converters", category: "Converters", iconTag: "Scale", isConverter: true },
  { id: "volume-converter", slug: "volume-converter", name: "Volume Unit Converter", description: "Convert volumes between liters, gallons, cups, and cubic units.", primaryTag: "Converters", category: "Converters", iconTag: "Scale" },
  { id: "speed-converter", slug: "speed-converter", name: "Speed Unit Converter", description: "Convert velocity between km/h, mph, knots, and m/s.", primaryTag: "Converters", category: "Converters", iconTag: "Scale", isConverter: true },
  { id: "time-converter", slug: "time-converter", name: "Time Unit Converter", description: "Convert times between seconds, hours, days, and years.", primaryTag: "Converters", category: "Converters", iconTag: "Scale" },
  { id: "storage-converter", slug: "storage-converter", name: "Digital Storage Converter", description: "Convert byte arrays between MB, GB, TB, and KB blocks.", primaryTag: "Converters", category: "Converters", iconTag: "Scale", isConverter: true },
  { id: "currency-converter", slug: "currency-converter", name: "Currency Exchange Converter", description: "Estimate cross-rate valuations for global currencies.", primaryTag: "Converters", category: "Converters", iconTag: "Scale", isConverter: true },
  { id: "pressure-converter", slug: "pressure-converter", name: "Pressure Unit Converter", description: "Convert pressures between bar, psi, pascals, and atmospheres.", primaryTag: "Converters", category: "Converters", iconTag: "Scale", isConverter: true },
  { id: "angle-converter", slug: "angle-converter", name: "Angle Unit Converter", description: "Convert degrees to radians, gradians, and standard circles.", primaryTag: "Converters", category: "Converters", iconTag: "Scale", isConverter: true },
  { id: "energy-converter", slug: "energy-converter", name: "Energy Unit Converter", description: "Convert joules to calories, watt-hours, and BTUs.", primaryTag: "Converters", category: "Converters", iconTag: "Scale", isConverter: true },
  { id: "power-converter", slug: "power-converter", name: "Power Unit Converter", description: "Convert horsepower to watts, kilowatts, and BTUs/hr.", primaryTag: "Converters", category: "Converters", iconTag: "Scale", isConverter: true },
  { id: "csv-to-json-converter", slug: "csv-to-json-converter", name: "CSV ⇄ JSON Converter", description: "Convert spreadsheets CSV files to structured JSON outputs.", primaryTag: "Converter", category: "Converters", iconTag: "FileText", isConverter: true },
  { id: "png-to-jpg-converter", slug: "png-to-jpg-converter", name: "PNG → JPG Converter Suite", description: "Convert PNG images to JPEG format client-side in batch.", primaryTag: "Converter", category: "Converters", iconTag: "Maximize2", isConverter: true },

  // Color Tools
  { id: "hex-to-rgb", slug: "hex-to-rgb", name: "Hex to RGB Converter", description: "Convert hexadecimal web colors to RGB coordinates.", primaryTag: "Color", category: "Color", iconTag: "Sliders" },
  { id: "rgb-to-hex", slug: "rgb-to-hex", name: "RGB to Hex Converter", description: "Convert RGB values into standard CSS hexadecimal codes.", primaryTag: "Color", category: "Color", iconTag: "Sliders" },
  { id: "hex-to-hsl", slug: "hex-to-hsl", name: "Hex to HSL Converter", description: "Convert hex color strings to Hue, Saturation, Lightness profiles.", primaryTag: "Color", category: "Color", iconTag: "Sliders" },
  { id: "hsl-to-hex", slug: "hsl-to-hex", name: "HSL to Hex Converter", description: "Convert HSL values into web-ready hexadecimal CSS strings.", primaryTag: "Color", category: "Color", iconTag: "Sliders" },
  { id: "cmyk-to-rgb", slug: "cmyk-to-rgb", name: "CMYK to RGB Converter", description: "Convert print-centric CMYK values to screen RGB vectors.", primaryTag: "Color", category: "Color", iconTag: "Sliders" },
  { id: "rgb-to-cmyk", slug: "rgb-to-cmyk", name: "RGB to CMYK Converter", description: "Convert RGB colors into standard CMYK printing codes.", primaryTag: "Color", category: "Color", iconTag: "Sliders" },
  { id: "contrast-checker", slug: "contrast-checker", name: "WCAG Color Contrast Checker", description: "Check contrast ratios of foreground/background text combinations.", primaryTag: "Color", category: "Color", iconTag: "Sliders" },
  { id: "color-blender", slug: "color-blender", name: "Color Blender", description: "Mix two colors together to generate transition steps.", primaryTag: "Color", category: "Color", iconTag: "Sliders" },
  { id: "shade-generator", slug: "shade-generator", name: "Color Shade Generator", description: "Generate tints and shades corresponding to any base color.", primaryTag: "Color", category: "Color", iconTag: "Sliders" },
  { id: "color-blindness-simulator", slug: "color-blindness-simulator", name: "Color Blindness Simulator", description: "Simulate color blindness profiles (deuteranopia, protanopia).", primaryTag: "Color", category: "Color", iconTag: "Sliders" },

  // SEO Tools
  { id: "robots-txt-generator", slug: "robots-txt-generator", name: "Robots.txt Generator", description: "Generate robots.txt rules for search engines and crawlers.", primaryTag: "SEO", category: "SEO", iconTag: "Globe" },
  { id: "sitemap-xml-generator", slug: "sitemap-xml-generator", name: "Sitemap XML Generator", description: "Build valid sitemap index schemas for your website links.", primaryTag: "SEO", category: "SEO", iconTag: "Globe" },
  { id: "redirect-checker", slug: "redirect-checker", name: "HTTP Redirect Checker", description: "Follow and check redirect status code chains of URLs.", primaryTag: "SEO", category: "SEO", iconTag: "Globe" },
  { id: "header-checker", slug: "header-checker", name: "HTTP Response Header Checker", description: "Inspect response headers and server configuration parameters.", primaryTag: "SEO", category: "SEO", iconTag: "Globe" },
  { id: "ssl-checker", slug: "ssl-checker", name: "SSL Certificate Checker", description: "Verify validity, expiration, and security signatures of SSLs.", primaryTag: "SEO", category: "SEO", iconTag: "Globe" },
  { id: "whois-lookup", slug: "whois-lookup", name: "Domain WHOIS Lookup", description: "Check register and expiry records of domains.", primaryTag: "SEO", category: "SEO", iconTag: "Globe" },
  { id: "schema-generator", slug: "schema-generator", name: "Schema Markup Generator", description: "Generate JSON-LD structured schemas for tools, blogs, or sites.", primaryTag: "SEO", category: "SEO", iconTag: "Globe" },
  { id: "keyword-density", slug: "keyword-density", name: "Keyword Density Analyzer", description: "Scan texts to calculate relative frequencies of keywords.", primaryTag: "SEO", category: "SEO", iconTag: "Globe" },

  // Security Tools
  { id: "password-generator", slug: "password-generator", name: "Password Generator", description: "Generate cryptographically secure random password arrays.", primaryTag: "Security", category: "Security", iconTag: "Lock" },
  { id: "password-strength", slug: "password-strength", name: "Password Strength Evaluator", description: "Check password entropy and calculate cracking timelines.", primaryTag: "Security", category: "Security", iconTag: "Lock" },
  { id: "jwt-parser", slug: "jwt-parser", name: "JWT Claims Parser", description: "Extract headers and verify signature validation profiles.", primaryTag: "Security", category: "Security", iconTag: "Lock" },
  { id: "html-escape", slug: "html-escape", name: "HTML Entity Encoder", description: "Escape HTML characters to secure inputs from XSS.", primaryTag: "Security", category: "Security", iconTag: "Lock" },
  { id: "html-unescape", slug: "html-unescape", name: "HTML Entity Decoder", description: "Decode escaped HTML entities back to raw tags.", primaryTag: "Security", category: "Security", iconTag: "Lock" },
  { id: "hash-sha512", slug: "hash-sha512", name: "SHA-512 Hash Generator", description: "Generate standard 512-bit SHA cryptographic checksums.", primaryTag: "Security", category: "Security", iconTag: "Lock" },
  { id: "bcrypt-generator", slug: "bcrypt-generator", name: "Bcrypt Hash Generator", description: "Generate salted Bcrypt passwords hash keys for security testing.", primaryTag: "Security", category: "Security", iconTag: "Lock" },

  // Finance Tools
  { id: "simple-interest", slug: "simple-interest", name: "Simple Interest Calculator", description: "Calculate simple interest returns based on principal and terms.", primaryTag: "Finance", category: "Finance", iconTag: "Scale" },
  { id: "future-value", slug: "future-value", name: "Future Value Calculator", description: "Evaluate final asset returns with growth rates over time.", primaryTag: "Finance", category: "Finance", iconTag: "Scale" },
  { id: "roi-calculator", slug: "roi-calculator", name: "ROI Investment Calculator", description: "Evaluate net gains and return on investment percentages.", primaryTag: "Finance", category: "Finance", iconTag: "Scale" },
  { id: "cagr-calculator", slug: "cagr-calculator", name: "CAGR Growth Calculator", description: "Find compound annual growth rate values of assets.", primaryTag: "Finance", category: "Finance", iconTag: "Scale" },
  { id: "break-even-calculator", slug: "break-even-calculator", name: "Break-Even Calculator", description: "Find units and sales revenue needed to cover fixed and variable costs.", primaryTag: "Finance", category: "Finance", iconTag: "Scale" },
  { id: "amortization-schedule", slug: "amortization-schedule", name: "Amortization Calculator", description: "Generate monthly compound mortgage and principal schedules.", primaryTag: "Finance", category: "Finance", iconTag: "Scale" },
  { id: "image-compressor", slug: "image-compressor", name: "Image Compressor", description: "Reduce image file sizes without visible quality loss.", primaryTag: "Image", category: "Image", iconTag: "Maximize2" },
  { id: "svg-to-png", slug: "svg-to-png", name: "SVG to PNG", description: "Convert SVG vector illustrations to PNG raster images.", primaryTag: "Converter", category: "Converters", iconTag: "RefreshCw" },
  { id: "gif-to-mp4", slug: "gif-to-mp4", name: "GIF to MP4", description: "Convert animated GIF files to compressed MP4 video.", primaryTag: "Media", category: "Media", iconTag: "Video" },
  { id: "heic-to-jpg", slug: "heic-to-jpg", name: "HEIC to JPG", description: "Convert iPhone HEIC photos to universal JPG format.", primaryTag: "Converter", category: "Converters", iconTag: "RefreshCw" },
  { id: "gst-calculator", slug: "gst-calculator", name: "GST Calculator", description: "Calculate GST tax additions or extractions locally.", primaryTag: "Calculator", category: "Calculators", iconTag: "Gauge" }
];

export const DYNAMIC_TOOLS: RegistryTool[] = DYNAMIC_TOOL_BASES.map(generateDynamicTool);

// Merge: static richly-authored tools + category-aware dynamic stubs + pSEO intent-variant pages
// De-duplicate by slug so no existing tool is overwritten by a variant.
export const TOOL_REGISTRY: RegistryTool[] = (() => {
  const base = [...STATIC_TOOL_REGISTRY, ...DYNAMIC_TOOLS];
  const existingSlugs = new Set(base.map(t => t.slug));
  const variants = ALL_INTENT_VARIANTS.filter(v => !existingSlugs.has(v.slug));
  return [...base, ...variants];
})();

export const FUNCTIONAL_SLUGS = new Set([
  "merge-pdf", "split-pdf", "compress-pdf", "protect-pdf", "unlock-pdf",
  "image-to-pdf", "jpg-to-pdf", "png-to-pdf", "webp-to-pdf", "heic-to-pdf",
  "pdf-to-jpg", "pdf-to-png",
  "qr-generator", "url-shortener", "resume-builder", "webp-converter",
  "json-formatter", "css-gradient-generator", "env-validator", "word-counter",
  "case-converter", "lorem-ipsum-generator", "text-to-binary", "slug-generator",
  "password-generator", "hash-sha256-generator", "diff-checker", "uuid-generator",
  "markdown-preview", "css-minifier", "percentage-calculator", "bmi-calculator",
  "age-calculator", "loan-calculator", "gst-calculator", "base64-encoder-decoder",
  "url-encoder", "regex-tester", "heic-to-jpg", "svg-to-png",
  "calorie-calculator", "compound-interest", "date-calculator", "discount-calculator",
  "fraction-calculator", "gpa-calculator", "tax-calculator", "matrix-calculator",
  "mortgage-calculator", "scientific-calculator", "tip-calculator",
  "meta-tag-generator", "media-workspace", "image-resizer", "background-remover",
  "subtitle-generator", "pdf-ocr", "image-compressor", "gif-to-mp4", "audio-converter", "video-trimmer",
  "organize-pdf", "redact-pdf", "repair-pdf", "rotate-pdf", "sign-pdf", "merge-scanned-pdfs",
  "binary-to-text", "morse-code-encoder", "morse-code-decoder", "character-counter",
  "line-counter", "find-and-replace", "strip-html-tags", "remove-duplicate-lines",
  "text-reverser", "text-sorter", "random-word-generator",
  "angle-converter", "area-converter", "energy-converter", "power-converter",
  "pressure-converter", "speed-converter", "storage-converter", "currency-converter",
  "csv-to-json-converter", "png-to-jpg-converter"
]);

export function getDefaultToolStatus(tool: RegistryTool): Partial<RegistryTool> {
  const checkSlug = tool.parentToolSlug || tool.slug;
  const isLive = FUNCTIONAL_SLUGS.has(checkSlug);
  const featuredSlugs = ["merge-pdf", "qr-generator", "resume-builder", "image-compressor", "pdf-ocr"];
  const popularSlugs = ["merge-pdf", "split-pdf", "image-compressor", "url-shortener", "password-generator"];
  const newSlugs = ["pdf-ocr", "background-remover", "subtitle-generator"];

  const status = isLive ? "Live" : "Planned";
  const completion = isLive ? 100 : 0;
  
  return {
    status,
    priority: isLive ? "Medium" : "Low",
    completion,
    frontend: isLive,
    backend: isLive,
    api: isLive,
    mobile: isLive,
    seo: isLive,
    tested: isLive,
    productionReady: isLive,
    lastUpdated: new Date().toISOString(),
    estimatedCompletion: "",
    developerNotes: isLive ? "Initial release complete. Fully functional." : "Planned implementation.",
    version: isLive ? "1.0.0" : "0.1.0",
    featured: featuredSlugs.includes(tool.slug),
    popular: popularSlugs.includes(tool.slug),
    new: newSlugs.includes(tool.slug),
    route: `/tools/${tool.slug}`,
    icon: tool.iconTag,
    expectedFeatures: [
      { name: "Upload", completed: isLive },
      { name: "Processing", completed: isLive },
      { name: "Download", completed: isLive },
      { name: "Batch Support", completed: isLive }
    ]
  };
}

export function getToolBySlug(slug: string): RegistryTool | undefined {
  return TOOL_REGISTRY.find(t => t.slug === slug);
}

export function getAllTools(): RegistryTool[] {
  return TOOL_REGISTRY;
}
