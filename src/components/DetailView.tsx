import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ChevronLeft, Zap } from 'lucide-react';
import { getAssetPath } from '../utils';
import type { Deck, WinRates } from '../types';

interface DetailViewProps {
    playerId: string;
    opponentId: string;
    onBack: () => void;
    seasonId?: string;
}

const DetailView: React.FC<DetailViewProps> = ({ playerId, opponentId, onBack, seasonId }) => {
    const [insight, setInsight] = useState<string>('');
    const [decks, setDecks] = useState<Deck[]>([]);
    const [winRates, setWinRates] = useState<WinRates>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let path = `${import.meta.env.BASE_URL}data/matrix_latest.json`;
        if (seasonId) {
            path = `${import.meta.env.BASE_URL}data/archives/${seasonId}/matrix.json`;
        }

        setLoading(true);
        // Fetch Matrix Data
        fetch(path)
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
    }, [seasonId]);

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
**<span className="flex items-center gap-2"><span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>同型戦 (Mirror Match)</span>**

- <span className="text-sky-400 font-black text-lg">01.</span> <div><strong className="text-slate-100 block mb-1">同型戦について</strong>同じデッキタイプ同士の対戦です。お互いの構築やプレイングの質が勝敗を分けます。</div>
`;
            setInsight(mirrorMarkdown);
            return;
        }

        // Try to fetch guide from json
        fetch(`${import.meta.env.BASE_URL}data/guides_latest.json`)
            .then(res => res.json())
            .then(async (data) => {
                const guide = data.items.find((item: any) =>
                    item.player === player.name && item.opponent === opponent.name
                );

                if (guide) {
                    try {
                        const mdRes = await fetch(`${import.meta.env.BASE_URL}${guide.path.replace(/^\//, '')}`);
                        const mdText = await mdRes.text();
                        setInsight(mdText);
                    } catch (e) {
                        setInsight("Failed to load guide content.");
                    }
                } else {
                    const mockMarkdown = `
**<span class="flex items-center gap-2"><span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>競技調整チーム・分析ログ</span>**

- <span class="text-sky-400 font-black text-lg">01.</span> <div><strong class="text-slate-100 block mb-1">Guide Not Found</strong>まだこのマッチアップのガイドは投稿されていません。</div>
`;
                    setInsight(mockMarkdown);
                }
            })
            .catch(() => {
                const mockMarkdown = `
**<span class="flex items-center gap-2"><span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>競技調整チーム・分析ログ</span>**

- <span class="text-sky-400 font-black text-lg">01.</span> <div><strong class="text-slate-100 block mb-1">Guide Not Found</strong>まだこのマッチアップのガイドは投稿されていません。</div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 -mx-2 md:mx-0">
                {/* Matchup Banner */}
                <div className="lg:col-span-3 rounded-2xl p-5 md:p-10 flex flex-col md:flex-row items-center justify-around gap-6 md:gap-12 text-white shadow-2xl relative overflow-hidden border border-slate-700 bg-slate-900">
                    <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('${getAssetPath(player.img)}')` }}></div>

                    {/* Mobile Header: Icon - Rate - Icon (Horizontal) */}
                    <div className="md:hidden relative w-full h-32 my-4">
                        {/* Icons Layer: Fixed 15% and 85% positioning */}
                        <div className="absolute inset-0">
                            {/* Player Icon: Left 15% */}
                            <div className="absolute top-1/2 left-[15%] -translate-y-1/2 -translate-x-1/2 z-0">
                                <div className="w-32 h-32 rounded-full border-4 border-slate-600 bg-cover bg-center shadow-lg"
                                    style={{ backgroundImage: `url('${getAssetPath(player.img)}')` }}>
                                </div>
                            </div>
                            {/* Opponent Icon: Right 15% (Left 85%) */}
                            <div className="absolute top-1/2 right-[15%] -translate-y-1/2 translate-x-1/2 z-0">
                                <div className="w-32 h-32 rounded-full border-4 border-slate-600 bg-cover bg-center shadow-lg"
                                    style={{ backgroundImage: `url('${getAssetPath(opponent.img)}')` }}>
                                </div>
                            </div>
                        </div>

                        {/* Rate Layer: Absolute Center Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                            <div className={`text-5xl font-black ${colorClass} whitespace-nowrap drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-none text-stroke`}>
                                {displayRate}
                            </div>
                            <div className="text-[10px] font-bold tracking-widest text-slate-400 mt-1 drop-shadow-md bg-slate-900/40 px-2 rounded-full backdrop-blur-sm">
                                WIN RATE
                            </div>
                        </div>
                    </div>

                    {/* Desktop View (Preserved) */}
                    <div className="text-center relative z-10 hidden md:block">
                        <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-slate-700 bg-cover bg-center"
                            style={{ backgroundImage: `url('${getAssetPath(player.img)}')` }}>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">{player.name}</h2>
                        <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Player Side</span>
                    </div>

                    <div className="text-center relative z-10 hidden md:block bg-slate-950/50 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <div className={`text-7xl font-black ${colorClass} whitespace-nowrap`}>
                            {displayRate}
                        </div>
                        <div className="text-[10px] font-bold tracking-widest text-slate-400 mt-2">WIN RATE</div>
                    </div>

                    <div className="text-center relative z-10 hidden md:block">
                        <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-slate-700 bg-cover bg-center"
                            style={{ backgroundImage: `url('${getAssetPath(opponent.img)}')` }}>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">{opponent.name}</h2>
                        <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Opponent Side</span>
                    </div>
                </div>

                {/* Analysis */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-slate-800 rounded-2xl p-5 md:p-6 border border-slate-700">
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2 uppercase tracking-tight">
                            <span className="text-sky-400">
                                <Zap size={20} fill="currentColor" />
                            </span>
                            Tactical Insight
                        </h3>
                        <div className="text-sm md:text-base text-slate-300 leading-relaxed prose prose-invert prose-sm md:prose-base max-w-none">
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    // Headings - different left bar colors per level
                                    h1: ({ node, ...props }) => (
                                        <h1 className="text-3xl md:text-4xl font-bold text-white mt-10 mb-5 pl-4 border-l-4 border-sky-400" {...props} />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4 pl-4 border-l-4 border-blue-400" {...props} />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3 className="text-lg md:text-xl font-bold text-white mt-6 mb-3 pl-3 border-l-4 border-indigo-400" {...props} />
                                    ),
                                    h4: ({ node, ...props }) => (
                                        <h4 className="text-base md:text-lg font-semibold text-slate-100 mt-5 mb-2 pl-3 border-l-2 border-violet-400/70" {...props} />
                                    ),
                                    // Paragraphs
                                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-slate-300" {...props} />,
                                    // Lists - subtle blue accents
                                    ul: ({ node, ...props }) => <ul className="mb-4 space-y-2 ml-4 list-none" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="mb-4 space-y-2 ml-4 list-decimal list-inside marker:text-sky-400" {...props} />,
                                    li: ({ node, ...props }) => (
                                        <li className="text-slate-300 leading-relaxed flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                                            <span {...props} />
                                        </li>
                                    ),
                                    // Emphasis
                                    strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                    em: ({ node, ...props }) => <em className="italic text-sky-200" {...props} />,
                                    // Code - sky accents
                                    code: ({ node, ...props }) => <code className="bg-slate-800/80 text-sky-400 px-1.5 py-0.5 rounded text-sm font-mono border border-sky-500/20" {...props} />,
                                    pre: ({ node, ...props }) => <pre className="bg-slate-900 p-4 rounded-xl overflow-x-auto mb-4 border border-sky-500/20 shadow-lg shadow-sky-500/5" {...props} />,
                                    // Blockquote - prominent blue styling
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote className="border-l-4 border-sky-400 pl-4 py-3 my-4 bg-gradient-to-r from-sky-500/10 to-transparent rounded-r-lg text-slate-300" {...props} />
                                    ),
                                    // Links
                                    a: ({ node, ...props }) => <a className="text-sky-400 hover:text-sky-300 underline decoration-sky-400/50 hover:decoration-sky-300 transition-colors" {...props} />,
                                    // Tables - blue accents
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-4">
                                            <table className="min-w-full border-collapse rounded-lg overflow-hidden" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="bg-sky-500/20" {...props} />,
                                    th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-sky-300 font-semibold border-b border-sky-500/30" {...props} />,
                                    td: ({ node, ...props }) => <td className="px-4 py-3 border-b border-slate-700/50 text-slate-300" {...props} />,
                                    tr: ({ node, ...props }) => <tr className="hover:bg-sky-500/5 transition-colors" {...props} />,
                                    // Images - apply getAssetPath and constrain height
                                    img: ({ node, src, alt, ...props }) => (
                                        <img
                                            src={src ? getAssetPath(src) : ''}
                                            alt={alt || 'image'}
                                            style={{ maxHeight: '200px', width: 'auto' }}
                                            className="mx-auto my-4 rounded-lg object-contain border border-sky-500/20 shadow-lg shadow-sky-500/10"
                                            {...props}
                                        />
                                    ),
                                    // Horizontal rule
                                    hr: ({ node, ...props }) => <hr className="border-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent my-8" {...props} />,
                                    // Generic elements
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
