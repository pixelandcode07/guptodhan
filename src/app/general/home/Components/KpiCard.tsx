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

export function KpiCard({ title, value, growth, icon: Icon, iconColor, subtext }: KpiCardProps) {
  const isPositive = growth >= 0;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-md hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900">{value}</h3>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-bold gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(growth).toFixed(1)}%
              </span>
              <span className="text-slate-400 ml-2">{subtext || "from last month"}</span>
            </div>
          </div>
          <div 
            className="p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300" 
            style={{ backgroundColor: `${iconColor}20` }}
          >
            <Icon className="w-8 h-8" style={{ color: iconColor }} />
          </div>
        </div>
        
        {/* Animated gradient line */}
        <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
      </CardContent>
    </Card>
  );
}