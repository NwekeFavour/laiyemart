import React from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const orders = [
  { id: '#671452-VN', date: '29 Mar, 2025', customer: 'Emma Chen', amount: '$169.00', method: 'Mastercard', country: 'Canada', flag: '🇨🇦', status: 'Delivered' },
  { id: '#358147-QR', date: '28 Nov, 2025', customer: 'Charlotte Lee', amount: '$156.75', method: 'Mastercard', country: 'Ukraine', flag: '🇺🇦', status: 'Cancelled' },
  { id: '#715249-OP', date: '28 Mar, 2026', customer: 'Grace Lopez', amount: '$189.95', method: 'Paypal', country: 'India', flag: '🇮🇳', status: 'Delivered' },
  { id: '#912048-MF', date: '28 Apr, 2025', customer: 'Sophia Patel', amount: '$230.00', method: 'Visa', country: 'Ukraine', flag: '🇺🇦', status: 'Delivered' },
  { id: '#048572-AB', date: '25 Jan, 2026', customer: 'Sebastian Walker', amount: '$92.40', method: 'iDeal', country: 'Ukraine', flag: '🇺🇦', status: 'Cancelled' },
  { id: '#750163-DP', date: '22 Jul, 2025', customer: 'Lucas Anderson', amount: '$49.00', method: 'Mastercard', country: 'Malaysia', flag: '🇲🇾', status: 'Pending' },
  { id: '#508234-WS', date: '22 Jul, 2025', customer: 'James Liu', amount: '$84.00', method: 'iDeal', country: 'India', flag: '🇮🇳', status: 'Delivered' },
];

const StatusBadge = ({ status, isDark }) => {
  const styles = {
    Delivered: isDark ? 'bg-emerald-800/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
    Cancelled: isDark ? 'bg-red-800/20 text-red-400' : 'bg-red-100 text-red-700',
    Pending: isDark ? 'bg-orange-800/20 text-orange-400' : 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function RecentOrdersTable({ isDark }) {
  const bg = isDark ? 'bg-slate-900 border-[#E5E7EB] text-slate-200' : 'bg-white border-slate-100 text-gray-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-gray-400';
  const borderColor = isDark ? 'border-[#E5E7EB]' : 'border-slate-100';
  const hoverRow = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50/50';

  return (
    <div className={`w-full rounded-lg border overflow-hidden font-sans ${bg}`}>
      {/* Toolbar */}
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>Recent Orders</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
            <input 
              type="text" 
              placeholder="Search by ID" 
              className={`pl-9 pr-4 py-1.5 text-sm rounded-md w-48 border focus:outline-none focus:ring-1 focus:ring-blue-500 
                ${isDark ? 'border-[#E5E7EB] bg-slate-800 text-slate-200' : 'border-slate-100 bg-white text-gray-900'}`}
            />
          </div>
          <button className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border hover:bg-gray-50 
            ${isDark ? 'text-slate-200 border-[#E5E7EB] hover:bg-slate-800/50' : 'text-gray-700 border-slate-100'}`}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`w-full text-left border-collapse border-t ${borderColor}`}>
          <thead>
            <tr className={`text-[13px] border-b ${borderColor} ${isDark ? 'text-slate-400 bg-slate-800' : 'text-gray-600 bg-white'}`}>
              <th className={`px-4 py-3 border-r ${borderColor} w-10 text-center`}>
                <input type="checkbox" className="rounded-sm accent-blue-600" />
              </th>
              {['Order ID','Date','Customer','Amount','Payment Method','Order Status',''].map((col, idx) => (
                <th key={idx} className={`px-4 py-3 border-r ${borderColor} font-semibold text-[13px] whitespace-nowrap`}>
                  {col} {col !== '' && <ChevronDown className="inline w-3 h-3 ml-1 text-gray-400" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, idx) => (
              <tr key={idx} className={`text-[13px] ${isDark ? 'text-slate-200' : 'text-gray-700'} ${hoverRow}`}>
                <td className={`px-4 py-3 border-r ${borderColor} text-center`}><input type="checkbox" className="rounded-sm accent-blue-600" /></td>
                <td className={`px-4 py-3 border-r ${borderColor} font-medium`}>{order.id}</td>
                <td className={`px-4 py-3 border-r ${borderColor}`}>{order.date}</td>
                <td className={`px-4 py-3 border-r ${borderColor}`}>{order.customer}</td>
                <td className={`px-4 py-3 border-r ${borderColor} font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{order.amount}</td>
                <td className={`px-4 py-3 border-r ${borderColor}`}>{order.method}</td>
                <td className={`px-4 py-3 border-r ${borderColor}`}><StatusBadge status={order.status} isDark={isDark} /></td>
                <td className="px-4 py-3 text-center">
                  <button className={`font-semibold hover:underline border-b border-dotted ${isDark ? 'text-blue-400 border-blue-400' : 'text-blue-500 border-blue-500'}`}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
    <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-[13px] ${borderColor} ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
    {/* Rows per page */}
    <div className="flex items-center gap-2 w-full sm:w-auto">
        <span>Rows per page:</span>
        <select className={`border rounded px-2 py-1 text-sm outline-none transition-colors
        ${isDark ? 'border-[#E5E7EB] bg-slate-800 text-slate-200 hover:border-slate-500' : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'}`}>
        <option>10</option>
        <option>20</option>
        <option>50</option>
        <option>100</option>
        </select>
    </div>

    {/* Pagination */}
    <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
        <span className="text-sm">{`1 - 10 of 25`}</span>
        <div className="flex items-center gap-1">
        {/* Previous */}
        <button className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-slate-700 hover:text-slate-200' : 'hover:bg-gray-100 hover:text-gray-900'}`}>
            <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {[1,2,3,4].map((page) => (
            <button
            key={page}
            className={`w-8 h-8 flex items-center justify-center rounded-md font-medium transition-colors
                ${page === 1 
                ? (isDark ? 'bg-slate-700 text-slate-200' : 'bg-blue-100 text-blue-600') 
                : (isDark ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-gray-50 text-gray-900')}`}
            >
            {page}
            </button>
        ))}

        {/* Next */}
        <button className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-slate-700 hover:text-slate-200' : 'hover:bg-gray-100 hover:text-gray-900'}`}>
            <ChevronRight className="w-4 h-4" />
        </button>
        </div>
    </div>
    </div>

    </div>
  );
}
