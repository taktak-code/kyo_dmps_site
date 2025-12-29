import React, { useEffect, useState } from 'react';
import { DECK_DATA, WIN_RATES } from '../data/mock';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ChevronLeft, Zap } from 'lucide-react';

interface DetailViewProps {
    attackerId: string;
    defenderId: string;
    onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ attackerId, defenderId, onBack }) => {
    const [insight, setInsight] = useState<string>('');

    const attacker = DECK_DATA.find(d => d.id === attackerId);
    const defender = DECK_DATA.find(d => d.id === defenderId);
    const rate = WIN_RATES[attackerId]?.[defenderId] || 50;

    useEffect(() => {
        // Find deck names for matching
        const attackerName = attacker?.name;
        const defenderName = defender?.name;

        if (!attackerName || !defenderName) return;

        // Try to fetch guide from json
        fetch('/data/guides.json')
            .then(res => res.json())
            .then(async (data) => {
                const guide = data.items.find((item: any) =>
                    item.attacker === attackerName && item.defender === defenderName
                );

                if (guide) {
                    // Fetch real markdown
                    try {
                        const mdRes = await fetch(guide.path);
                        const mdText = await mdRes.text();
                        setInsight(mdText);
                    } catch (e) {
                        console.error("Failed to load guide markdown", e);
                        setInsight("Failed to load guide content.");
                    }
                } else {
                    // Fallback to mock if no guide found
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

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [attackerId, defenderId, attacker, defender]);

    if (!attacker || !defender) return <div>Data not found</div>;

    return (
        <div className="animate-in fade-in slide-in-from-right duration-300">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                <ChevronLeft size={16} /> Back to Matrix
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Matchup Banner */}
                <div className="lg:col-span-3 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-around gap-12 text-white shadow-2xl relative overflow-hidden border border-slate-700">
                    <div className="absolute inset-0 bg-slate-900 opacity-90 z-0"></div>
                    <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('${attacker.img}')` }}></div>

                    <div className="text-center relative z-10 hidden md:block">
                        <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-slate-700 bg-cover bg-center"
                            style={{ backgroundImage: `url('${attacker.img}')` }}>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">{attacker.name}</h2>
                        <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Attacker Side</span>
                    </div>

                    <div className="text-center relative z-10 bg-slate-950/50 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <div className={`text-7xl font-black mb-1 ${rate >= 60 ? 'text-green-400' : rate <= 40 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {rate}%
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Predicted Edge</div>
                    </div>

                    <div className="text-center relative z-10 hidden md:block">
                        <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-slate-700 bg-cover bg-center"
                            style={{ backgroundImage: `url('${defender.img}')` }}>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">{defender.name}</h2>
                        <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Defender Side</span>
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
