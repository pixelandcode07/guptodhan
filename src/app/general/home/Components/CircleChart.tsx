'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

// Chart Data
const data = [
  { name: 'ভাপা পিঠা', value: 5 },
  { name: 'দুধ চিতই জোড়া', value: 4 },
  { name: 'পাটিসাপটা', value: 3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FF4D67'];

// Custom Hover Shape
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      {/* Main Sector (zoom effect) */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#fff"
        strokeWidth={3}
      />
      {/* Outer Glow Border */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="rgba(0,0,0,0.08)"
      />
    </g>
  );
};

export default function BestSellingChart() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // যখন hover করবো → activeIndex change হবে
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // default → সবচেয়ে বড় value show হবে
  const defaultData = data.reduce((max, item) =>
    item.value > max.value ? item : max
  );
  const centerData = data[activeIndex] || defaultData;

  return (
    <Card className="rounded-2xl shadow-md">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Sales Analytics (Successful & Failed Order Ratio)
        </CardTitle>
        <p className="text-sm text-gray-500">
          From date of 1st Mar, 2025 to continue
        </p>
      </CardHeader>

      <CardContent className="h-[350px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              dataKey="value"
              onMouseEnter={onPieEnter}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Dynamic Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl font-bold">{centerData.name}</span>
          <span className="text-lg font-semibold">{centerData.value}</span>
        </div>
      </CardContent>
    </Card>
  );
}
