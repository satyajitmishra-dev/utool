import { app } from "@/config/firebase";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";
import { useState, useEffect } from "react";

// Default configs (INR base values)
const DEFAULTS = {
  toolzy_pro_price: 299,
  toolzy_pro_original_price: 599,
  toolzy_pro_discount_enabled: true,
  toolzy_pro_discount_percentage: 50,
  toolzy_enterprise_price: 1499,
  toolzy_enterprise_original_price: 2999,
  toolzy_enterprise_discount_enabled: true,
  toolzy_enterprise_discount_percentage: 50,
  toolzy_discount_end_date: "2026-07-01T23:59:59Z",
};

let initPromise: Promise<boolean> | null = null;

export function initializeRemoteConfig(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      const rc = getRemoteConfig(app);
      rc.settings.minimumFetchIntervalMillis = 3600000; // 1 hour fetch caching
      rc.defaultConfig = DEFAULTS;
      await fetchAndActivate(rc);
      return true;
    } catch (e) {
      console.warn("Failed to fetch/activate Remote Config, utilizing client defaults:", e);
      return false;
    }
  })();
  
  return initPromise;
}

export function getPricingConfig() {
  if (typeof window === "undefined") {
    return {
      proPrice: DEFAULTS.toolzy_pro_price,
      proOriginalPrice: DEFAULTS.toolzy_pro_original_price,
      proDiscountEnabled: DEFAULTS.toolzy_pro_discount_enabled,
      proDiscountPercentage: DEFAULTS.toolzy_pro_discount_percentage,
      enterprisePrice: DEFAULTS.toolzy_enterprise_price,
      enterpriseOriginalPrice: DEFAULTS.toolzy_enterprise_original_price,
      enterpriseDiscountEnabled: DEFAULTS.toolzy_enterprise_discount_enabled,
      enterpriseDiscountPercentage: DEFAULTS.toolzy_enterprise_discount_percentage,
    };
  }
  
  try {
    const rc = getRemoteConfig(app);
    return {
      proPrice: Number(getValue(rc, "toolzy_pro_price").asString() || DEFAULTS.toolzy_pro_price),
      proOriginalPrice: Number(getValue(rc, "toolzy_pro_original_price").asString() || DEFAULTS.toolzy_pro_original_price),
      proDiscountEnabled: getValue(rc, "toolzy_pro_discount_enabled").asBoolean() ?? DEFAULTS.toolzy_pro_discount_enabled,
      proDiscountPercentage: Number(getValue(rc, "toolzy_pro_discount_percentage").asString() || DEFAULTS.toolzy_pro_discount_percentage),
      enterprisePrice: Number(getValue(rc, "toolzy_enterprise_price").asString() || DEFAULTS.toolzy_enterprise_price),
      enterpriseOriginalPrice: Number(getValue(rc, "toolzy_enterprise_original_price").asString() || DEFAULTS.toolzy_enterprise_original_price),
      enterpriseDiscountEnabled: getValue(rc, "toolzy_enterprise_discount_enabled").asBoolean() ?? DEFAULTS.toolzy_enterprise_discount_enabled,
      enterpriseDiscountPercentage: Number(getValue(rc, "toolzy_enterprise_discount_percentage").asString() || DEFAULTS.toolzy_enterprise_discount_percentage),
    };
  } catch (error) {
    return {
      proPrice: DEFAULTS.toolzy_pro_price,
      proOriginalPrice: DEFAULTS.toolzy_pro_original_price,
      proDiscountEnabled: DEFAULTS.toolzy_pro_discount_enabled,
      proDiscountPercentage: DEFAULTS.toolzy_pro_discount_percentage,
      enterprisePrice: DEFAULTS.toolzy_enterprise_price,
      enterpriseOriginalPrice: DEFAULTS.toolzy_enterprise_original_price,
      enterpriseDiscountEnabled: DEFAULTS.toolzy_enterprise_discount_enabled,
      enterpriseDiscountPercentage: DEFAULTS.toolzy_enterprise_discount_percentage,
    };
  }
}

export function getDiscountConfig() {
  if (typeof window === "undefined") {
    return {
      endDate: DEFAULTS.toolzy_discount_end_date,
      isExpired: false,
    };
  }
  
  try {
    const rc = getRemoteConfig(app);
    const endDate = getValue(rc, "toolzy_discount_end_date").asString() || DEFAULTS.toolzy_discount_end_date;
    const isExpired = endDate ? new Date(endDate).getTime() < Date.now() : false;
    return { endDate, isExpired };
  } catch (error) {
    return {
      endDate: DEFAULTS.toolzy_discount_end_date,
      isExpired: false,
    };
  }
}

function formatTimeRemaining(endTimeStr: string): { text: string; isExpired: boolean } {
  if (!endTimeStr) return { text: "", isExpired: true };
  const end = new Date(endTimeStr).getTime();
  const now = Date.now();
  const diff = end - now;
  if (diff <= 0) {
    return { text: "Expired", isExpired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  let text = "";
  if (days > 0) text += `${days}d `;
  if (hours > 0 || days > 0) text += `${hours}h `;
  text += `${mins}m ${secs}s`;
  return { text, isExpired: false };
}

export function useRemoteConfig() {
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState(getPricingConfig());
  const [discount, setDiscount] = useState(getDiscountConfig());
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    let active = true;
    
    const setup = async () => {
      await initializeRemoteConfig();
      if (!active) return;
      setPricing(getPricingConfig());
      setDiscount(getDiscountConfig());
      setLoading(false);
    };

    setup();

    return () => {
      active = false;
    };
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (loading || !discount.endDate) return;

    const tick = () => {
      const { text, isExpired } = formatTimeRemaining(discount.endDate);
      setTimeRemaining(text);
      if (isExpired) {
        setDiscount((prev) => ({ ...prev, isExpired: true }));
      }
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [loading, discount.endDate]);

  const proDiscountActive = pricing.proDiscountEnabled && !discount.isExpired;
  const enterpriseDiscountActive = pricing.enterpriseDiscountEnabled && !discount.isExpired;

  return {
    loading,
    pricing,
    discount,
    timeRemaining,
    proDiscountActive,
    enterpriseDiscountActive,
    pricingConfig: {
      pro: {
        price: proDiscountActive ? pricing.proPrice : pricing.proOriginalPrice,
        originalPrice: pricing.proOriginalPrice,
        discountEnabled: proDiscountActive,
        discountPercentage: pricing.proDiscountPercentage,
      },
      enterprise: {
        price: enterpriseDiscountActive ? pricing.enterprisePrice : pricing.enterpriseOriginalPrice,
        originalPrice: pricing.enterpriseOriginalPrice,
        discountEnabled: enterpriseDiscountActive,
        discountPercentage: pricing.enterpriseDiscountPercentage,
      },
    },
  };
}
