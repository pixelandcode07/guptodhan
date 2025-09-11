'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartCardProps {
  title: string;
  value: string | number;
  color: string;
  data: { name: string; success: number; failed?: number }[];
  Icon: any;
  iconColor: string;
  withButton?: boolean;
}

export default function ChartCard({
  title,
  value,
  color,
  data,
  Icon,
  iconColor,
  withButton,
}: ChartCardProps) {
  return (
    <div className=" p-2 shadow">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-xs font-medium">{title}</CardTitle>{' '}
          <div className="flex  justify-start items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {withButton && (
              <div className="mt-2 text-xs bg-blue-400 text-white px-2 py-1 rounded cursor-pointer hover:opacity-90 transition w-max">
                <button>View More</button>
              </div>
            )}
          </div>
        </div>
        <div
          className={`p-2 rounded-full`}
          style={{ backgroundColor: `${iconColor}33` }}>
          <Icon className={`w-5 h-5`} style={{ color: iconColor }} />
        </div>
      </div>

      <div className="h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Tooltip />
            <Area
              type="monotone"
              dataKey="success"
              stroke={color}
              fill={color}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
