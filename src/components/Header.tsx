import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
            <div>
                <div className="bg-yellow-500 text-black font-black px-2 py-0.5 rounded text-xs italic w-fit mb-1 uppercase">Kyo-Pre! AI Manager</div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Meta-Matrix <span className="text-yellow-500">ND</span></h1>
            </div>
            <div className="text-right">
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Data Feed</span>
                </div>
                <p className="text-[9px] text-slate-600 font-mono italic uppercase">Last Sync: {new Date().toLocaleDateString()}</p>
            </div>
        </header>
    );
};

export default Header;
