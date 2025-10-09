'use client';
// This file is updated to accept props
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
    data: { name: string; successful: number; failed: number }[];
}

export default function SalesAnalyticsChart({ data }: SalesChartProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Sales Analytics (Monthly)</CardTitle>
        <p className="text-sm text-gray-500">Successful vs. Failed Orders</p>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="successful" fill="#22c55e" name="Successful" />
            <Bar dataKey="failed" fill="#ef4444" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}