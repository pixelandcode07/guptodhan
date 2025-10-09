'use client';

import { CardTitle } from '@/components/ui/card';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { ShoppingCart, DollarSign, Users, Package } from 'lucide-react';

// ✅ FIX: Create a map to associate string names with the actual icon components
const iconMap = {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
};

interface ChartCardProps {
  title: string;
  value: string | number;
  color: string;
  data: { name: string; value: number }[];
  iconName: keyof typeof iconMap; // ✅ FIX: Prop is now a string name
  iconColor: string;
  withButton?: boolean;
}

export default function ChartCard({ title, value, color, data, iconName, iconColor, withButton }: ChartCardProps) {
  const Icon = iconMap[iconName]; // ✅ FIX: Select the icon component based on the name string

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{value}</p>
            {withButton && <button className="mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded">View More</button>}
          </div>
        </div>
        <div className={`p-3 rounded-full`} style={{ backgroundColor: `${iconColor}20` }}>
          {/* Render the icon if it exists */}
          {Icon && <Icon className={`w-6 h-6`} style={{ color: iconColor }} />}
        </div>
      </div>
      <div className="h-[70px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}