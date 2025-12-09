"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan-25", success: 0, failed: 0 },
  { month: "Feb-25", success: 0, failed: 0 },
  { month: "Mar-25", success: 0, failed: 0 },
  { month: "Apr-25", success: 0, failed: 0 },
  { month: "May-25", success: 0, failed: 0 },
  { month: "Jun-25", success: 0, failed: 0 },
  { month: "Jul-25", success: 0, failed: 0 },
  { month: "Aug-25", success: 0, failed: 0 },
  { month: "Sep-25", success: 0, failed: 0 },
  { month: "Oct-25", success: 0, failed: 0 },
  { month: "Nov-25", success: 0, failed: 0 },
  { month: "Dec-25", success: 0, failed: 0 },
];

export default function SalesAnalyticsChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="failed"
            stroke="#ff4d4d"
            strokeWidth={2}
            name="Failed Orders"
          />
          <Line
            type="monotone"
            dataKey="success"
            stroke="#00c18c"
            strokeWidth={2}
            name="Successful Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
