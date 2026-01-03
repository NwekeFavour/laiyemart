import React from 'react';

const bestSellers = [
  {
    name: "Cloud Shift Lightweight Runner Pro Edition",
    sku: "SD-999-TAN-38",
    price: "₦120.00",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Titan Edge High Impact Stability Lightweight",
    sku: "TE-750-BLK-42",
    price: "₦145.00",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Aero Glide Breathable Mesh Trainers",
    sku: "AG-400-WHT-39",
    price: "₦98.00",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Urban Explorer Waterproof Leather",
    sku: "UE-100-BRM-44",
    price: "₦160.00",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200",
  },
];

export default function BestSellersCard({ isDark }) {
  const containerClasses = `rounded-xl border flex flex-col transition-colors
    ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-gray-900'}`;

  const headerClasses = `flex items-center justify-between mb-4 border-b px-3 py-4
    ${isDark ? 'border-slate-700' : 'border-slate-100'}`;

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={headerClasses}>
        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Best Sellers</h3>
        <button className={`text-sm font-semibold
          ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
          See All
        </button>
      </div>

      {/* Product List */}
      <ul className="space-y-5 px-3 pb-3">
        {bestSellers.map((product, index) => (
          <li key={index} className="flex items-center gap-4 group cursor-pointer">
            {/* Image Container */}
            <div className={`relative w-14 h-14 shrink-0 overflow-hidden rounded-xl 
              ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'} border`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold leading-tight truncate transition-colors 
                ${isDark ? 'text-slate-200 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'}`}>
                {product.name}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px]">
                <span className={`font-medium uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  SKU: {product.sku}
                </span>
                <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                <span className={`font-bold ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
                  {product.price}
                </span>
              </div>
            </div>

            {/* Chevron Icon */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
