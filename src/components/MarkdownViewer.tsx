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
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
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
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export default MarkdownViewer;
