import { SearchEngine } from './SearchEngine';
import { BrandFeatures } from './Logo';
import './Hero.css';

const HERO_IMAGE = '/images/hero-bus-marcopolo.png';

export function Hero() {
  return (
    <section className="hero" aria-label="Busca de passagens ExpressoTransSul">
      <div className="hero__background" aria-hidden="true">
        <img
          className="hero__bus-image"
          src={HERO_IMAGE}
          alt="Ônibus Marcopolo Volvo B420R+ azul em viagem pela estrada do Sul do Brasil"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero__overlay" />
        <div className="hero__gradient" />
      </div>

      <div className="container hero__content">
        <div className="hero__text animate-fade-in-up">
          <span className="hero__eyebrow">Portal Oficial · Região Sul</span>
          <h1>
            Sua viagem pelo <span className="hero__highlight">Sul do Brasil</span> começa aqui
          </h1>
          <p className="hero__subtitle">
            Compare passagens, consulte horários em tempo real e embarque com as melhores
            companhias de ônibus do Paraná, Santa Catarina e Rio Grande do Sul.
          </p>
        </div>

        <div className="hero__tools">
          <div className="hero__search animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchEngine variant="hero" />
          </div>

          <div className="hero__features animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <BrandFeatures />
          </div>
        </div>
      </div>

      <div className="hero__scroll-indicator" aria-hidden="true">
        <span>Explore</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
