import React, { useEffect, useState } from 'react';
import { BookOpen, FileText, ArrowUpRight, Play, Maximize2, X } from 'lucide-react';

interface BentoGridProps {
    onArticleClick: (path: string) => void;
}

interface NoteItem {
    title: string;
    link: string;
    pubDate: string;
    thumbnail: string;
}

interface YouTubeItem {
    title: string;
    link: string;
    pubDate: string;
    thumbnail: string;
}

const BentoGrid: React.FC<BentoGridProps> = ({ onArticleClick }) => {
    const [noteArticle, setNoteArticle] = useState<NoteItem | null>(null);
    const [youtubeVideo, setYoutubeVideo] = useState<YouTubeItem | null>(null);
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);

    // Default fallback article
    const [latestArticle, setLatestArticle] = useState({
        title: "Bot Development: New Features",
        date: "2025-12-29",
        category: "Tech",
        path: "/src/assets/markdowns/tech/sample.md",
        summary: "Exploring the new architecture of the KyoPre Bot."
    });

    const defaultNoteImage = 'https://assets.st-note.com/production/uploads/images/logo_gray.png';
    const tierListImage = '/data/tier_list.jpg';

    useEffect(() => {
        // Fetch Guides JSON for Latest Article
        fetch('/data/guides.json')
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const guide = data.items[0];
                    setLatestArticle({
                        title: guide.title,
                        date: guide.date,
                        category: guide.category,
                        path: guide.path,
                        summary: guide.summary
                    });
                }
            })
            .catch(error => console.log('No specific guides found, using default.'));

        // Fetch Note JSON
        fetch('/data/note_latest.json')
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const latestItem = data.items[0];
                    setNoteArticle({
                        title: latestItem.title,
                        link: latestItem.link,
                        pubDate: new Date(latestItem.pubDate).toLocaleDateString(),
                        thumbnail: latestItem.thumbnail || defaultNoteImage
                    });
                }
            })
            .catch(error => console.error('Error fetching note data:', error));

        // Fetch YouTube JSON
        fetch('/data/youtube_latest.json')
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const latestItem = data.items[0];
                    setYoutubeVideo({
                        title: latestItem.title,
                        link: latestItem.link,
                        pubDate: new Date(latestItem.pubDate).toLocaleDateString(),
                        thumbnail: latestItem.thumbnail
                    });
                }
            })
            .catch(error => console.error('Error fetching youtube data:', error));
    }, []);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 min-h-[400px] animate-in fade-in duration-700 delay-100">

                {/* 1. Left Column: Tier List Card (Span 1, Row Span 2) */}
                <div
                    onClick={() => setIsTierModalOpen(true)}
                    className="group relative md:col-span-1 md:row-span-2 rounded-3xl overflow-hidden cursor-pointer border border-slate-800 bg-slate-900 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 h-[400px] md:h-auto"
                >
                    <div className="absolute inset-0 bg-slate-950 z-0">
                        <img
                            src={tierListImage}
                            alt="Tier List"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            onError={(e) => e.currentTarget.src = 'https://placehold.co/600x400/1e293b/475569?text=No+Tier+Image'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-end p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                                <Maximize2 size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-500/30">Tier List</span>
                        </div>
                        <h3 className="text-xl font-black text-white leading-tight mb-1 drop-shadow-md">
                            Latest Meta Tier List
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">Click to expand • Updated via Bot</p>
                    </div>
                </div>

                {/* 2. Top Right: YouTube Card (Span 2) */}
                <div className="relative md:col-span-2 md:row-span-1 h-[200px] rounded-3xl overflow-hidden border border-slate-800 bg-black group hover:shadow-xl hover:shadow-red-500/10 hover:border-red-500/40 transition-all duration-300">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed?listType=playlist&list=UUS4F08LO6Xl1eAULwe3KD-w"
                        title="Latest Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    ></iframe>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-4 left-5 pointer-events-none">
                        <div className="flex items-center gap-2 text-red-500 mb-1">
                            <Play size={14} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Latest Video</span>
                        </div>
                        {youtubeVideo && (
                            <div className="max-w-md">
                                <h3 className="text-lg font-bold text-white leading-tight line-clamp-1 drop-shadow-md">
                                    {youtubeVideo.title}
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">{youtubeVideo.pubDate}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Bottom Center: Tech/Markdown Card (Span 1) */}
                <div
                    onClick={() => onArticleClick(latestArticle.path)}
                    className="group relative md:col-span-1 md:row-span-1 h-[180px] rounded-3xl overflow-hidden cursor-pointer border border-slate-800 bg-slate-900 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/40"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950"></div>
                    <div className="relative h-full flex flex-col justify-between p-5">
                        <div className="flex justify-between items-start">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/10">
                                <FileText size={10} />
                                {latestArticle.category}
                            </span>
                            <ArrowUpRight size={14} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white leading-tight mb-2 group-hover:text-purple-200 transition-colors line-clamp-2">
                                {latestArticle.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <span>{latestArticle.date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Bottom Right: Note Card (Span 1) */}
                <a
                    href={noteArticle ? noteArticle.link : "https://note.com/kyo_dmps"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative md:col-span-1 md:row-span-1 h-[180px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:border-green-500/40"
                >
                    {noteArticle ? (
                        <>
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={noteArticle.thumbnail}
                                    alt={noteArticle.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = defaultNoteImage;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-between p-5">
                                <div className="flex justify-between items-start">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-green-900/80 text-green-300 border border-green-500/20 backdrop-blur-sm">
                                        <BookOpen size={10} />
                                        Note
                                    </span>
                                    <ArrowUpRight size={14} className="text-slate-400 group-hover:text-green-400 transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white leading-tight mb-1 line-clamp-2 group-hover:text-green-100 transition-colors">
                                        {noteArticle.title}
                                    </h3>
                                    <span className="text-[10px] text-slate-400">{noteArticle.pubDate}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="relative h-full flex flex-col justify-center items-center p-5 text-center">
                            <BookOpen size={24} className="text-slate-700 mb-2" />
                            <p className="text-xs text-slate-500">Loading Note...</p>
                        </div>
                    )}
                </a>
            </div>

            {/* Tier List Modal */}
            {isTierModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
                    <div
                        className="absolute inset-0"
                        onClick={() => setIsTierModalOpen(false)}
                    ></div>
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="bg-blue-600 text-white p-1 rounded">
                                    <Maximize2 size={14} />
                                </div>
                                Tier List
                            </h3>
                            <button
                                onClick={() => setIsTierModalOpen(false)}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-2 bg-black flex items-center justify-center">
                            <img
                                src={tierListImage}
                                alt="Tier List Full"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BentoGrid;
