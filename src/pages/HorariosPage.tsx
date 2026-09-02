import { SearchEngine } from '../components/SearchEngine';
import { RoutesSection } from '../components/RoutesSection';

export function HorariosPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Consulta de Horários</span>
          <h1>Busque Passagens e Horários</h1>
          <p>Encontre a melhor opção de viagem entre as principais cidades do Sul do Brasil.</p>
        </div>
      </section>

      <section className="section" style={{ marginTop: '-3rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <SearchEngine variant="page" />
        </div>
      </section>

      <RoutesSection />
    </div>
  );
}
