import { Bus, MapPin, Clock, Shield, Wifi, Users } from 'lucide-react';
import './Logo.css';

interface LogoProps {
  variant?: 'full' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

export function Logo({ variant = 'full', size = 'md', light = false }: LogoProps) {
  const sizeClass = `logo--${size}`;
  const colorClass = light ? 'logo--light' : '';

  if (variant === 'icon') {
    return (
      <div className={`logo logo--icon ${sizeClass} ${colorClass}`} aria-label="ExpressoTransSul">
        <div className="logo__emblem">
          <Bus className="logo__bus-icon" strokeWidth={2.5} />
          <div className="logo__emblem-ring" />
        </div>
      </div>
    );
  }

  return (
    <div className={`logo ${sizeClass} ${colorClass}`} aria-label="ExpressoTransSul">
      <div className="logo__emblem">
        <Bus className="logo__bus-icon" strokeWidth={2.5} />
        <div className="logo__emblem-ring" />
      </div>
      {variant === 'full' && (
        <div className="logo__text">
          <span className="logo__brand">Expresso</span>
          <span className="logo__brand-accent">TransSul</span>
          <span className="logo__tagline">Região Sul do Brasil</span>
        </div>
      )}
      {variant === 'compact' && (
        <div className="logo__text logo__text--compact">
          <span className="logo__brand">Expresso</span>
          <span className="logo__brand-accent">TransSul</span>
        </div>
      )}
    </div>
  );
}

export function BrandFeatures() {
  const features = [
    { icon: MapPin, label: '18+ Companhias', desc: 'Parceiras no Sul' },
    { icon: Clock, label: 'Horários em Tempo Real', desc: 'Terminais atualizados' },
    { icon: Shield, label: 'Compra Segura', desc: 'Pagamento protegido' },
    { icon: Wifi, label: 'Wi-Fi a Bordo', desc: 'Conectividade total' },
    { icon: Users, label: '1M+ Passageiros', desc: 'Atendidos por ano' },
  ];

  return (
    <div className="brand-features">
      {features.map(({ icon: Icon, label, desc }) => (
        <div key={label} className="brand-features__item">
          <Icon size={20} />
          <div>
            <strong>{label}</strong>
            <span>{desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
