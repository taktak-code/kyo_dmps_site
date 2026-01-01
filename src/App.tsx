import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Matrix from './components/Matrix';
import DetailView from './components/DetailView';
import MarkdownViewer from './components/MarkdownViewer';
import './index.css';

function App() {
  const [view, setView] = useState<'matrix' | 'detail' | 'article'>('matrix');
  const [selectedMatchup, setSelectedMatchup] = useState<{ player: string; opponent: string } | null>(null);
  const [articleData, setArticleData] = useState<{ content: string; meta?: any } | null>(null);
  const savedScrollY = useRef(0);
  const pendingScrollRestore = useRef(false);

  // Season State
  const [seasons, setSeasons] = useState<{ id: string; name: string }[]>([]);
  const [currentSeasonId, setCurrentSeasonId] = useState<string>('');
  const [loadingSeasons, setLoadingSeasons] = useState(true);

  // Fetch Seasons
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/seasons.json`)
      .then(res => res.json())
      .then(data => {
        if (data && data.all) {
          setSeasons(data.all);
          // Use current from json, or fallback to first one (which should be current/latest logic ideally, or last one)
          // Implementation Plan says 'current' field exists.
          if (data.current) {
            setCurrentSeasonId(data.current);
          } else if (data.all.length > 0) {
            setCurrentSeasonId(data.all[data.all.length - 1].id);
          }
        }
        setLoadingSeasons(false);
      })
      .catch(err => {
        console.warn("Seasons data not found, defaulting to basic mode:", err);
        setLoadingSeasons(false);
      });
  }, []);

  // Handle scroll restoration after returning to matrix view
  useEffect(() => {
    if (view === 'matrix' && pendingScrollRestore.current) {
      // Use multiple requestAnimationFrame to ensure React has finished all updates
      // and the browser has painted the DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, savedScrollY.current);
          pendingScrollRestore.current = false;
        });
      });
    }
  }, [view]);

  const handleCellClick = (playerId: string, opponentId: string) => {
    savedScrollY.current = window.scrollY;
    setSelectedMatchup({ player: playerId, opponent: opponentId });
    setView('detail');
    // Scroll to top when entering detail view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleClick = async (path: string) => {
    try {
      savedScrollY.current = window.scrollY;
      const response = await fetch(`${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`);
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
      // Scroll to top when entering article view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading article:', error);
    }
  };

  const handleBack = () => {
    pendingScrollRestore.current = true;
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
        <Header
          onLogoClick={view !== 'matrix' ? handleBack : undefined}
          seasons={seasons}
          currentSeasonId={currentSeasonId}
          onSeasonChange={setCurrentSeasonId}
          loading={loadingSeasons}
        />

        <div id="content-area">
          {view === 'matrix' ? (
            <Matrix
              onCellClick={handleCellClick}
              onArticleClick={handleArticleClick}
              seasonId={currentSeasonId}
            />
          ) : view === 'detail' && selectedMatchup ? (
            <DetailView
              playerId={selectedMatchup.player}
              opponentId={selectedMatchup.opponent}
              onBack={handleBack}
              seasonId={currentSeasonId}
            />
          ) : view === 'article' && articleData ? (
            <MarkdownViewer
              content={articleData.content}
              onBack={handleBack}
              metadata={articleData.meta}
            />
          ) : null}
        </div>


      </div>
    </div>
  );
}

export default App;
