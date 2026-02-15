import { Box, Typography } from "@mui/joy";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Facebook, Instagram, X } from "@mui/icons-material";

export default function Footer() {
  const { isAuthenticated, user } = useAuthStore();

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Box component="footer" className="bg-neutral-100 py-12 text-[#0F172A]!">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* BRAND */}
        <div className="flex flex-col gap-3">
          <Typography level="h6" fontWeight="bold" className="text-black">
            LAYEMART
          </Typography>
          <Typography className="text-sm text-gray-600">
            Empowering your business with intuitive tools to grow faster.
          </Typography>
          <div className="flex items-center gap-3 mt-2">
            <Link to="https://x.com/layemart" className="hover:text-blue-500">
              <X size={20} />
            </Link>
            <Link to="https://www.instagram.com/layemart/" className="hover:text-blue-700">
              <Instagram size={20} />
            </Link>
            <Link to="https://www.facebook.com/layemartcommerce" className="hover:text-blue-700">
              <Facebook size={20} />
            </Link>
          </div>
        </div>

        {/* PRODUCT LINKS */}
        <div className="flex flex-col gap-2">
          <Typography fontWeight="bold" className="mb-2">
            Product
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
        </div>

        {/* LEGAL LINKS */}
        <div className="flex flex-col gap-2">
          <Typography fontWeight="bold" className="mb-2">
            Legal
          </Typography>
          <Link
            to="/legal/terms"
            className="text-sm text-gray-600 hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            to="/legal/privacy"
            className="text-sm text-gray-600 hover:underline"
          >
            Privacy Policy
          </Link>
          <Link to="/contact" className="text-sm text-gray-600 hover:underline">
            Contact
          </Link>
            {!isAuthenticated && (<Link
              to="/auth/sign-in"
              className="text-sm text-gray-600 hover:underline"
            >
              Login
            </Link>) }    
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} LAYEMART. All rights reserved.
      </div>
    </Box>
  );
}
