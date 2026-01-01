import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

interface MarkdownViewerProps {
    content: string;
    onBack: () => void;
    metadata?: {
        title?: string;
        date?: string;
        category?: string;
    };
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, onBack, metadata }) => {
    return (
        <div
            className="animate-in fade-in ease-in fill-mode-forwards"
            style={{ '--tw-enter-duration': '3500ms' } as React.CSSProperties}
        >
            <button
                onClick={onBack}
                className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-200 mb-6 transition-colors pl-1"
            >
                <div className="p-1.5 rounded-full bg-slate-900 border border-slate-800 group-hover:border-slate-600 transition-colors">
                    <ArrowLeft size={14} />
                </div>
                <span>BACK TO DASHBOARD</span>
            </button>

            <article className="bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">
                {(metadata?.title || metadata?.date) && (
                    <div className="border-b border-slate-900 bg-slate-900/30 p-8 pb-6">
                        {metadata.category && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                    <Tag size={10} />
                                    {metadata.category}
                                </span>
                            </div>
                        )}
                        {metadata.title && (
                            <h1 className="text-3xl md:text-4xl font-black text-slate-100 mb-4 leading-tight tracking-tight">
                                {metadata.title}
                            </h1>
                        )}
                        {metadata.date && (
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                <Calendar size={14} />
                                <time>{metadata.date}</time>
                            </div>
                        )}
                    </div>
                )}

                <div className="p-6 md:p-10 prose prose-invert prose-slate max-w-none prose-headings:font-black prose-a:text-blue-400 prose-img:rounded-xl prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-white mt-8 mb-4 border-b border-slate-800 pb-2" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-black text-white mt-10 mb-6 flex items-center gap-3 before:content-[''] before:w-1.5 before:h-8 before:bg-sky-400 before:rounded-full before:shadow-[0_0_10px_rgba(56,189,248,0.5)]" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-slate-200 mt-8 mb-4 border-l-4 border-blue-500/50 pl-3" {...props} />,
                            p: ({ node, ...props }) => <p className="text-slate-400 leading-relaxed mb-6" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-none space-y-4 mb-8" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-4 mb-8 marker:text-sky-400 marker:font-black marker:text-lg" {...props} />,
                            li: ({ node, ...props }) => (
                                <li className="relative pl-4 border-l border-slate-800/50 hover:border-slate-700 transition-colors" {...props} />
                            ),
                            strong: ({ node, ...props }) => <strong className="text-slate-100 font-bold bg-slate-900/50 px-1 rounded mx-0.5 border border-slate-800" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-slate-700 bg-slate-900/30 p-4 rounded-r-lg italic text-slate-400 my-6" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-slate-900 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-800" {...props} />,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export default MarkdownViewer;
