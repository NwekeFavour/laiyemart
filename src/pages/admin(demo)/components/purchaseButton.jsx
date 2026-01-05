// PurchaseButton.jsx
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function PurchaseButton({ onClick,isDark }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <Link
        onClick={onClick}
        className={` ${isDark ? "bg-slate-600 hover:bg-slate-600 text-white" : " text-white"}
          flex items-center gap-2
          px-6 py-3
          rounded-full
          bg-neutral-600 hover:bg-neutral-700
          text-white font-semibold text-sm
          shadow-lg hover:shadow-xl
          transition-all duration-200 ease-out
          active:scale-95
        `}
      >
        <ShoppingCart size={18} />
        Subscribe
      </Link>
    </div>
  );
}
