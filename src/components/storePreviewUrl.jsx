"use client";

import { Link, Store } from "@mui/icons-material";
import { Button } from "@mui/material";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { FaGlobe } from "react-icons/fa";

export function StoreUrlPreview({
  storeNameInput,
  customDomainInput,
  setStoreNameInput,
  setCustomDomainInput,
  normalizeStoreName,
  hadInvalid,
  setHadInvalid,
  urls,
  isReady,
}) {
  return (
    <div className="rounded-3xl! md:border border-neutral-200 bg-white md:p-7 p-2 md:shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-[30px!  font-bold! text-neutral-900">
          Preview your store URL
        </h3>
        <p className="mt-2 text-neutral-600">
          Choose a name and see how customers will access your store.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid! gap-4! lg:grid-cols-2!">
        {/* Store name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-700">
            Store name
          </label>

          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4F46E5]!" size={18} />

            <input
              value={storeNameInput}
              onChange={(e) => {
                const typed = e.target.value;
                const cleaned = normalizeStoreName(typed);
                setHadInvalid(cleaned !== typed.toLowerCase());
                setStoreNameInput(cleaned);
              }}
              className="h-12 w-full lowercase! rounded-xl border border-neutral-300 pl-10 pr-3 text-neutral-900 focus:border-neutral-900 outline-none"
              placeholder="mystore"
            />
          </div>

          <p className="text-xs text-neutral-500">
            Letters, numbers and hyphen only
          </p>

          {hadInvalid && (
            <p className="text-xs text-amber-600">
              Invalid characters were removed
            </p>
          )}
        </div>

        {/* Custom domain */}
        <div className="flex! flex-col! gap-2">
          <label className="text-sm font-semibold text-neutral-700">
            Custom domain
          </label>

          <div className="relative">
            <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2  text-[#4F46E5]!" size={18} />

            <input
              value={customDomainInput}
              onChange={(e) => setCustomDomainInput(e.target.value)}
              className="h-12 w-full lowercase! rounded-xl border border-neutral-300 pl-10 pr-3 text-neutral-900 focus:border-neutral-900 outline-none"
              placeholder="www.yourbrand.com"
            />
          </div>
        </div>
      </div>

      {/* URL Results */}
      <div className="md:mt-4! mt-2! space-y-3">
        <UrlCard icon={<Link className="text-[#4F46E5]!" size={18} />} label="Path URL" className="text-[#4F46E5]!" value={urls.pathUrl} />
        <UrlCard icon={<Store className="text-[#4F46E5]!" size={18} />} label="Subdomain" value={urls.subdomainUrl} />
        <UrlCard icon={<FaGlobe className="text-[#4F46E5]!" size={18} />} label="Custom domain" value={urls.customUrl} />
      </div>

      {/* CTA */}
      <div className="md:mt-4 mt-2 flex flex-wrap items-center gap-4">
        <Button
            className="bg-[#4F46E5]! text-white! rounded-[100px]! px-4! py-2! capitalize!"
          href="#final-cta"
          size="lg"
          trackLabel="Start Your Free Store"
          trackLocation="store-url-preview"
        >
          Start Your Free Store
        </Button>

        <div className="flex items-center gap-2 text-sm text-neutral-600">
          {isReady && <CheckCircle2 size={16} className="text-[#4F46E5]!" />}
          <span className="text-[#4F46E5]!">
            {isReady
              ? "Your store name looks great."
              : "Use at least 3 characters."}
          </span>
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

    setTimeout(() => setCopied(false), 2000); // revert after 2s
  };
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-neutral-500">{icon}</div>
        <div>
          <p className="text-xs text-neutral-500">{label}</p>
          <p className="text-sm font-semibold lowercase! text-neutral-900 break-all">
            {value}
          </p>
        </div>
      </div>

            <button
        onClick={handleCopy}
        className={`text-xs font-semibold transition ${
          copied
            ? "text-[#4F46E5]!"
            : "text-neutral-600 hover:text-neutral-900"
        }`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}