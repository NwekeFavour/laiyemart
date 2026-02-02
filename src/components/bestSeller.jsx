import React, { useEffect } from 'react';
import { ChevronRight, PackageOpen } from 'lucide-react'; // Using Lucide for the empty icon
import useOrderStore from '../../services/orderService';

export default function BestSellersCard({ isDark}) {
  const {orders, fetchVendorOrders} = useOrderStore()

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const containerClasses = `rounded-xl border flex flex-col transition-colors h-full
    ${isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-gray-900'}`;

  const headerClasses = `flex items-center justify-between mb-4 border-b px-3 py-4
    ${isDark ? 'border-slate-700' : 'border-slate-100'}`;

    const bestSellers = Object.values(
  orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      const productId = item.product.toString();
      if (!acc[productId]) {
        acc[productId] = {
          name: item.name,
          sku: productId.slice(-6).toUpperCase(), // Using ID slice as SKU fallback
          price: `₦${item.price.toLocaleString()}`,
          salesCount: 0,
          image: item.product?.images[0], // Or item.product.image if populated
        };
      }
      acc[productId].salesCount += item.quantity;
    });
    return acc;
  }, {})
)
  .sort((a, b) => b.salesCount - a.salesCount) // Highest sales first
  .slice(0, 5); // Top 5
  // console.log("Best Sellers:", bestSellers);
  const isEmpty = bestSellers.length === 0;

  return (
<div className={`rounded-xl border flex flex-col transition-colors h-full
      ${isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-gray-900'}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between mb-4 border-b px-3 py-4
        ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Best Sellers</h3>
        {!isEmpty && (
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter
            ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            Top Performing
          </span>
        )}
      </div>

      {/* Content */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1 py-10 px-6 text-center">
          <div className={`p-4 rounded-full mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <PackageOpen size={32} className={isDark ? 'text-slate-500' : 'text-slate-300'} />
          </div>
          <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            No sales recorded yet
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Top products will appear here once you start selling.
          </p>
        </div>
      ) : (
        <ul className="space-y-4 px-3 pb-5">
          {bestSellers.map((product, index) => (
            <li key={index} className="flex items-center gap-3 group cursor-pointer">
              {/* Rank or Image */}
              <div className={`relative w-12 h-12 shrink-0 overflow-hidden rounded-lg border
                ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                {product.image ? (
                  <img
                    src={product.image.url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full font-bold text-slate-400">
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate transition-colors 
                  ${isDark ? 'text-slate-200 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'}`}>
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                  <span className={`font-bold ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
                    {product.price}
                  </span>
                  <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                    {product.salesCount} sold
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0
                ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <ChevronRight size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}