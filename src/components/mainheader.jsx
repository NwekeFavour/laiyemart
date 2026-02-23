import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import LogoLight13 from "../assets/img/logo-13-light.svg";
import LogoDark13 from "../assets/img/logo-13-dark.svg";
import Layemart from "../assets/img/layemart-icon.jpg"

const navItems = [
  { label: "How It works", href: "#about-us" },
  { label: "Features", href: "#main-features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

function PageHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="fixed top-0 z-[999] w-full transition-all duration-300 bg-white/30 backdrop-blur-md border-b border-transparent">
      <nav className="relative z-10 w-full md:px-4 lg:py-0">
        <div className="container mx-auto">
          <div className="flex items-center justify-between min-h-[64px] lg:min-h-[96px] text-slate-900 dark:text-white">
            
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <a href="/" className="block w-[140px]">
                <img className=" w-full h-auto" src={Layemart} alt="Lexend" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-grow justify-center">
              <ul className="flex items-center gap-6 xl:gap-10 font-medium mb-0">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="hover:text-slate-600 text-slate-800/90! transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {!isAuthenticated && (
                <>
                  <a href="/auth/sign-in" className="hidden lg:flex px-6 py-2.5 text-sm font-semibold rounded-full bg-slate-900 text-white! hover:opacity-90 transition-opacity">
                    Login
                  </a>
                  <a href="/auth/sign-up" className="hidden lg:flex px-6 py-2.5 text-sm font-semibold rounded-full bg-[#4F46E5] text-white! hover:bg-[#4F46E5]/90 transition-colors">
                    Start Free Store
                  </a>
                </>
              )}

              {/* Mobile Menu Button */}
              {/* <button 
                className="lg:hidden p-2 text-slate-900 dark:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button> */}
            </div>
          </div>
        </div>
{/* 
        Mobile Sidebar (Overlay)
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            Backdrop
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            
            Menu Content
            <div className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-slate-900 p-6 shadow-xl">
              <div className="flex justify-end mb-8">
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X size={24} className="text-slate-900 dark:text-white" />
                </button>
              </div>
              <ul className="space-y-6">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a 
                      href={item.href} 
                      className="block text-lg font-medium text-slate-900 dark:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <hr className="border-slate-200 dark:border-slate-800" />
                <li>
                  <a href="/login" className="block w-full py-3 text-center rounded-lg border border-slate-900 dark:border-white font-semibold">
                    Login
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )} */}
      </nav>
    </header>
  );
}

export default PageHeader;