'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

interface RevenueData {
  date: string;
  Sales: number;
}

// Money Formatter Helper
const formatMoney = (val: number) => {
  if (val >= 1000000) return `৳${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `৳${(val / 1000).toFixed(1)}k`;
  return `৳${val.toFixed(0)}`;
};

export default function RevenueChart({ 
  data, 
  globalTotalOrders = 0 
}: { 
  data: RevenueData[], 
  globalTotalOrders?: number 
}) {
  const [timeframe, setTimeframe] = useState('7 Days');

  // ✅ MAGIC FIX: Date Based Filtering (অ্যারে না কেটে অরিজিনাল তারিখ অনুযায়ী ফিল্টার)
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    now.setHours(23, 59, 59, 999); // আজকের দিনের শেষ সময়

    const cutoff = new Date(now);
    
    if (timeframe === '7 Days') {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeframe === '14 Days') {
      cutoff.setDate(now.getDate() - 14);
    } else if (timeframe === '30 Days') {
      cutoff.setDate(now.getDate() - 30);
    } else if (timeframe === 'Yearly') {
      cutoff.setDate(now.getDate() - 365);
    }

    cutoff.setHours(0, 0, 0, 0); // কাটঅফ দিনের শুরুর সময়

    return data.filter(item => {
      const itemDate = new Date(item.date);
      // যদি Date ফরম্যাট ভুল থাকে তবে ডাটা রেখে দিবে, নাহলে তারিখ অনুযায়ী ফিল্টার করবে
      if (isNaN(itemDate.getTime())) return true; 
      return itemDate >= cutoff && itemDate <= now;
    });
  }, [data, timeframe]);

  const stats = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return { totalRevenue: 0, avgRevenue: 0, maxRevenue: 0, growth: 0, totalOrders: globalTotalOrders };
    }

    const total = filteredData.reduce((sum, item) => sum + (item.Sales || 0), 0);
    const avg = total / filteredData.length;
    const max = Math.max(...filteredData.map(d => d.Sales || 0));

    const halfIndex = Math.floor(filteredData.length / 2);
    const firstHalf = filteredData.slice(0, halfIndex).reduce((sum, item) => sum + (item.Sales || 0), 0);
    const secondHalf = filteredData.slice(halfIndex).reduce((sum, item) => sum + (item.Sales || 0), 0);
    
    let growthRate = 0;
    if (firstHalf > 0) {
      growthRate = ((secondHalf - firstHalf) / firstHalf) * 100;
    } else if (secondHalf > 0) {
      growthRate = 100;
    }

    return {
      totalRevenue: total,
      avgRevenue: avg,
      maxRevenue: max,
      growth: growthRate,
      totalOrders: globalTotalOrders 
    };
  }, [filteredData, globalTotalOrders]);

  const getBarColor = (value: number) => {
    if (stats.maxRevenue > 0) {
      if (value >= stats.maxRevenue * 0.8) return '#f97316'; 
      if (value >= stats.maxRevenue * 0.5) return '#fb923c'; 
    }
    return '#fed7aa'; 
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
        toast.error("No data to export");
        return;
    }
    
    const headers = ['Date', 'Sales (Revenue)'];
    const csvRows = [headers.join(',')];
    
    filteredData.forEach(item => {
        const values = [`"${item.date}"`, item.Sales];
        csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const filename = `revenue-report-${timeframe.replace(/\s+/g, '-').toLowerCase()}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Revenue report for ${timeframe} exported successfully!`);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const date = payload[0].payload.date;
      const percentOfMax = stats.maxRevenue > 0 ? ((value / stats.maxRevenue) * 100).toFixed(0) : 0;
      
      return (
        <div className="bg-white/95 backdrop-blur-md border border-gray-200 p-4 rounded-xl shadow-2xl min-w-[200px] z-50">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{date}</p>
            <div className="flex items-end gap-3">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Revenue</p>
                <p className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {formatMoney(value)}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-orange-100 text-orange-700">
                {percentOfMax}% of peak
              </span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                style={{ width: `${percentOfMax}%` }}
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ label, value, growth, icon: Icon, gradient }: any) => (
    <div className={`rounded-xl p-4 backdrop-blur-sm border border-white/20 bg-gradient-to-br ${gradient} h-full transition-transform hover:-translate-y-1 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
          {growth !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${
              growth >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(growth).toFixed(1)}% vs last period
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-white/20">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── TOP 4 CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/general/view/orders" className="block h-full">
          <StatCard
            label="Total Revenue"
            value={formatMoney(stats.totalRevenue)}
            growth={stats.growth}
            gradient="from-orange-500 via-orange-600 to-red-600"
          />
        </Link>
        <Link href="/general/view/orders" className="block h-full">
          <StatCard
            label="Daily Average"
            value={formatMoney(stats.avgRevenue)}
            gradient="from-blue-500 via-blue-600 to-cyan-600"
          />
        </Link>
        <Link href="/general/view/orders" className="block h-full">
          <StatCard
            label="Peak Revenue"
            value={formatMoney(stats.maxRevenue)}
            gradient="from-purple-500 via-purple-600 to-pink-600"
          />
        </Link>
        <Link href="/general/view/orders" className="block h-full">
          <StatCard
            label="Total Orders"
            value={stats.totalOrders} 
            growth={2.4} 
            gradient="from-emerald-500 via-emerald-600 to-teal-600"
          />
        </Link>
      </div>

      {/* ── MAIN CHART CARD ── */}
      <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Revenue Report</h3>
              <p className="text-sm text-gray-500 mt-1">Daily revenue performance and trends</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-orange-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all px-3 py-2 cursor-pointer shadow-sm"
              >
                <option value="7 Days">Last 7 Days</option>
                <option value="14 Days">Last 14 Days</option>
                <option value="30 Days">Last 1 Month</option>
                <option value="Yearly">Last 1 Year</option>
              </select>

              <button 
                onClick={handleExport}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">Export</span>
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={filteredData}
                margin={{ top: 20, right: 20, left: -10, bottom: 60 }}
                barCategoryGap="15%"
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#fb923c" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="4 4" 
                  vertical={false} 
                  stroke="#e2e8f0"
                  opacity={0.6}
                />

                <XAxis 
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                  angle={filteredData.length > 10 ? -45 : 0}
                  textAnchor={filteredData.length > 10 ? "end" : "middle"}
                  height={filteredData.length > 10 ? 80 : 40}
                  tickFormatter={(val) => {
                    try {
                      const d = new Date(val);
                      if (isNaN(d.getTime())) return val;
                      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    } catch {
                      return val;
                    }
                  }}
                />

                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `৳${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `৳${(value / 1000).toFixed(0)}k`;
                    return `৳${value}`;
                  }}
                  width={70}
                />

                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: '#f8fafc', opacity: 0.5 }}
                  wrapperStyle={{ outline: 'none' }}
                />

                <Bar 
                  dataKey="Sales"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                  animationDuration={600}
                >
                  {filteredData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={getBarColor(entry.Sales)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── BOTTOM 4 CARDS ── */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Days', value: filteredData.length, color: 'from-blue-500 to-blue-600' },
              { label: 'Avg Daily', value: formatMoney(stats.avgRevenue), color: 'from-orange-500 to-orange-600' },
              { label: 'Peak Value', value: formatMoney(stats.maxRevenue), color: 'from-purple-500 to-purple-600' },
              { label: 'Growth', value: `${stats.growth.toFixed(1)}%`, color: stats.growth >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600' },
            ].map((item, idx) => (
              <Link href="/general/view/orders" key={idx} className="block transition-transform hover:-translate-y-1">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} text-white h-full shadow-md hover:shadow-lg`}>
                  <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{item.label}</p>
                  <p className="text-lg md:text-xl font-bold mt-1">{item.value}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── INSIGHTS CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <ArrowUpRight className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Performance Trend</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.growth > 10 
                    ? `📈 Excellent performance! Revenue growing at ${stats.growth.toFixed(1)}% - maintain momentum!`
                    : stats.growth > 0
                    ? `📊 Steady growth of ${stats.growth.toFixed(1)}%. Keep monitoring key metrics.`
                    : `📉 Slight decline detected. Review recent changes and market conditions.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-emerald-100">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Key Insight</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Peak revenue of {formatMoney(stats.maxRevenue)} represents {stats.avgRevenue > 0 ? ((stats.maxRevenue / stats.avgRevenue - 1) * 100).toFixed(0) : 0}% above average. Analyze factors driving peak performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}