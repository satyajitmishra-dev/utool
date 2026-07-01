import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GlobalAdConfig } from "./types";
import { DEFAULT_PLACEMENTS } from "./placements";
import { DEFAULT_ADSENSE_PUB_ID } from "./constants";

export const DEFAULT_GLOBAL_AD_CONFIG: GlobalAdConfig = {
  enabled: true,
  emergencyKillSwitch: false,
  activeProvider: "adsense",
  debugMode: false,
  testAds: true, // Defaults to test ads in local environments
  adsensePubId: DEFAULT_ADSENSE_PUB_ID,
  frequencyCap: 8, // Max 8 ad impressions per session
  sessionMinDelay: 4, // Wait 4 seconds on initial entry before rendering ads
  placements: DEFAULT_PLACEMENTS,
};

/**
 * Fetches the active ad configuration from Firestore database.
 * If Firestore fails or document does not exist, falls back to local defaults.
 */
export async function fetchAdConfig(): Promise<GlobalAdConfig> {
  if (typeof window === "undefined") {
    return DEFAULT_GLOBAL_AD_CONFIG;
  }

  try {
    const docRef = doc(db, "settings", "adConfig");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const dbData = docSnap.data() as Partial<GlobalAdConfig>;
      
      // Merge default placements and settings with DB values to prevent missing properties
      return {
        ...DEFAULT_GLOBAL_AD_CONFIG,
        ...dbData,
        placements: {
          ...DEFAULT_GLOBAL_AD_CONFIG.placements,
          ...(dbData.placements || {}),
        },
      } as GlobalAdConfig;
    }
  } catch (err: any) {
    if (err?.code === "permission-denied" || err?.message?.toLowerCase().includes("permission")) {
      console.warn("[Ad System] Firestore permission denied. Ensure your local firestore.rules are deployed to the cloud. Using local default config.");
    } else {
      console.error("[Ad Config Service] Error fetching config from Firestore:", err);
    }
  }

  return DEFAULT_GLOBAL_AD_CONFIG;
}

/**
 * Saves/updates the ad configuration in Firestore settings collection.
 */
export async function saveAdConfig(config: GlobalAdConfig): Promise<void> {
  try {
    const docRef = doc(db, "settings", "adConfig");
    await setDoc(docRef, config);
    console.log("[Ad Config Service] Configuration saved successfully to Firestore.");
  } catch (err: any) {
    if (err?.code === "permission-denied" || err?.message?.toLowerCase().includes("permission")) {
      const errorMsg = "Permission denied. Please deploy firestore.rules to your Firebase project using: firebase deploy --only firestore:rules";
      console.warn("[Ad System]", errorMsg);
      throw new Error(errorMsg);
    } else {
      console.error("[Ad Config Service] Error saving configuration to Firestore:", err);
      throw err;
    }
  }
}
