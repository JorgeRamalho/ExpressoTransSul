import { terminals, liveTerminalStatus } from '../data/terminals';
import { MapPin, Phone, Clock, Bus } from 'lucide-react';
import './TerminaisPage.css';

export function TerminaisPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Terminais Rodoviários</span>
          <h1>Embarques e Desembarques</h1>
          <p>Informações em tempo real dos principais terminais da região Sul.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="terminais-page__subtitle">Status ao Vivo</h2>
          <div className="terminais-status-grid">
            {liveTerminalStatus.map((status) => (
              <div key={status.id} className={`terminal-status-card card terminal-status-card--${status.status}`}>
                <div className="terminal-status-card__header">
                  <Bus size={20} />
                  <span className={`badge badge-${status.status === 'atrasado' ? 'warning' : status.status === 'cancelado' ? 'error' : 'success'}`}>
                    {status.status}
                  </span>
                </div>
                <div className="terminal-status-card__route">
                  <strong>{status.city}</strong> → {status.nextDestination}
                </div>
                <div className="terminal-status-card__details">
                  <span><Clock size={14} /> {status.nextDeparture}</span>
                  <span>Plat. {status.platform}</span>
                  <span>{status.company}</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="terminais-page__subtitle" style={{ marginTop: '3rem' }}>Nossos Terminais</h2>
          <div className="terminais-grid">
            {terminals.map((terminal) => (
              <article key={terminal.id} className="terminal-card card">
                <div className="terminal-card__badge">{terminal.state}</div>
                <h3>{terminal.name}</h3>
                <p className="terminal-card__city">{terminal.city}</p>
                <div className="terminal-card__info">
                  <span><MapPin size={16} /> {terminal.address}</span>
                  <span><Phone size={16} /> {terminal.phone}</span>
                  <span><Clock size={16} /> {terminal.operatingHours}</span>
                  <span><Bus size={16} /> {terminal.platforms} plataformas</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
