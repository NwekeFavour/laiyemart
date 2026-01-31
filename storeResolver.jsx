// src/components/TenantResolver.jsx
import { useEffect, useState } from 'react';
import DemoHome from './src/pages/(demo)/home';


// src/storeResolver.jsx (Simplifying it to just return the slug if exists)
// storeResolver.js
// storeResolver.js

export const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  let mainSubdomain = null;

  // 1. Handle Localhost (e.g., mystore.layemart.localhost)
  if (hostname.includes('localhost')) {
    // If we have ["mystore", "layemart", "localhost"], parts.length is 3
    if (parts.length > 2) {
      mainSubdomain = parts[0].toLowerCase();
    } 
    // If we have ["mystore", "localhost"], parts.length is 2
    else if (parts.length === 2 && parts[0] !== 'localhost') {
      mainSubdomain = parts[0].toLowerCase();
    }
  } 
  // 2. Handle Production (e.g., store.layemart.com)
  else if (parts.length >= 3) {
    mainSubdomain = parts[0].toLowerCase();
  }

  // SYSTEM RESERVED WORDS
  // If the subdomain is one of these, it is NOT a tenant store
  const reservedNames = ['www', 'layemart', 'admin', 'api', 'dashboard', 'app'];
  
  if (mainSubdomain && reservedNames.includes(mainSubdomain)) {
    return null; 
  }

  return mainSubdomain;
};

/**
 * Explicit helper to check if the user is visiting the dashboard subdomain
 */
export const isDashboardSubdomain = () => {
  const hostname = window.location.hostname.toLowerCase();
  // Checks for dashboard.layemart.com or dashboard.localhost
  return hostname.startsWith('dashboard.');
};

export default function StoreResolver() {
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const hostname = window.location.hostname; // e.g., "mystore.localhost"
    const parts = hostname.split('.');

    // Check if we are on a subdomain (more than 1 part for localhost, or more than 2 for .com)
    // Localhost: ["mystore", "localhost"] -> length 2
    // Production: ["mystore", "layemart", "com"] -> length 3
    if (parts.length >= 2 && parts[parts.length - 2] !== 'www') {
       if (parts[0] !== 'localhost' && parts[0] !== 'layemart') {
          setSlug(parts[0]);
       }
    }
  }, []);

  // If a slug is detected in the hostname, render the Store Page
  if (slug) {
    return <DemoHome storeSlug={slug} />;
  }

  // Otherwise, return null or a landing page (handled by your main router)
  return null;
}