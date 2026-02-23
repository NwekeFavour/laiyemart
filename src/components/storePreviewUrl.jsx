"use client";

import { useState, useMemo } from "react";
import { Link, Store } from "@mui/icons-material";
import { Button } from "@mui/material";
import { CheckCircle2 } from "lucide-react";
import { FaGlobe } from "react-icons/fa";

export function StoreUrlPreview({
  storeNameInput,
  customDomainInput,
  setStoreNameInput,
  setCustomDomainInput,
  normalizeStoreName,
  hadInvalid,
  setHadInvalid,
  isReady,
}) {
  // Build URLs
  const urls = useMemo(() => {
    const base = "layemart.com";
    const store = storeNameInput?.trim().toLowerCase() || "";

    // If input is empty, fallback to default
    const effectiveCustom = customDomainInput?.trim() || "www.mystore.com";

    return {
      pathUrl: store ? `${base}/${store}` : base,
      subdomainUrl: store ? `${store}.${base}` : base,
      customUrl: effectiveCustom,
    };
  }, [storeNameInput, customDomainInput]);

  return (
    <div>
      <h3 className="text-2xl font-bold! text-center! md:text-[46px]! font-bold text-neutral-900 capitalize!">
        Preview your store URL
      </h3>
      <div className="rounded-3xl md:border border-neutral-200 bg-white md:p-7 p-4 md:shadow-sm">
        {/* Header */}
        <div className="mb-3">
          <p className="mt-2 text-neutral-600">
            Choose a name and see how customers will access your store.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid! gap-4 lg:grid-cols-2!">
          {/* Store name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">
              Store name
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4F46E5]" />
              <input
                value={storeNameInput}
                onChange={(e) => {
                  const typed = e.target.value;
                  const cleaned = normalizeStoreName(typed);
                  setHadInvalid(cleaned !== typed.toLowerCase());
                  setStoreNameInput(cleaned);
                }}
                className="h-12 w-full lowercase rounded-xl border border-neutral-300 pl-10 pr-3 text-neutral-900 focus:border-neutral-900 outline-none"
                placeholder="mystore"
              />
            </div>
            <p className="text-xs my-0! text-neutral-500">
              Letters, numbers and hyphen only
            </p>
            {hadInvalid && (
              <p className="text-xs text-amber-600">
                Invalid characters were removed
              </p>
            )}
          </div>

          {/* Custom domain */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">
              Custom domain
            </label>
            <div className="relative">
              <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4F46E5]" />
              <input
                value={customDomainInput || ""}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                className="h-12 w-full lowercase rounded-xl border border-neutral-300 pl-10 pr-3 text-neutral-900 focus:border-neutral-900 outline-none"
                placeholder="www.mystore.com"
              />
            </div>
          </div>
        </div>

        {/* URL Results */}
        <div className="mt-4 space-y-3">
          <UrlCard
            icon={<Link className="text-[#4F46E5]" />}
            label="Path URL"
            value={urls.pathUrl}
          />
          <UrlCard
            icon={<Store className="text-[#4F46E5]" />}
            label="Subdomain"
            value={urls.subdomainUrl}
          />
          <UrlCard
            icon={<FaGlobe className="text-[#4F46E5] w-[20px]!" />}
            label="Custom domain"
            value={urls.customUrl}
          />
        </div>

        {/* CTA */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            {isReady && <CheckCircle2 size={16} className="text-[#4F46E5]" />}
            <span className="text-[#4F46E5]">
              {isReady && "Your store name looks great."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UrlCard({ icon, label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-2 sm:px-4 py-0">
      <div className="flex items-center gap-3 py-4!">
        <div className="text-neutral-500">{icon}</div>
        <div>
          <p className="text-xs mb-1! text-neutral-500">{label}</p>
          <p className="text-sm my-0! font-semibold lowercase text-neutral-900 break-all">
            {value}
          </p>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className={`text-xs! font-semibold transition ${copied ? "text-[#4F46E5]" : "text-neutral-600 hover:text-neutral-900"}`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
