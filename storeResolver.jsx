// src/components/TenantResolver.jsx
import { useEffect, useState } from 'react';
import DemoHome from './src/pages/(demo)/home';


// src/storeResolver.jsx (Simplifying it to just return the slug if exists)
export const getSubdomain = () => {
  const hostname = window.location.hostname; // e.g., "mystore.localhost"
  const parts = hostname.split('.');
  if (parts.length >= 2 && parts[0] !== 'localhost') {
    return parts[0].toLowerCase();
  }
  return null;
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