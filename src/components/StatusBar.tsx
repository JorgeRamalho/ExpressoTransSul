import { useEffect, useState } from 'react';
import { MapPin, Clock, Bus, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { liveTerminalStatus } from '../data/terminals';
import type { TerminalStatus } from '../data/terminals';
import './StatusBar.css';

const statusConfig: Record<TerminalStatus['status'], { label: string; icon: typeof CheckCircle; className: string }> = {
  embarque: { label: 'Embarque', icon: Bus, className: 'status-bar__item--boarding' },
  chegada: { label: 'Chegada', icon: ArrowRight, className: 'status-bar__item--arrival' },
  atrasado: { label: 'Atrasado', icon: AlertTriangle, className: 'status-bar__item--delayed' },
  cancelado: { label: 'Cancelado', icon: AlertTriangle, className: 'status-bar__item--cancelled' },
  confirmado: { label: 'Confirmado', icon: CheckCircle, className: 'status-bar__item--confirmed' },
};

export function StatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const duplicatedItems = [...liveTerminalStatus, ...liveTerminalStatus];

  return (
    <div className="status-bar" role="region" aria-label="Status de embarques e desembarques nos terminais">
      <div className="status-bar__time">
        <Clock size={14} />
        <time dateTime={currentTime.toISOString()}>{timeStr}</time>
        <span className="status-bar__live">
          <span className="status-bar__live-dot" />
          AO VIVO
        </span>
      </div>

      <div className="status-bar__track">
        <div className="status-bar__marquee">
          {duplicatedItems.map((item, index) => {
            const config = statusConfig[item.status];
            const StatusIcon = config.icon;
            return (
              <div key={`${item.id}-${index}`} className={`status-bar__item ${config.className}`}>
                <StatusIcon size={14} />
                <span className="status-bar__city">{item.city}</span>
                <span className="status-bar__platform">Plat. {item.platform}</span>
                <span className="status-bar__departure">{item.nextDeparture}</span>
                <ArrowRight size={12} />
                <span className="status-bar__destination">{item.nextDestination}</span>
                <span className="status-bar__company">{item.company}</span>
                <span className={`status-bar__badge badge badge-${item.status === 'atrasado' ? 'warning' : item.status === 'cancelado' ? 'error' : 'success'}`}>
                  {config.label}
                  {item.delay ? ` +${item.delay}min` : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="status-bar__terminals">
        <MapPin size={14} />
        <span>8 Terminais</span>
      </div>
    </div>
  );
}
