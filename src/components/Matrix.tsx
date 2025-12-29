import React from 'react';
import { DECK_DATA, WIN_RATES } from '../data/mock';
import { getCellColor } from '../utils';

interface MatrixProps {
    onCellClick: (attackerId: string, defenderId: string) => void;
}

const Matrix: React.FC<MatrixProps> = ({ onCellClick }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Dominant Deck</p>
                    <p className="text-sm font-black">アウトレイジ</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Aggro King</p>
                    <p className="text-sm font-black">赤白アポロ</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Peak Win Rate</p>
                    <p className="text-sm font-black text-green-400">リンネ (54.8%)</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-600"></div>
                    <div className="w-3 h-3 rounded bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded bg-red-700"></div>
                    <span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">Win Grade</span>
                </div>
            </div>

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
        </div>
    );
};

export default Matrix;
