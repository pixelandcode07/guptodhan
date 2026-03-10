"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TrainingModalButton({ isMobile = false }: { isMobile?: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {isMobile ? (
                // Mobile Version Button
                <button
                    onClick={() => setOpen(true)}
                    className="flex shrink-0 flex-col md:flex-row items-center justify-center gap-2 h-11 px-8 rounded-lg md:min-w-[120px] bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    <GraduationCap size={24} className="hidden md:block text-gray-700" />
                    <span className="text-sm font-medium text-gray-800">Training</span>
                </button>
            ) : (
                // Desktop Version Button - EXACT same size class
                <button
                    onClick={() => setOpen(true)}
                    className="group relative flex h-[54px] w-full items-center justify-start rounded-lg gap-2 xl:gap-3 border border-sky-900 bg-sky-300 px-2 xl:px-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                        <GraduationCap size={18} className="text-gray-800 transition-all duration-300 group-hover:text-orange-600" />
                    </div>
                    <span className="text-[11px] xl:text-[13px] font-bold uppercase tracking-wide text-black truncate">
                        Get Training
                    </span>
                </button>
            )}

            {/* Coming Soon Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold text-[#00005E]">Coming Soon!</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="h-20 w-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <GraduationCap size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Training Programs</h3>
                        <p className="text-sm text-gray-500 font-medium">
                            Our professional training and skill development programs are currently under development. Stay tuned for exciting updates!
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}