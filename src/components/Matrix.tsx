import React from 'react';
import { DECK_DATA, WIN_RATES } from '../data/mock';
import { getCellColor } from '../utils';
import BentoGrid from './BentoGrid';

interface MatrixProps {
    onCellClick: (attackerId: string, defenderId: string) => void;
    onArticleClick: (path: string) => void;
}

const Matrix: React.FC<MatrixProps> = ({ onCellClick, onArticleClick }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <BentoGrid onArticleClick={onArticleClick} />

            <div className="relative overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl bg-slate-950">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-900">
                            <th className="p-4 border-b border-r border-slate-800 sticky left-0 z-30 min-w-[160px] bg-slate-900 text-[10px] text-slate-500 font-black text-left">
                                ATTACKER ↓
                            </th>
                            {DECK_DATA.map(deck => (
                                <th key={deck.id} className="p-4 border-b border-slate-800 min-w-[120px] text-center deck-cell-bg" style={{ backgroundImage: `url('${deck.img}')` }}>
                                    <div className="header-cell-overlay"></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: deck.color }}></div>
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-white drop-shadow-lg">{deck.name}</span>
                                        <span className="text-[9px] text-slate-300 font-bold">{deck.share}%</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DECK_DATA.map(attacker => (
                            <tr key={attacker.id}>
                                <td className="p-4 border-r border-b border-slate-800 sticky left-0 z-10 font-black text-[11px] deck-cell-bg"
                                    style={{ backgroundImage: `url('${attacker.img}')` }}>
                                    <div className="deck-cell-overlay"></div>
                                    <div className="relative z-10 flex items-center gap-3">
                                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: attacker.color }}></div>
                                        <span className="uppercase text-white drop-shadow-md tracking-tight">{attacker.name}</span>
                                    </div>
                                </td>
                                {DECK_DATA.map(defender => {
                                    const rate = WIN_RATES[attacker.id]?.[defender.id];
                                    const isSelf = attacker.id === defender.id;
                                    if (isSelf) return <td key={defender.id} className="p-0 border-b border-slate-800/50 bg-slate-950/50"></td>;
                                    return (
                                        <td key={defender.id} className="p-0 border-b border-slate-800/50 border-r border-slate-800/20"
                                            onClick={() => onCellClick(attacker.id, defender.id)}>
                                            <div className="w-full h-14 flex items-center justify-center font-black text-xs cursor-pointer hover:scale-105 hover:z-20 transition-transform duration-200"
                                                style={{ backgroundColor: getCellColor(rate) }}>
                                                {rate || '-'}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default Matrix;
