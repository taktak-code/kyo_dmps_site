import React from 'react';

interface HeaderProps {
    onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
    return (
        <header className="mb-4 flex flex-row justify-between items-end gap-2 border-b border-slate-800 pb-3">
            <div
                onClick={onLogoClick}
                className={`transition-opacity ${onLogoClick ? 'cursor-pointer hover:opacity-80' : ''}`}
            >
                <div className="bg-sky-400 text-black font-black px-1.5 py-0.5 rounded-[2px] text-[8px] md:text-[10px] italic w-fit mb-0.5 uppercase leading-none">Kyo-Pre! AI Manager</div>
                <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none">Kyo Play's <span className="text-sky-400">Portal</span></h1>
            </div>
            <div className="text-right flex flex-col justify-end h-full">
                <div className="flex items-center justify-end gap-1.5 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 mb-0.5 w-fit ml-auto">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live</span>
                </div>
                <p className="text-[8px] md:text-[9px] text-slate-600 font-mono italic uppercase leading-none transform scale-90 origin-right">Sync: {new Date().toLocaleDateString()}</p>
            </div>
        </header>
    );
};

export default Header;
