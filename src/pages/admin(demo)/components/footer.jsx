import { Avatar } from "@mui/joy";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest } from "react-icons/fa";

const Footer = ({storeName, storeLogo, storeDescription}) => {

  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <Avatar
              src={storeLogo}
              sx={{
                width:  45,
                height:  45,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
          <p className="text-gray-400 text-sm mt-4">
            {storeDescription}
          </p>

          {/* Social Icons */}
          <div className="flex mt-4 space-x-3">
            <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition"><FaPinterest /></a>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white transition">Best Sellers</a></li>
            <li><a href="#" className="hover:text-white transition">Clothing</a></li>
            <li><a href="#" className="hover:text-white transition">Accessories</a></li>
          </ul>
        </div>

        {/* About Links */}
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-3">
            Sign up to get 10% off your first order
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-500 rounded-md text-white hover:bg-neutral-600 transition"
            >
              Subscribe
            </button>
          </form>

          {/* Payment Badges */}
            <div className="flex mt-4 space-x-3">
            {/* Visa */}
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
                className="h-6"
            />
            {/* MasterCard */}
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="MasterCard"
                className="h-6"
            />
            {/* PayPal */}
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-6"
            />
            </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} {storeName} Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;