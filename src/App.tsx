import { useState } from 'react';
import Header from './components/Header';
import Matrix from './components/Matrix';
import DetailView from './components/DetailView';
import MarkdownViewer from './components/MarkdownViewer';
import './index.css';

function App() {
  const [view, setView] = useState<'matrix' | 'detail' | 'article'>('matrix');
  const [selectedMatchup, setSelectedMatchup] = useState<{ attacker: string; defender: string } | null>(null);
  const [articleData, setArticleData] = useState<{ content: string; meta?: any } | null>(null);

  const handleCellClick = (attackerId: string, defenderId: string) => {
    setSelectedMatchup({ attacker: attackerId, defender: defenderId });
    setView('detail');
  };

  const handleArticleClick = async (path: string) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error('Failed to load markdown');
      const text = await response.text();
      setArticleData({
        content: text,
        meta: {
          // For now, these are placeholder metadata since we don't parse frontmatter yet
          title: "New Article",
          date: new Date().toISOString().split('T')[0],
          category: "Updates"
        }
      });
      setView('article');
    } catch (error) {
      console.error('Error loading article:', error);
    }
  };

  const handleBack = () => {
    setView('matrix');
    setSelectedMatchup(null);
    setArticleData(null);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Navigate back if clicking the background while in detail/article view
    if (view !== 'matrix' && e.target === e.currentTarget) {
      handleBack();
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8"
      onClick={handleBackgroundClick}
    >
      <div className="max-w-7xl mx-auto" onClick={handleBackgroundClick}>
        <Header onLogoClick={view !== 'matrix' ? handleBack : undefined} />

        <div id="content-area">
          {view === 'matrix' ? (
            <Matrix onCellClick={handleCellClick} onArticleClick={handleArticleClick} />
          ) : view === 'detail' && selectedMatchup ? (
            <DetailView
              attackerId={selectedMatchup.attacker}
              defenderId={selectedMatchup.defender}
              onBack={handleBack}
            />
          ) : view === 'article' && articleData ? (
            <MarkdownViewer
              content={articleData.content}
              onBack={handleBack}
              metadata={articleData.meta}
            />
          ) : null}
        </div>

        <footer className="mt-24 border-t border-slate-900 pt-10 pb-20 text-center">
          <p className="text-[10px] text-slate-600 font-black tracking-[0.3em] uppercase">
            Kyopure Strategic Interface // Visual Analytics
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
