import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ChevronLeft, Zap } from 'lucide-react';
import type { Deck, WinRates } from '../types';

interface DetailViewProps {
    playerId: string;
    opponentId: string;
    onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ playerId, opponentId, onBack }) => {
    const [insight, setInsight] = useState<string>('');
    const [decks, setDecks] = useState<Deck[]>([]);
    const [winRates, setWinRates] = useState<WinRates>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Matrix Data
        fetch('/data/matrix_latest.json')
            .then(res => res.json())
            .then(data => {
                if (data.decks) setDecks(data.decks);
                if (data.winRates) setWinRates(data.winRates);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch data:", err);
                setLoading(false);
            });
    }, []);

    // Resolve Decks
    const player = decks.find(d => d.name === playerId || d.id === playerId);
    const opponent = decks.find(d => d.name === opponentId || d.id === opponentId);

    // Mirror matchup check
    const isMirror = playerId === opponentId;

    // Resolve Rate
    let rate: number | string = 50;
    if (isMirror) {
        rate = 50; // Mirror matchup is always 50%
    } else if (player && opponent) {
        if (winRates[player.name]?.[opponent.name] !== undefined) {
            rate = winRates[player.name][opponent.name];
        } else if (winRates[player.id]?.[opponent.id] !== undefined) {
            rate = winRates[player.id][opponent.id];
        }
    }

    const numRate = typeof rate === 'string' ? parseInt(rate, 10) : rate;
    const displayRate = isNaN(numRate) ? 'No Data' : `${numRate}%`;
    const colorClass = isNaN(numRate) ? 'text-slate-500' : (numRate >= 60 ? 'text-green-400' : numRate <= 40 ? 'text-red-400' : 'text-yellow-400');


    useEffect(() => {
        if (!player || !opponent) return;

        // For mirror matchups, show special message
        if (isMirror) {
            const mirrorMarkdown = `
**<span class="flex items-center gap-2"><span class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>同型戦 (Mirror Match)</span>**

- <span class="text-yellow-500 font-black text-lg">01.</span> <div><strong class="text-slate-100 block mb-1">同型戦について</strong>同じデッキタイプ同士の対戦です。お互いの構築やプレイングの質が勝敗を分けます。</div>
`;
            setInsight(mirrorMarkdown);
            return;
        }

        // Try to fetch guide from json
        fetch('/data/guides_latest.json')
            .then(res => res.json())
            .then(async (data) => {
                const guide = data.items.find((item: any) =>
                    item.player === player.name && item.opponent === opponent.name
                );

                if (guide) {
                    try {
                        const mdRes = await fetch(guide.path);
                        const mdText = await mdRes.text();
                        setInsight(mdText);
                    } catch (e) {
                        setInsight("Failed to load guide content.");
                    }
                } else {
                    const mockMarkdown = `
**<span class="flex items-center gap-2"><span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>競技調整チーム・分析ログ</span>**

- <span class="text-yellow-500 font-black text-lg">01.</span> <div><strong class="text-slate-100 block mb-1">Guide Not Found</strong>まだこのマッチアップのガイドは投稿されていません。</div>
`;
                    setInsight(mockMarkdown);
                }
            })
            .catch(() => {
                const mockMarkdown = `
**<span class="flex items-center gap-2"><span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>競技調整チーム・分析ログ</span>**

- <span class="text-yellow-500 font-black text-lg">01.</span> <div><strong class="text-slate-100 block mb-1">Guide Not Found</strong>まだこのマッチアップのガイドは投稿されていません。</div>
`;
                setInsight(mockMarkdown);
            });
    }, [player, opponent, isMirror]);


    if (loading) return <div className="text-white text-center py-20 animate-pulse">Loading data...</div>;

    if (!player || !opponent) {
        return (
            <div className="text-white text-center py-20">
                <p>Data not found for decision.</p>
                <div className="text-xs text-slate-500 mt-2">
                    Player: {playerId} ({player ? 'Found' : 'Missing'})<br />
                    Opponent: {opponentId} ({opponent ? 'Found' : 'Missing'})
                </div>
                <button onClick={onBack} className="mt-4 text-blue-400 hover:underline">Back to Matrix</button>
            </div>
        );
    }

    return (
        <div
            className="animate-in fade-in ease-in fill-mode-forwards"
            style={{ '--tw-enter-duration': '3500ms' } as React.CSSProperties}
        >
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                <ChevronLeft size={16} /> Back to Matrix
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Matchup Banner */}
                <div className="lg:col-span-3 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-around gap-12 text-white shadow-2xl relative overflow-hidden border border-slate-700">
                    <div className="absolute inset-0 bg-slate-900 opacity-90 z-0"></div>
                    <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('${player.img}')` }}></div>

                    <div className="text-center relative z-10 hidden md:block">
                        <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-slate-700 bg-cover bg-center"
                            style={{ backgroundImage: `url('${player.img}')` }}>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">{player.name}</h2>
                        <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Player Side</span>
                    </div>

                    <div className="text-center relative z-10 bg-slate-950/50 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <div className={`text-7xl font-black mb-1 ${colorClass}`}>
                            {displayRate}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Predicted Edge</div>
                    </div>

                    <div className="text-center relative z-10 hidden md:block">
                        <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-slate-700 bg-cover bg-center"
                            style={{ backgroundImage: `url('${opponent.img}')` }}>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">{opponent.name}</h2>
                        <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Opponent Side</span>
                    </div>
                </div>

                {/* Analysis */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
                            <span className="text-yellow-500">
                                <Zap size={20} fill="currentColor" />
                            </span>
                            Tactical Insight
                        </h3>
                        <div className="p-6 bg-slate-900 rounded-xl border border-slate-700 text-sm text-slate-300 leading-relaxed shadow-inner">
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    // Customize markdown rendering if needed
                                    strong: ({ node, ...props }) => <strong className="font-bold text-white block mb-4 border-b border-slate-700 pb-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="flex gap-4 mb-4" {...props} />,
                                    span: ({ node, ...props }) => <span {...props} />,
                                    div: ({ node, ...props }) => <div {...props} />
                                }}
                            >
                                {insight}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailView;
