import React from 'react';


interface Season {
    id: string;
    name: string;
}

interface HeaderProps {
    onLogoClick?: () => void;
    seasons: Season[];
    currentSeasonId?: string;
    onSeasonChange?: (seasonId: string) => void;
    loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    onLogoClick,
    seasons = [],
    currentSeasonId,
    onSeasonChange,
    loading = false
}) => {
    return (
        <header className="mb-4 flex flex-col gap-4 border-b border-slate-800 pb-3">
            <div className="flex flex-row justify-between items-end gap-2">
                <div
                    onClick={onLogoClick}
                    className={`transition-opacity ${onLogoClick ? 'cursor-pointer hover:opacity-80' : ''}`}
                >
                    <div className="bg-sky-400 text-black font-black px-1.5 py-0.5 rounded-[2px] text-[8px] md:text-[10px] italic w-fit mb-0.5 uppercase leading-none">KPDB</div>
                    <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none">Kyo Play's <span className="text-sky-400">Database</span></h1>
                </div>
                <div className="text-right flex flex-col justify-end h-full">
                    <div className="flex items-center justify-end gap-1.5 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 mb-0.5 w-fit ml-auto">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live</span>
                    </div>
                    <p className="text-[8px] md:text-[9px] text-slate-600 font-mono italic uppercase leading-none transform scale-90 origin-right">Sync: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Season Selector */}
            <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest hidden md:block">Season:</label>
                <div className="relative">
                    <select
                        value={currentSeasonId}
                        onChange={(e) => onSeasonChange?.(e.target.value)}
                        disabled={loading || seasons.length === 0}
                        className="appearance-none bg-slate-900 border border-slate-700 text-white text-xs font-bold uppercase tracking-wider py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors disabled:opacity-50 w-full md:max-w-[40vw] truncate"
                    >
                        {seasons.map(season => (
                            <option key={season.id} value={season.id}>
                                {season.name}
                            </option>
                        ))}
                        {seasons.length === 0 && <option value="">Latest Season</option>}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
