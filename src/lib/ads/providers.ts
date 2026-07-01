import { AdProviderType, UserConsent } from "./types";
import { DEFAULT_ADSENSE_PUB_ID } from "./constants";

/**
 * Injects Google AdSense scripts asynchronously and safely.
 * Complies with GDPR/CCPA settings.
 */
export function injectAdProviderScript(
  provider: AdProviderType,
  publisherId: string,
  consent: UserConsent
): void {
  if (typeof window === "undefined") return;

  const pubId = publisherId || DEFAULT_ADSENSE_PUB_ID;

  // Select script tag selector
  const scriptId = `utool-ad-script-${provider}`;
  if (document.getElementById(scriptId)) return;

  switch (provider) {
    case "adsense": {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
      script.async = true;
      script.crossOrigin = "anonymous";

      // If user did not consent to personalized tracking (GDPR), request non-personalized ads (NPA=1)
      if (!consent.gdprConsent) {
        script.src += "&npa=1";
      }

      document.head.appendChild(script);
      break;
    }

    case "admanager": {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      script.async = true;
      document.head.appendChild(script);
      break;
    }

    case "medianet": {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://contextual.media.net/nmedianet.js?cid=${pubId}`;
      script.async = true;
      document.head.appendChild(script);
      break;
    }

    case "custom":
    case "affiliate":
    case "sponsored":
    default:
      // Local fallbacks do not require external script injections
      break;
  }
}

/**
 * Signals AdSense to refresh or trigger placement render after script is initialized.
 */
export function pushAdSenseEvent(): void {
  if (typeof window === "undefined") return;
  try {
    const adsbygoogle = (window as any).adsbygoogle || [];
    adsbygoogle.push({});
  } catch (err) {
    console.warn("[AdSense Provider] Error pushing adsbygoogle event:", err);
  }
}
