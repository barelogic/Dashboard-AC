// Footer component
import React from "react";

interface FooterProps {
    activeCount: number;
}

export const Footer: React.FC<FooterProps> = ({ activeCount }) => {
    return (
        <footer className="bg-white border-t border-slate-200 px-6 py-3">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-slate-500">Real-time:</span>
                        <span className="text-slate-900 font-semibold">{activeCount}</span>
                        <span className="text-slate-500">active emergencies</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-slate-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            <span className="text-xs">Fire</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="text-xs">Medical</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="text-xs">Patrol</span>
                        </div>
                    </div>
                    <span className="text-xs">© 2026 Emergency Response System</span>
                </div>
            </div>
        </footer>
    );
};
