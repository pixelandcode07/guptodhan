import { ArrowDownIcon, ArrowUpIcon, LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  growth: number;
  icon: LucideIcon;
  iconColor: string;
  subtext: string;
}

export function KpiCard({ title, value, growth, icon: Icon, iconColor, subtext }: KpiCardProps) {
  const isPositive = growth >= 0;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg h-full flex flex-col justify-between hover:bg-white/90 transition-colors cursor-pointer">
      <div>
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
          {title}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          <div 
            className="p-3 rounded-xl bg-opacity-10 flex-shrink-0" 
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon size={24} color={iconColor} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <ArrowUpIcon size={16} className="text-emerald-500" />
          ) : (
            <ArrowDownIcon size={16} className="text-rose-500" />
          )}
          <span className={`text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isPositive ? '+' : ''}{growth}%
          </span>
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{subtext}</span>
      </div>
    </div>
  );
}