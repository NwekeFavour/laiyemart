import { Avatar } from "@mui/joy";
import React, { useEffect, useMemo } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useProductStore } from "../../../../services/productService";

const Footer = ({
  storeName,
  storeLogo,
  storeDescription,
  storeEmail,
  storeId,
  storeSlug,
  isStarter,
  storeAddress,
  storeFacebook,
  storeInstagram,
  storeTwitter,
  storeTiktok,
  storeLinkedin,
  storeYoutube,
}) => {
  const { products, fetchStoreProducts } = useProductStore();

  useEffect(() => {
    if (storeId) fetchStoreProducts(storeId);
  }, [storeId, fetchStoreProducts]);

  const categories = useMemo(() => {
    const names = products.map((p) => p.category?.name).filter(Boolean);
    const unique = [...new Set(names)];

    return ["All", ...unique.slice(0, 4)];
  }, [products]);

  const getStorePath = (path) => {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return isStarter && storeSlug ? `/${storeSlug}${clean}` : clean;
  };

  const socialLinks = [
    { icon: <FaFacebookF />, url: storeFacebook },
    { icon: <FaInstagram />, url: storeInstagram },
    { icon: <FaTwitter />, url: storeTwitter },
    { icon: <FaTiktok />, url: storeTiktok },
    { icon: <FaLinkedinIn />, url: storeLinkedin },
    { icon: <FaYoutube />, url: storeYoutube },
  ];

  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <Avatar src={storeLogo} sx={{ width: 50, height: 50, mb: 2 }} />
          <p className="text-gray-400 text-sm italic mb-3">
            {storeDescription ||
              `Elevating your shopping experience at ${storeName}.`}
          </p>

        </div>

        {/* SHOP */}
        <div>
          <h4 className="font-semibold text-white mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  to={getStorePath("/shop")}
                  state={{ selectedCategory: cat === "All" ? "" : cat }}
                  className="hover:text-white capitalize"
                >
                  {cat === "All" ? "All Products" : cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="font-semibold text-white mb-3">Support</h4>

  {/* ADDRESS */}
  {storeAddress && (
    <p className="text-sm text-gray-400 mt-4">
      📍 {storeAddress}
    </p>
  )}

  {/* EMAIL */}
  {storeEmail && (
    <p className="flex items-center gap-2 text-sm text-gray-400 mt-2">
      <FaEnvelope />
      <a
        href={`mailto:${storeEmail}`}
        className="hover:text-white transition"
      >
        {storeEmail}
      </a>
    </p>
  )}

  {/* SOCIALS */}
  <div className="flex gap-3 flex-wrap mt-4">
    {socialLinks
      .filter((s) => s.url)
      .map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noreferrer"
          className="text-gray-400 hover:text-white transition text-lg"
        >
          {s.icon}
        </a>
      ))}
  </div>

        </div>

        {/* PAYMENT */}
        <div>
          <h4 className="font-semibold text-white mb-3">Secure Payment</h4>

          <div className="flex items-center gap-3 flex-wrap">
            <img
              className="h-5 bg-white px-2 py-1 rounded"
              src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg"
              alt="Visa"
            />
            <img
              className="h-5 bg-white px-2 py-1 rounded"
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
            />

            {/* Paystack */}
            <svg
              className="h-5"
              viewBox="0 0 157 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.32 2.663H1.306C.594 2.663 0 3.263 0 3.985v2.37c0 .74.594 1.324 1.307 1.324h21.012..."
                fill="#00C3F7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500 tracking-widest uppercase">
        © {new Date().getFullYear()} {storeName}. Powered by{" "}
        <a
          href="https://layemart.com"
          className="hover:text-white transition"
        >
          Layemart
        </a>
      </div>
    </footer>
  );
};

export default Footer;