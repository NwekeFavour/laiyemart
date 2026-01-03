import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { ArrowUpRight, MoreHorizontal } from 'lucide-react';

const data = [
  { name: 'Mon', current: 4000, previous: 2400 },
  { name: 'Tue', current: 3000, previous: 1398 },
  { name: 'Wed', current: 2000, previous: 9800 },
  { name: 'Thu', current: 2780, previous: 3908 },
  { name: 'Fri', current: 1890, previous: 4800 },
  { name: 'Sat', current: 2390, previous: 3800 },
  { name: 'Sun', current: 3490, previous: 4300 },
];

const SalesActivity = ({ isDark }) => {
  const bg = isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-gray-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
  const lineCurrent = '#6366f1';
  const linePrevious = '#cbd5e1';
  const gridStroke = isDark ? '#334155' : '#f1f5f9';

  return (
    <div className={`w-full lg:max-w-full max-w-4xl p-6 rounded-2xl border mb-5 ${bg}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Sales Activity</h3>
          <p className={`text-sm ${textSecondary}`}>Real-time performance tracking</p>
        </div>
        <button className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
          <MoreHorizontal className={`w-5 h-5 ${textSecondary}`} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-8 mb-8">
        <div>
          <span className={`text-sm block mb-1 ${textSecondary}`}>Total Revenue</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>₦12,480</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.5%
            </span>
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textSecondary === 'text-slate-400' ? '#94a3b8' : '#64748b', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: textSecondary === 'text-slate-400' ? '#94a3b8' : '#64748b', fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: isDark ? '#1e293b' : '#fff', color: isDark ? '#f8fafc' : '#000' }} />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', color: isDark ? '#cbd5e1' : '#64748b' }} />
            <Line type="monotone" dataKey="current" name="This Week" stroke={lineCurrent} strokeWidth={3} dot={{ r: 4, fill: lineCurrent, strokeWidth: 2, stroke: isDark ? '#1e293b' : '#fff' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="previous" name="Last Week" stroke={linePrevious} strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesActivity;
