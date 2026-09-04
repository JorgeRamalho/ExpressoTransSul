import { Ticket, Clock, Bookmark, MapPin, Sparkles, Compass } from 'lucide-react';
import type { AppScreenId } from '../data/appExperience';
import { appScreens } from '../data/appExperience';
import './AppPhone.css';

const screenIcons = {
  passagens: Ticket,
  horarios: Clock,
  reservas: Bookmark,
  embarques: MapPin,
  promocoes: Sparkles,
  sugestoes: Compass,
} as const;

interface AppPhoneProps {
  activeScreen: AppScreenId;
  onScreenChange?: (screen: AppScreenId) => void;
}

function screenCopy(screen: AppScreenId): { eyebrow: string; body: string; chip: string } {
  switch (screen) {
    case 'passagens':
      return { eyebrow: 'POA → FLN', body: '4 opções a partir de R$ 74,99', chip: 'Comprar' };
    case 'horarios':
      return { eyebrow: 'Próxima saída', body: '14:30 · Plataforma 12 · Catarinense', chip: 'Ao vivo' };
    case 'reservas':
      return { eyebrow: 'Reserva confirmada', body: 'Assento 12A · QR pronto para embarque', chip: '12A' };
    case 'embarques':
      return { eyebrow: 'Embarque aberto', body: 'Porto Alegre · Plat. 12 · 8 min', chip: 'Embarcar' };
    case 'promocoes':
      return { eyebrow: 'PRIMEIRA20', body: '20% OFF na primeira viagem do CPF', chip: 'Resgatar' };
    case 'sugestoes':
      return { eyebrow: 'Para você', body: 'Ilha da Magia neste fim de semana', chip: 'Explorar' };
    default: {
      const _exhaustive: never = screen;
      return _exhaustive;
    }
  }
}

export function AppPhone({ activeScreen, onScreenChange }: AppPhoneProps) {
  const Icon = screenIcons[activeScreen];
  const copy = screenCopy(activeScreen);
  const current = appScreens.find((screen) => screen.id === activeScreen) ?? appScreens[0];

  return (
    <div className="app-phone" aria-hidden={!onScreenChange}>
      <div className="app-phone__glow" />
      <div className="app-phone__device">
        <div className="app-phone__notch" />
        <div className="app-phone__screen">
          <header className="app-phone__status">
            <span>ExpressoTransSul</span>
            <span>9:41</span>
          </header>

          <div className="app-phone__hero" key={activeScreen}>
            <div className="app-phone__icon">
              <Icon size={22} />
            </div>
            <p className="app-phone__eyebrow">{copy.eyebrow}</p>
            <h3>{current.title}</h3>
            <p>{copy.body}</p>
            <span className="app-phone__chip">{copy.chip}</span>
          </div>

          <nav className="app-phone__dock" aria-label="Telas do aplicativo">
            {appScreens.map((screen) => {
              const DockIcon = screenIcons[screen.id];
              return (
                <button
                  key={screen.id}
                  type="button"
                  className={`app-phone__dock-btn ${activeScreen === screen.id ? 'app-phone__dock-btn--active' : ''}`}
                  onClick={() => onScreenChange?.(screen.id)}
                  aria-label={screen.title}
                >
                  <DockIcon size={14} />
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
