import { RoutesSection } from '../components/RoutesSection';
import { ExpressLinesSection } from '../components/ExpressLinesSection';

export function DestinosPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Explore o Sul</span>
          <h1>Destinos Populares</h1>
          <p>Rotas clássicas e caminhos diretos entre as cidades que você já conhece na malha.</p>
        </div>
      </section>
      <ExpressLinesSection />
      <RoutesSection />
    </div>
  );
}
