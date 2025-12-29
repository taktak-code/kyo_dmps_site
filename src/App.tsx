import { useState } from 'react';
import Header from './components/Header';
import Matrix from './components/Matrix';
import DetailView from './components/DetailView';
import './index.css';

function App() {
  const [view, setView] = useState<'matrix' | 'detail'>('matrix');
  const [selectedMatchup, setSelectedMatchup] = useState<{ attacker: string; defender: string } | null>(null);

  const handleCellClick = (attackerId: string, defenderId: string) => {
    setSelectedMatchup({ attacker: attackerId, defender: defenderId });
    setView('detail');
  };

  const handleBack = () => {
    setView('matrix');
    setSelectedMatchup(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div id="content-area">
          {view === 'matrix' ? (
            <Matrix onCellClick={handleCellClick} />
          ) : (
            selectedMatchup && (
              <DetailView
                attackerId={selectedMatchup.attacker}
                defenderId={selectedMatchup.defender}
                onBack={handleBack}
              />
            )
          )}
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
