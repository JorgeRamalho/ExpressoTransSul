import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Clock,
  Bookmark,
  MapPin,
  Sparkles,
  Compass,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import type { AppScreenId } from '../data/appExperience';
import { expressDirectRoutes } from '../data/routes';
import { promotions } from '../data/promotions';
import { travelSuggestions } from '../data/travelSuggestions';
import { AppPhone } from './AppPhone';
import './ExperienceHub.css';

const hubTabs = [
  { id: 'passagens', label: 'Passagens', icon: Ticket, to: '/passagens' },
  { id: 'horarios', label: 'Horários', icon: Clock, to: '/horarios' },
  { id: 'reservas', label: 'Reservas', icon: Bookmark, to: '/reservas' },
  { id: 'embarques', label: 'Embarques', icon: MapPin, to: '/embarques' },
  { id: 'promocoes', label: 'Promoções', icon: Sparkles, to: '/promocoes' },
  { id: 'sugestoes', label: 'Sugestões', icon: Compass, to: '/sugestoes' },
] as const;

function HubPanel({ screen }: { screen: AppScreenId }) {
  const featuredExpress = expressDirectRoutes[0];
  const featuredPromo = promotions[0];
  const featuredSuggestion = travelSuggestions[0];

  switch (screen) {
    case 'passagens':
      return (
        <>
          <h3>Compre com clareza, sem surpresa no embarque</h3>
          <p>Compare companhias, escolha assento e leve a passagem no celular.</p>
          <ul>
            <li>Preços a partir de R$ 45 nas rotas curtas do Sul</li>
            <li>Linha Direta com uma pausa de 20 minutos</li>
            <li>Filtro por leito, semi-leito e convencional</li>
          </ul>
        </>
      );
    case 'horarios':
      return (
        <>
          <h3>Grade viva das saídas do dia</h3>
          <p>Consulte o próximo ônibus e o tempo estimado até o destino.</p>
          <ul>
            <li>{featuredExpress.origin} → {featuredExpress.destination} às {featuredExpress.departures[0]}</li>
            <li>Status ao vivo nos 8 terminais parceiros</li>
            <li>Alertas de atraso antes de você sair de casa</li>
          </ul>
        </>
      );
    case 'reservas':
      return (
        <>
          <h3>Reserve o assento como quem escolhe a janela</h3>
          <p>Mapa interativo do ônibus, confirmação instantânea e QR de embarque.</p>
          <ul>
            <li>Guarde a reserva mesmo antes de pagar</li>
            <li>Troque de poltrona até 2 horas do embarque</li>
            <li>Tudo sincronizado com a Área do Cliente</li>
          </ul>
        </>
      );
    case 'embarques':
      return (
        <>
          <h3>Chegue na plataforma certa, na hora certa</h3>
          <p>Painel de embarque com portão, companhia e contagem regressiva.</p>
          <ul>
            <li>Embarque aberto com 20 minutos de antecedência</li>
            <li>Linhas Diretas identificadas no painel</li>
            <li>Sem desembarque comercial na pausa de descanso</li>
          </ul>
        </>
      );
    case 'promocoes':
      return (
        <>
          <h3>{featuredPromo.title}</h3>
          <p>{featuredPromo.description}</p>
          <ul>
            {promotions.slice(0, 3).map((promo) => (
              <li key={promo.id}>
                {promo.code} · {promo.discountLabel}
              </li>
            ))}
          </ul>
        </>
      );
    case 'sugestoes':
      return (
        <>
          <h3>{featuredSuggestion.title}</h3>
          <p>{featuredSuggestion.hook}</p>
          <ul>
            <li>Escolha o clima da viagem: praia, serra, cidade ou natureza</li>
            <li>Roteiros com Linha Direta quando o trecho permite</li>
            <li>Sugestões que mudam conforme a temporada</li>
          </ul>
        </>
      );
    default: {
      const _exhaustive: never = screen;
      return _exhaustive;
    }
  }
}

export function ExperienceHub() {
  const [screen, setScreen] = useState<AppScreenId>('passagens');
  const activeTab = hubTabs.find((tab) => tab.id === screen) ?? hubTabs[0];

  return (
    <section className="experience-hub" id="app-experiencia" aria-labelledby="experience-hub-title">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">App + viagem completa</span>
          <h2 id="experience-hub-title">Tudo o que você precisa para embarcar</h2>
          <p>
            Baixe o app ExpressoTransSul ou continue no site: passagens, horários, reservas,
            embarques, promoções e sugestões no mesmo gesto.
          </p>
        </div>

        <div className="experience-hub__shell">
          <div className="experience-hub__tabs" role="tablist" aria-label="Experiência ExpressoTransSul">
            {hubTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={screen === id}
                className={`experience-hub__tab ${screen === id ? 'experience-hub__tab--active' : ''}`}
                onClick={() => setScreen(id)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div className="experience-hub__grid">
            <div className="experience-hub__copy" role="tabpanel">
              <span className="experience-hub__kicker">
                <Smartphone size={16} />
                No app e no portal
              </span>
              <HubPanel screen={screen} />
              <div className="experience-hub__actions">
                <Link to={activeTab.to} className="btn btn-primary">
                  Abrir {activeTab.label}
                  <ArrowRight size={16} />
                </Link>
                <Link to="/app#baixar-app" className="btn btn-outline">
                  Baixar o app
                </Link>
              </div>
            </div>

            <AppPhone activeScreen={screen} onScreenChange={setScreen} />
          </div>
        </div>
      </div>
    </section>
  );
}
