

export default function StepBadge({ number, title, icon }: { number: number; title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-black font-semibold shadow">
        {icon}
      </div>
      <div>
        <div className="text-xs text-black">Step {number}</div>
        <div className="text-sm font-semibold text-black">{title}</div>
      </div>
    </div>
  );
}