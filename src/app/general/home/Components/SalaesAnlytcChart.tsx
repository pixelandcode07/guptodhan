'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan-25', success: 0, failed: 0 },
  { name: 'Mar-25', success: 0, failed: 0 },
  { name: 'May-25', success: 1, failed: 0 },
  { name: 'Jul-25', success: 6, failed: 2 },
  { name: 'Sep-25', success: 2, failed: 0 },
];

export default function SalesAnalyticsChart() {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Sales Analytics (Successful & Failed Order Ratio)
        </CardTitle>
        <p className="text-sm text-gray-500">From Last Few Months</p>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={40} maxBarSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis
              label={{ value: 'Orders', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="success" fill="#14b8a6" name="Successful Orders" />
            <Bar dataKey="failed" fill="#ef4444" name="Failed Orders" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
