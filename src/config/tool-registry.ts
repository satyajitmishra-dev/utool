import { RegistryTool } from '@/types/tool-registry';

export const TOOL_REGISTRY: RegistryTool[] = [
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

export function getToolBySlug(slug: string): RegistryTool | undefined {
  return TOOL_REGISTRY.find(t => t.slug === slug);
}

export function getAllTools(): RegistryTool[] {
  return TOOL_REGISTRY;
}
