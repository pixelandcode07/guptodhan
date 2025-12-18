'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Download, Filter, MoreHorizontal } from 'lucide-react';
import { useState, useMemo } from 'react';

interface RevenueData {
  date: string;
  Sales: number;
}

export default function RevenueChart({ data }: { data: RevenueData[] }) {
  const [timeframe, setTimeframe] = useState('14 Days');
  const [showFilter, setShowFilter] = useState(false);

  // Advanced calculations
  const stats = useMemo(() => {
    if (data.length === 0) {
      return {
        totalRevenue: 0,
        avgRevenue: 0,
        maxRevenue: 0,
        growth: 0,
        change: 0,
        totalOrders: 0
      };
    }

    const total = data.reduce((sum, item) => sum + (item.Sales || 0), 0);
    const avg = total / data.length;
    const max = Math.max(...data.map(d => d.Sales || 0));
    const firstHalf = data.slice(0, Math.ceil(data.length / 2)).reduce((sum, item) => sum + (item.Sales || 0), 0);
    const secondHalf = data.slice(Math.ceil(data.length / 2)).reduce((sum, item) => sum + (item.Sales || 0), 0);
    const growthRate = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf * 100) : 0;

    return {
      totalRevenue: total,
      avgRevenue: avg,
      maxRevenue: max,
      growth: growthRate,
      change: growthRate,
      totalOrders: data.length * 15
    };
  }, [data]);

  // Get bar colors based on value
  const getBarColor = (value: number) => {
    if (value >= stats.maxRevenue * 0.8) return '#f97316'; // Orange - High
    if (value >= stats.maxRevenue * 0.5) return '#fb923c'; // Light Orange - Medium
    return '#fed7aa'; // Pale Orange - Low
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const date = payload[0].payload.date;
      const percentOfMax = ((value / stats.maxRevenue) * 100).toFixed(0);
      
      return (
        <div className="bg-white/95 backdrop-blur-md border border-gray-200 p-4 rounded-xl shadow-2xl min-w-[200px] z-50">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{date}</p>
            <div className="flex items-end gap-3">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Revenue</p>
                <p className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  ৳{(value / 1000).toFixed(1)}k
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

  // Stat card component
  const StatCard = ({ label, value, growth, icon: Icon, gradient }: any) => (
    <div className={`rounded-xl p-4 backdrop-blur-sm border border-white/20 bg-gradient-to-br ${gradient}`}>
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
      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`৳${(stats.totalRevenue / 1000000).toFixed(2)}M`}
          growth={stats.growth}
          gradient="from-orange-500 via-orange-600 to-red-600"
        />
        <StatCard
          label="Daily Average"
          value={`৳${(stats.avgRevenue / 1000).toFixed(1)}k`}
          gradient="from-blue-500 via-blue-600 to-cyan-600"
        />
        <StatCard
          label="Peak Revenue"
          value={`৳${(stats.maxRevenue / 1000).toFixed(1)}k`}
          gradient="from-purple-500 via-purple-600 to-pink-600"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          growth={2.4}
          gradient="from-emerald-500 via-emerald-600 to-teal-600"
        />
      </div>

      {/* Main Chart Card */}
      <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-gray-50">
        {/* Header */}
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Revenue Report</h3>
              <p className="text-sm text-gray-500 mt-1">Daily revenue performance and trends</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Timeframe Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 transition-all duration-200 hover:shadow-md"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  {timeframe}
                  <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                
                {showFilter && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {['7 Days', '14 Days', '30 Days', 'Yearly'].map(period => (
                      <button
                        key={period}
                        onClick={() => {
                          setTimeframe(period);
                          setShowFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          timeframe === period 
                            ? 'bg-orange-50 text-orange-600 font-semibold' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* More options button */}
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-all duration-200 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {/* Export button */}
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md">
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">Export</span>
              </button>
            </div>
          </div>
        </CardHeader>

        {/* Chart Area */}
        <CardContent className="pt-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data}
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
                  angle={data.length > 10 ? -45 : 0}
                  textAnchor={data.length > 10 ? "end" : "middle"}
                  height={data.length > 10 ? 80 : 40}
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
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={getBarColor(entry.Sales)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Stats */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Days', value: data.length, color: 'from-blue-500 to-blue-600' },
              { label: 'Avg Daily', value: `৳${(stats.avgRevenue / 1000).toFixed(1)}k`, color: 'from-orange-500 to-orange-600' },
              { label: 'Peak Value', value: `৳${(stats.maxRevenue / 1000).toFixed(1)}k`, color: 'from-purple-500 to-purple-600' },
              { label: 'Growth', value: `${stats.growth.toFixed(1)}%`, color: stats.growth >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600' },
            ].map((item, idx) => (
              <div key={idx} className={`p-3 rounded-lg bg-gradient-to-br ${item.color} text-white`}>
                <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{item.label}</p>
                <p className="text-lg md:text-xl font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights Cards */}
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
                  Peak revenue of ৳{(stats.maxRevenue / 1000).toFixed(1)}k represents {((stats.maxRevenue / stats.avgRevenue - 1) * 100).toFixed(0)}% above average. Analyze factors driving peak performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}