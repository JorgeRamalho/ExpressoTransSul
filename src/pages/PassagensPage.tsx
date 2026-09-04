import { SearchEngine } from '../components/SearchEngine';
import { RoutesSection } from '../components/RoutesSection';
import { ExpressLinesSection } from '../components/ExpressLinesSection';

export function PassagensPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Passagens</span>
          <h1>Compre sua passagem com confiança</h1>
          <p>Compare horários, preços e a Linha Direta com uma única pausa de 20 minutos.</p>
        </div>
      </section>

      <section className="section" style={{ marginTop: '-3rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <SearchEngine variant="page" initialTab="passagens" />
        </div>
      </section>

      <ExpressLinesSection />
      <RoutesSection />
    </div>
  );
}
