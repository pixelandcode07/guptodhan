import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  growth: number;
  icon: LucideIcon;
  iconColor: string;
  subtext?: string;
}

export default function KpiCard({ title, value, growth, icon: Icon, iconColor, subtext }: KpiCardProps) {
  const isPositive = growth >= 0;

  return (
    <Card className="shadow-sm border-none bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: `${iconColor}20` }}>
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-sm">
          <span className={`flex items-center font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {Math.abs(growth).toFixed(1)}%
          </span>
          <span className="text-gray-400 ml-2">{subtext || "from last month"}</span>
        </div>
      </CardContent>
    </Card>
  );
}