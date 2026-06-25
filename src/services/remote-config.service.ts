import { app } from "@/config/firebase";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";
import { useState, useEffect } from "react";

// Default configs (INR base values)
const DEFAULTS = {
  toolzy_monthly_price: 29,
  toolzy_monthly_original_price: 599,
  toolzy_monthly_discount: 90,
  toolzy_lifetime_price: 299,
  toolzy_lifetime_original_price: 1999,
  toolzy_lifetime_discount: 85,
  toolzy_lifetime_recommended: true,
  toolzy_offer_label: "Launch Offer",
  // Backward compatibility defaults
  toolzy_pro_price: 29,
  toolzy_pro_original_price: 599,
  toolzy_pro_discount_enabled: true,
  toolzy_pro_discount_percentage: 90,
  toolzy_enterprise_price: 299,
  toolzy_enterprise_original_price: 1999,
  toolzy_enterprise_discount_enabled: true,
  toolzy_enterprise_discount_percentage: 85,
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
      monthlyPrice: DEFAULTS.toolzy_monthly_price,
      monthlyOriginalPrice: DEFAULTS.toolzy_monthly_original_price,
      monthlyDiscount: DEFAULTS.toolzy_monthly_discount,
      lifetimePrice: DEFAULTS.toolzy_lifetime_price,
      lifetimeOriginalPrice: DEFAULTS.toolzy_lifetime_original_price,
      lifetimeDiscount: DEFAULTS.toolzy_lifetime_discount,
      lifetimeRecommended: DEFAULTS.toolzy_lifetime_recommended,
      offerLabel: DEFAULTS.toolzy_offer_label,
      // Compatibility fields
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
    const monthlyPrice = Number(getValue(rc, "toolzy_monthly_price").asString() || DEFAULTS.toolzy_monthly_price);
    const monthlyOriginalPrice = Number(getValue(rc, "toolzy_monthly_original_price").asString() || DEFAULTS.toolzy_monthly_original_price);
    const monthlyDiscount = Number(getValue(rc, "toolzy_monthly_discount").asString() || DEFAULTS.toolzy_monthly_discount);
    const lifetimePrice = Number(getValue(rc, "toolzy_lifetime_price").asString() || DEFAULTS.toolzy_lifetime_price);
    const lifetimeOriginalPrice = Number(getValue(rc, "toolzy_lifetime_original_price").asString() || DEFAULTS.toolzy_lifetime_original_price);
    const lifetimeDiscount = Number(getValue(rc, "toolzy_lifetime_discount").asString() || DEFAULTS.toolzy_lifetime_discount);
    const lifetimeRecommended = getValue(rc, "toolzy_lifetime_recommended").asBoolean() ?? DEFAULTS.toolzy_lifetime_recommended;
    const offerLabel = getValue(rc, "toolzy_offer_label").asString() || DEFAULTS.toolzy_offer_label;

    return {
      monthlyPrice,
      monthlyOriginalPrice,
      monthlyDiscount,
      lifetimePrice,
      lifetimeOriginalPrice,
      lifetimeDiscount,
      lifetimeRecommended,
      offerLabel,
      // Compatibility fields
      proPrice: monthlyPrice,
      proOriginalPrice: monthlyOriginalPrice,
      proDiscountEnabled: true,
      proDiscountPercentage: monthlyDiscount,
      enterprisePrice: lifetimePrice,
      enterpriseOriginalPrice: lifetimeOriginalPrice,
      enterpriseDiscountEnabled: true,
      enterpriseDiscountPercentage: lifetimeDiscount,
    };
  } catch (error) {
    return {
      monthlyPrice: DEFAULTS.toolzy_monthly_price,
      monthlyOriginalPrice: DEFAULTS.toolzy_monthly_original_price,
      monthlyDiscount: DEFAULTS.toolzy_monthly_discount,
      lifetimePrice: DEFAULTS.toolzy_lifetime_price,
      lifetimeOriginalPrice: DEFAULTS.toolzy_lifetime_original_price,
      lifetimeDiscount: DEFAULTS.toolzy_lifetime_discount,
      lifetimeRecommended: DEFAULTS.toolzy_lifetime_recommended,
      offerLabel: DEFAULTS.toolzy_offer_label,
      // Compatibility fields
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
  const [pricing, setPricing] = useState({
    monthlyPrice: DEFAULTS.toolzy_monthly_price,
    monthlyOriginalPrice: DEFAULTS.toolzy_monthly_original_price,
    monthlyDiscount: DEFAULTS.toolzy_monthly_discount,
    lifetimePrice: DEFAULTS.toolzy_lifetime_price,
    lifetimeOriginalPrice: DEFAULTS.toolzy_lifetime_original_price,
    lifetimeDiscount: DEFAULTS.toolzy_lifetime_discount,
    lifetimeRecommended: DEFAULTS.toolzy_lifetime_recommended,
    offerLabel: DEFAULTS.toolzy_offer_label,
    // Compatibility fields
    proPrice: DEFAULTS.toolzy_pro_price,
    proOriginalPrice: DEFAULTS.toolzy_pro_original_price,
    proDiscountEnabled: DEFAULTS.toolzy_pro_discount_enabled,
    proDiscountPercentage: DEFAULTS.toolzy_pro_discount_percentage,
    enterprisePrice: DEFAULTS.toolzy_enterprise_price,
    enterpriseOriginalPrice: DEFAULTS.toolzy_enterprise_original_price,
    enterpriseDiscountEnabled: DEFAULTS.toolzy_enterprise_discount_enabled,
    enterpriseDiscountPercentage: DEFAULTS.toolzy_enterprise_discount_percentage,
  });
  const [discount, setDiscount] = useState({
    endDate: DEFAULTS.toolzy_discount_end_date,
    isExpired: false,
  });
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    let active = true;

    // Update state to client-side remote config state immediately after hydration completes
    setPricing(getPricingConfig());
    setDiscount(getDiscountConfig());

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

  const proDiscountActive = !discount.isExpired;
  const enterpriseDiscountActive = !discount.isExpired;

  return {
    loading,
    pricing,
    discount,
    timeRemaining,
    proDiscountActive,
    enterpriseDiscountActive,
    pricingConfig: {
      monthly: {
        price: pricing.monthlyPrice,
        originalPrice: pricing.monthlyOriginalPrice,
        discount: pricing.monthlyDiscount,
      },
      lifetime: {
        price: pricing.lifetimePrice,
        originalPrice: pricing.lifetimeOriginalPrice,
        discount: pricing.lifetimeDiscount,
        recommended: pricing.lifetimeRecommended,
      },
      offerLabel: pricing.offerLabel,
      // Compatibility fields
      pro: {
        price: pricing.monthlyPrice,
        originalPrice: pricing.monthlyOriginalPrice,
        discountEnabled: true,
        discountPercentage: pricing.monthlyDiscount,
      },
      enterprise: {
        price: pricing.lifetimePrice,
        originalPrice: pricing.lifetimeOriginalPrice,
        discountEnabled: true,
        discountPercentage: pricing.lifetimeDiscount,
      },
    },
  };
}
