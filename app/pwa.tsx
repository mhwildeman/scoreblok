'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';
interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
export default function Pwa() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [standalone, setStandalone] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const applying = useRef(false);
  useEffect(() => {
    const media = matchMedia('(display-mode: standalone)');
    const sync = () => setStandalone(media.matches || !!(navigator as Navigator & {standalone?: boolean}).standalone);
    sync();
    media.addEventListener('change', sync);
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setPlatform(ios ? 'ios' : /Android/.test(navigator.userAgent) ? 'android' : 'other');
    try { setDismissed(sessionStorage.getItem('scoreblok-install-dismissed') === '1'); } catch {}
    const install = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const installed = () => { setStandalone(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', install);
    window.addEventListener('appinstalled', installed);
    return () => {
      media.removeEventListener('change', sync);
      window.removeEventListener('beforeinstallprompt', install);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);
  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') return;
    let disposed = false;
    let registration: ServiceWorkerRegistration | undefined;
    const changed = () => { if (applying.current) window.location.reload(); };
    const check = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) void registration?.update().catch(() => {});
    };
    const inspect = () => {
      if (registration?.waiting && navigator.serviceWorker.controller && !disposed) setWaiting(registration.waiting);
    };
    const found = () => {
      const worker = registration?.installing;
      worker?.addEventListener('statechange', inspect);
    };
    navigator.serviceWorker.addEventListener('controllerchange', changed);
    void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(result => {
      if (disposed) return;
      registration = result;
      inspect();
      registration.addEventListener('updatefound', found);
      found();
      check();
    }).catch(() => {});
    const timer = window.setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    window.addEventListener('online', check);
    return () => {
      disposed = true;
      clearInterval(timer);
      registration?.removeEventListener('updatefound', found);
      navigator.serviceWorker.removeEventListener('controllerchange', changed);
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('online', check);
    };
  }, []);
  async function install() {
    if (!prompt) return;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setPrompt(null);
      if (choice.outcome === 'accepted') setDismissed(true);
    } catch { setPrompt(null); }
  }
  function update() {
    setUpdateError(false);
    if (!navigator.onLine) { setUpdateError(true); return; }
    applying.current = true;
    setUpdating(true);
    if (waiting?.state === 'activated') window.location.reload();
    else waiting?.postMessage({ type: 'SKIP_WAITING' });
  }
  return <div className="pwa-notices">
    {waiting && <section className="pwa-notice" aria-label="App bijwerken"><span className="small-icon"><RefreshCw size={20}/></span><div><strong>Nieuwe versie beschikbaar</strong><p>{updateError ? 'Maak verbinding met internet en probeer het opnieuw.' : 'Werk Scoreblok bij wanneer je klaar bent met invoeren. Opgeslagen scores blijven bewaard.'}</p></div><button className="primary" onClick={update} disabled={updating}>{updating ? 'Bijwerken…' : 'Bijwerken'}</button></section>}
    {!standalone && !dismissed && (platform !== 'other' || prompt) && <section className="pwa-notice" aria-label="App installeren"><img src="/icons/icon-192.png" alt="" width="44" height="44"/><div><strong>Scoreblok als app installeren?</strong><p>Open je scoreblok vanaf je beginscherm, ook zonder internet.</p>{!prompt && <p className="install-help">{platform === 'ios' ? 'Open het deelmenu en kies ‘Zet op beginscherm’. Zie je die optie niet? Open deze pagina in Safari.' : 'Open het browsermenu en kies ‘App installeren’ of ‘Toevoegen aan startscherm’.'}</p>}</div>{prompt && <button className="primary" onClick={install}><Download size={16}/> Installeren</button>}<button className="pwa-dismiss" aria-label="Installatievraag sluiten" onClick={() => {setDismissed(true); try {sessionStorage.setItem('scoreblok-install-dismissed', '1');} catch {}}}><X size={18}/></button></section>}
  </div>;
}
