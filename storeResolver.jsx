import { useEffect, useState } from 'react';
import DemoHome from './src/pages/(demo)/home';

/**
 * Robust helper to extract the subdomain for both Localhost and Production
 */
export const getSubdomain = () => {
  const hostname = window.location.hostname.toLowerCase();
  const parts = hostname.split('.');

  // System reserved names that should NEVER be treated as store subdomains
  const reservedNames = ['www', 'layemart', 'admin', 'api', 'dashboard', 'app', 'localhost'];

  let mainSubdomain = null;

  // 1. Production Logic (e.g., apple.layemart.com -> parts: ["apple", "layemart", "com"])
  if (parts.length >= 3 && !hostname.includes('localhost')) {
    mainSubdomain = parts[0];
  } 
  // 2. Localhost Logic (e.g., apple.localhost -> parts: ["apple", "localhost"])
  else if (hostname.includes('localhost')) {
    if (parts.length >= 2 && parts[0] !== 'localhost') {
      // Check if it's apple.layemart.localhost or just apple.localhost
      mainSubdomain = parts[0];
    }
  }

  return (mainSubdomain && !reservedNames.includes(mainSubdomain)) ? mainSubdomain : null;
};

export const isDashboardSubdomain = () => {
  const hostname = window.location.hostname.toLowerCase();
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

      const reservedPaths = [
        'admin', 'login', 'signup', 'dashboard', 'api', 
        'auth', 'auth-sync', 'verify-store-email', 'pricing', 'about', 'contact'
      ];

      // If we are at the root or a reserved system path, this is NOT a store path
      if (pathSlug && !reservedPaths.includes(pathSlug)) {
        setSlug(pathSlug);
        setResolverType('path');
      } else {
        setSlug(null);
        setResolverType(null);
      }
    }
  }, [window.location.pathname, window.location.hostname]);

  // If no store is detected, return null so App.jsx shows Main Landing/Dashboard
  if (!slug) return null;

  // PASSING DATA: DemoHome (or your Storefront Layout) 
  // now takes the 'slug' which the backend will use to find the Store.
  return (
    <DemoHome
      storeSlug={slug} 
      resolverType={resolverType} 
    />
  );
}