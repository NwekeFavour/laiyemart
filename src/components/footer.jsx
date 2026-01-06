import { Box, Typography } from "@mui/joy";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <Box
      component="footer"
      className="bg-neutral-100 py-12 text-neutral-900"
    >
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
            <Link to="#" className="hover:text-blue-500">
              <Twitter size={20} />
            </Link>
            <Link to="#" className="hover:text-gray-800">
              <Github size={20} />
            </Link>
            <Link to="#" className="hover:text-blue-700">
              <Linkedin size={20} />
            </Link>
          </div>
        </div>

        {/* PRODUCT LINKS */}
        <div className="flex flex-col gap-2">
          <Typography fontWeight="bold" className="mb-2">Product</Typography>
          <Link to="/features" className="text-sm text-gray-600 hover:underline">
            Features
          </Link>
          <Link to="/pricing" className="text-sm text-gray-600 hover:underline">
            Pricing
          </Link>
          <Link to="/templates" className="text-sm text-gray-600 hover:underline">
            Templates
          </Link>
          <Link to="/docs" className="text-sm text-gray-600 hover:underline">
            Documentation
          </Link>
        </div>

        {/* LEGAL LINKS */}
        <div className="flex flex-col gap-2">
          <Typography fontWeight="bold" className="mb-2">Legal</Typography>
          <Link to="/legal/terms" className="text-sm text-gray-600 hover:underline">
            Terms of Service
          </Link>
          <Link to="/legal/privacy" className="text-sm text-gray-600 hover:underline">
            Privacy Policy
          </Link>
          <Link to="/contact" className="text-sm text-gray-600 hover:underline">
            Contact
          </Link>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} LAYEMART. All rights reserved.
      </div>
    </Box>
  );
}
