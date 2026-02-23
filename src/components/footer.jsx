import { Box, Typography } from "@mui/joy";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Facebook, Instagram, X } from "@mui/icons-material";
import Layemart from '../assets/img/layemart-icon.jpg'

export default function Footer() {
  const { isAuthenticated, user } = useAuthStore();

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Box component="footer" className="bg-neutral-100 md:py-6! py-4! text-[#0F172A]!">
      <div className="container mx-auto px-4 grid! grid-cols-1! md:grid-cols-3! gap-10!">
        {/* BRAND */}
        <div className="flex flex-col gap-3">
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <img 
            src={Layemart} 
            alt="Layemart Logo" 
            className="sm:h-30 h-[100px] w-[130px] sm:w-[170px] object-contain" // Height adjusted for the pill shape
            style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" }}
          />
        </Box>
          <Typography className="text-sm text-gray-600">
            Scale without the stress. We handle the tech; you handle the trade.
          </Typography>
          <div className="flex items-center gap-3 mt-2">
            <Link to="https://x.com/layemart" className="text-slate-800">
              <X size={12} className="text-[20px] text-[#4F46E5]! t sm:text-[17px]!" />
            </Link>
              <Link to="https://www.instagram.com/layemart/" className="text-slate-800">
              <Instagram className=" text-[20px] text-[#4F46E5]! sm:text-[17px]!" />
            </Link>
            <Link to="https://www.facebook.com/layemartcommerce" className="text-slate-800">
              <Facebook className=" text-[20px] text-[#4F46E5]! sm:text-[17px]!" />
            </Link>
          </div>
        </div>

        {/* PRODUCT LINKS */}
        <div className="flex flex-col gap-2">
          <Typography fontWeight="bold" className="mb-2">
            Company
          </Typography>
          <Link
            onClick={() => handleScroll("product")}
            className="text-sm text-gray-600 hover:underline"
          >
            Products
          </Link>
          <Link onClick={() => handleScroll("pricing")} className="text-sm text-gray-600 hover:underline">
            Pricing
          </Link>
          <Link
            onClick={() => handleScroll("about-us")}
            className="text-sm text-gray-600 hover:underline"
          >
            About Us
          </Link>
          <Link to="/contact" className="text-sm text-gray-600 hover:underline">
            Contact
          </Link>
        </div>

        {/* LEGAL LINKS */}
        <div className="flex flex-col gap-2">
          <Typography fontWeight="bold" className="mb-2">
            Legal
          </Typography>
          <Link
            to="#"
            className="text-sm text-gray-600 hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            to="#"
            className="text-sm text-gray-600 hover:underline"
          >
            Privacy Policy
          </Link>
          {!isAuthenticated && (<Link
              to="/auth/sign-up"
              className="text-sm text-gray-600 hover:underline"
            >
              Sign Up
            </Link>) } 
            {!isAuthenticated && (<Link
              to="/auth/sign-in"
              className="text-sm text-gray-600 hover:underline"
            >
              Login
            </Link>) }    
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-3 border-t pb-2! border-gray-200 pt-2! text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} LAYEMART. All rights reserved.
      </div>
    </Box>
  );
}
