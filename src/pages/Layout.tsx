import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { StatusBar } from '../components/StatusBar';
import { Footer } from '../components/Footer';

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;

    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <>
      <Header />
      <StatusBar />
      <main style={{ paddingTop: 'calc(var(--header-height) + var(--status-bar-height))' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
