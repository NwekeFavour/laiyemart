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
  const [resolverType, setResolverType] = useState(null);

  useEffect(() => {
    const sub = getSubdomain();
    
    if (sub) {
      setSlug(sub);
      setResolverType('subdomain');
    } else {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const pathSlug = pathParts[0]?.toLowerCase();

      // IMPORTANT: Add all main site routes here to prevent the resolver 
      // from trying to treat "layemart.com/pricing" as a store named "pricing"
      const reservedPaths = [
        'admin', 'login', 'signup', 'dashboard', 'api', 
        'auth', 'verify-store-email', 'pricing', 'about', 'contact'
      ];

      if (pathSlug && !reservedPaths.includes(pathSlug)) {
        setSlug(pathSlug);
        setResolverType('path');
      } else {
        // Explicitly reset if it's a reserved path or root
        setSlug(null);
        setResolverType(null);
      }
    }
  }, [window.location.pathname, window.location.hostname]); // Sync on URL changes

  console.log("Resolved Store Slug:", slug, "via", resolverType);
  if (slug) {
    return <DemoHome storeSlug={slug} resolverType={resolverType} />;
  }

  return null;
}