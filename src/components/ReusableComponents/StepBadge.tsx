import { ReactNode } from "react";

interface StepBadgeProps {
  number: number;
  title: string;
  icon: ReactNode;
  isActive?: boolean;
}

export default function StepBadge({
  number,
  title,
  icon,
  isActive = false,
}: StepBadgeProps) {
  return (
    <div className={`flex items-center gap-3 transition-all duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}>
      <div
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center text-black font-semibold shadow
          transition-all duration-300
          ${isActive
            ? "bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30"
            : "bg-white/30 backdrop-blur-sm border border-white/20"
          }
        `}
      >
        {icon}
      </div>
      <div className="transition-colors duration-300">
        <div className={`text-xs font-medium ${isActive ? "text-emerald-700" : "text-black"}`}>
          Step {number}
        </div>
        <div className={`font-semibold ${isActive ? "text-emerald-700" : "text-black"}`}>
          {title}
        </div>
      </div>
    </div>
  );
}