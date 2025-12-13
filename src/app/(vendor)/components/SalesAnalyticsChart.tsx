// "use client";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const data = [
//   { month: "Jan-25", success: 0, failed: 0 },
//   { month: "Feb-25", success: 0, failed: 0 },
//   { month: "Mar-25", success: 0, failed: 0 },
//   { month: "Apr-25", success: 0, failed: 0 },
//   { month: "May-25", success: 0, failed: 0 },
//   { month: "Jun-25", success: 0, failed: 0 },
//   { month: "Jul-25", success: 0, failed: 0 },
//   { month: "Aug-25", success: 0, failed: 0 },
//   { month: "Sep-25", success: 0, failed: 0 },
//   { month: "Oct-25", success: 0, failed: 0 },
//   { month: "Nov-25", success: 0, failed: 0 },
//   { month: "Dec-25", success: 0, failed: 0 },
// ];

// export default function SalesAnalyticsChart() {
//   return (
//     <div className="h-72 w-full">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={data}>
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="failed"
//             stroke="#ff4d4d"
//             strokeWidth={2}
//             name="Failed Orders"
//           />
//           <Line
//             type="monotone"
//             dataKey="success"
//             stroke="#00c18c"
//             strokeWidth={2}
//             name="Successful Orders"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }


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

interface Order {
  orderStatus: string;
  createdAt: string;
}

// Generate last 12 months (Jan 2025 → Dec 2025)
function generateLast12Months() {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const short = date.toLocaleString("en-US", { month: "short", year: "2-digit" });
    months.push({ name: short.replace(" ", "-"), success: 0, failed: 0 });
  }
  return months;
}

export default function SalesAnalyticsChart({ orders }: { orders: Order[] }) {
  const monthlyData = generateLast12Months();

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthKey = date.toLocaleString("en-US", { month: "short", year: "2-digit" }).replace(" ", "-");

    const monthEntry = monthlyData.find(m => m.name === monthKey);
    if (!monthEntry) return;

    const isSuccess = ["Delivered", "Paid", "Completed"].includes(order.orderStatus);
    const isFailed = ["Cancelled", "Refunded", "Failed"].includes(order.orderStatus);

    if (isSuccess) monthEntry.success += 1;
    if (isFailed) monthEntry.failed += 1;
  });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="failed"
            stroke="#ff4d4d"
            strokeWidth={2}
            name="Failed Orders"
            dot={{ fill: "#ff4d4d" }}
          />
          <Line
            type="monotone"
            dataKey="success"
            stroke="#00c18c"
            strokeWidth={2}
            name="Successful Orders"
            dot={{ fill: "#00c18c" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}