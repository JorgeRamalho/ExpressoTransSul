import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { StatusBar } from '../components/StatusBar';
import { Footer } from '../components/Footer';

export function Layout() {
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
