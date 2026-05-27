import { getSubdomain } from "../storeResolver";
import { useAuthStore } from "../src/store/useAuthStore";
import { useCustomerAuthStore } from "../src/store/useCustomerAuthStore";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const parseResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Delivery request failed");
  return data;
};

const customerHeaders = (storeSlug) => ({
  "Content-Type": "application/json",
  "x-store-slug": getSubdomain() || storeSlug,
  // Token is optional for calculate endpoint
  ...(useCustomerAuthStore.getState().token && {
    Authorization: `Bearer ${useCustomerAuthStore.getState().token}`,
  }),
});

const getStoreSlug = (fallback) => {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  return fallback || getSubdomain() || pathParts[0];
};

// ─── Headers ──────────────────────────────────────────────────────────────────

const ownerHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${useAuthStore.getState().token}`,
});


export const saveDeliveryProfile = async (profile) => {
  const supportedMethods = [];
  if (profile.deliveryEnabled) supportedMethods.push("local_delivery");
  if (profile.pickupEnabled) supportedMethods.push("pickup");
  if (profile.nationwideEnabled) supportedMethods.push("nationwide_courier");

  const payload = {
    deliveryEnabled: profile.deliveryEnabled,
    pickupEnabled: profile.pickupEnabled,
    freeDeliveryThreshold: profile.freeDeliveryThreshold
      ? Number(profile.freeDeliveryThreshold)
      : null,
    deliveryNotes: profile.deliveryNotes || "",
    supportedMethods,
  };

  const response = await fetch(`${API_URL}/api/delivery/profile`, {
    method: "POST",
    headers: ownerHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

// ─── ZONES (Store Owner) ──────────────────────────────────────────────────────

export const listDeliveryZones = async () => {
  const response = await fetch(`${API_URL}/api/delivery/zones`, {
    headers: ownerHeaders(),
  });
  return parseResponse(response);
};

export const createDeliveryZone = async (zone) => {
  const payload = {
    zoneName: zone.name?.trim(),
    states: zone.state ? [zone.state.trim()] : [],
    cities: zone.city ? [zone.city.trim()] : [],
    fee: Number(zone.fee),
    method: zone.method,
    estimatedDeliveryTime: zone.estimatedTime?.trim() || "",
  };

  const response = await fetch(`${API_URL}/api/delivery/zones`, {
    method: "POST",
    headers: ownerHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const updateDeliveryZone = async (id, zone) => {
  const payload = {
    zoneName: zone.name?.trim(),
    states: zone.state ? [zone.state.trim()] : [],
    cities: zone.city ? [zone.city.trim()] : [],
    fee: Number(zone.fee),
    method: zone.method,
    estimatedDeliveryTime: zone.estimatedTime?.trim() || "",
  };

  const response = await fetch(`${API_URL}/api/delivery/zones/${id}`, {
    method: "PUT",
    headers: ownerHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const deleteDeliveryZone = async (id) => {
  const response = await fetch(`${API_URL}/api/delivery/zones/${id}`, {
    method: "DELETE",
    headers: ownerHeaders(),
  });
  return parseResponse(response);
};

// ─── CALCULATE DELIVERY OPTIONS (Customer / Storefront) ───────────────────────

export const calculateDeliveryOptions = async ({
  storeSlug,
  storeId,
  state,
  city,
  cartTotal = 0,
}) => {
  const response = await fetch(`${API_URL}/api/delivery/calculate`, {
    method: "POST",
    headers: customerHeaders(storeSlug),
    body: JSON.stringify({ storeId, state, city, cartTotal }),
  });

  return parseResponse(response);
};

export const getDeliveryProfile = async () => {
  // This should only be used in Store Owner Settings
  const token = useAuthStore.getState().token; // Make sure you import useAuthStore
  const response = await fetch(`${API_URL}/api/delivery/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return parseResponse(response);
};