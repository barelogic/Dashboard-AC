// Header component
import React from "react";

interface HeaderProps {
    isFirebaseEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isFirebaseEnabled }) => {
    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-md shadow-red-500/20">
                        <span className="text-xl">🚁</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            Emergency Drone Dashboard
                        </h1>
                        <p className="text-xs text-slate-500">Real-time Emergency Management</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isFirebaseEnabled
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${isFirebaseEnabled ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                            }`}></span>
                        {isFirebaseEnabled ? "Live" : "Demo Mode"}
                    </div>
                </div>
            </div>
        </header>
    );
};
