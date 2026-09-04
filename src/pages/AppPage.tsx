import { AppDownloadSection } from '../components/AppDownloadSection';
import { ExperienceHub } from '../components/ExperienceHub';

export function AppPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Aplicativo ExpressoTransSul</span>
          <h1>Baixe o app e viaje com mais leveza</h1>
          <p>
            A mesma experiência sofisticada do portal — passagens, reservas, horários,
            embarques, promoções e sugestões — no seu celular.
          </p>
        </div>
      </section>
      <AppDownloadSection />
      <ExperienceHub />
    </div>
  );
}
