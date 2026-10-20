'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { Trophy, X } from 'lucide-react';
import { rank, type Game } from '../lib/game';

const colors = ['#dcef9e', '#285d46', '#e7b673', '#a995c4', '#78a8b3'];

export default function WinnerCelebration({ game, onClose }: { game: Game; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const ranking = rank(game);
  const winners = ranking.filter(player => player.score === ranking[0].score);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);

  return <dialog ref={dialog} className="celebration-dialog" aria-labelledby="celebration-title" aria-describedby="celebration-score" onClose={onClose}>
    <div className="confetti" aria-hidden="true">{Array.from({ length: 72 }, (_, i) => <i key={i} style={{
      '--x': `${(i * 37 + 11) % 100}%`,
      '--delay': `${(i % 12) * .12}s`,
      '--duration': `${2.8 + (i % 7) * .2}s`,
      '--drift': `${((i * 29) % 180) - 90}px`,
      '--spin': `${(i % 2 ? 1 : -1) * (360 + (i % 4) * 180)}deg`,
      backgroundColor: colors[i % colors.length],
    } as CSSProperties}/>)}</div>
    <section className="celebration-card">
      <button className="close" aria-label="Winnaarsscherm sluiten" onClick={onClose}><X size={22}/></button>
      <span className="celebration-trophy"><Trophy size={48} strokeWidth={1.5}/></span>
      <p className="eyebrow">{winners.length > 1 ? 'GEDEELDE WINST' : 'SPEL AFGELOPEN'}</p>
      <h2 id="celebration-title">{winners.map(player => player.name).join(' & ')} {winners.length > 1 ? 'winnen' : 'wint'}!</h2>
      <p id="celebration-score" className="celebration-score"><strong>{ranking[0].score}</strong> punten</p>
      <button className="primary" autoFocus onClick={onClose}>Bekijk de eindstand</button>
    </section>
  </dialog>;
}
