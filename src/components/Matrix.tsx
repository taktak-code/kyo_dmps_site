import React, { useEffect, useState } from 'react';
import { getCellColor } from '../utils';
import BentoGrid from './BentoGrid';
import type { Deck, WinRates } from '../types';

interface MatrixProps {
    onCellClick: (attackerId: string, defenderId: string) => void;
    onArticleClick: (path: string) => void;
}

const Matrix: React.FC<MatrixProps> = ({ onCellClick, onArticleClick }) => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [winRates, setWinRates] = useState<WinRates>({});
    const [tierListImage, setTierListImage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/matrix.json')
            .then(res => res.json())
            .then(data => {
                if (data.decks) setDecks(data.decks);
                if (data.winRates) setWinRates(data.winRates);
                if (data.tierListImage) setTierListImage(data.tierListImage);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch matrix data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center text-slate-500 py-10">Loading Matrix...</div>;
    }

    if (decks.length === 0) {
        return (
            <div
                className="space-y-8 animate-in fade-in ease-out fill-mode-forwards"
                style={{ '--tw-enter-duration': '1500ms' } as React.CSSProperties}
            >
                <BentoGrid onArticleClick={onArticleClick} tierListImage={tierListImage} />
                <div className="text-center text-slate-500 py-10 bg-slate-950 rounded-2xl border border-slate-800">
                    <p>No deck data available yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="space-y-8 animate-in fade-in ease-out fill-mode-forwards"
            style={{ '--tw-enter-duration': '1500ms' } as React.CSSProperties}
        >
            <BentoGrid onArticleClick={onArticleClick} tierListImage={tierListImage} />

            <div className="relative overflow-x-auto rounded-2xl border border-separate border-slate-800 shadow-2xl bg-slate-950">
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-900">
                            <th className="p-0 md:p-4 border-b border-r border-slate-800 sticky left-0 z-30 bg-slate-900 text-[10px] text-slate-500 font-black text-left shadow-xl whitespace-nowrap w-auto">
                                <div className="h-full flex items-center px-2 md:px-0">
                                    <span className="hidden md:inline">ATTACKER ↓</span>
                                    <span className="md:hidden">ATK</span>
                                </div>
                            </th>
                            {decks.map(deck => (
                                <th key={deck.id} className="p-4 border-b border-slate-800 min-w-[120px] text-center deck-cell-bg" style={{ backgroundImage: `url('${deck.img}')` }}>
                                    <div className="header-cell-overlay"></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-white drop-shadow-lg">{deck.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {decks.map(attacker => (
                            <tr key={attacker.id}>
                                <td className="p-0 md:p-4 border-r border-b border-slate-800 sticky left-0 z-20 font-black text-[11px] deck-cell-bg shadow-xl whitespace-nowrap"
                                    style={{ backgroundImage: `url('${attacker.img}')` }}>
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-100 z-0"></div>
                                    <div className="relative z-10 flex items-center justify-start gap-2 md:gap-3 h-full min-h-[56px] md:h-auto px-2 md:px-0 py-2 md:py-0">
                                        <span className="uppercase text-white drop-shadow-md tracking-tight text-[9px] md:text-[11px] leading-tight break-words w-full">{attacker.name}</span>
                                    </div>
                                </td>
                                {decks.map(defender => {
                                    const rate = winRates[attacker.name]?.[defender.name]; // Using name as key
                                    const isSelf = attacker.id === defender.id;
                                    if (isSelf) return <td key={defender.id} className="p-0 border-b border-slate-800/50 bg-slate-950/50"></td>;
                                    return (
                                        <td key={defender.id} className="p-0 border-b border-slate-800/50 border-r border-slate-800/20 box-border relative h-px"
                                            onClick={() => onCellClick(attacker.name, defender.name)}>
                                            <div className="absolute inset-0 flex items-center justify-center font-black text-xs cursor-pointer hover:scale-105 hover:z-20 transition-transform duration-200"
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
