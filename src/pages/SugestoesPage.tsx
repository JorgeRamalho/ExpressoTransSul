import { TravelSuggestions } from '../components/TravelSuggestions';
import { ExpressLinesSection } from '../components/ExpressLinesSection';

export function SugestoesPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Inspiração de viagem</span>
          <h1>Sugestões que entendem o seu ritmo</h1>
          <p>Praia, serra, cidade ou natureza — escolha o clima e encontre o trecho certo no Sul.</p>
        </div>
      </section>
      <TravelSuggestions />
      <ExpressLinesSection />
    </div>
  );
}
