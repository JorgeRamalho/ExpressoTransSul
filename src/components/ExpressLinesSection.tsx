import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Coffee, Ban, Zap } from 'lucide-react';
import { expressDirectRoutes, type Route } from '../data/routes';
import './ExpressLinesSection.css';

function ExpressCard({ route }: { route: Route }) {
  const rest = route.restStop;

  return (
    <article className="express-card card">
      <div className="express-card__badge">
        <Zap size={14} />
        Linha Direta
      </div>
      <div className="express-card__cities">
        <strong>{route.origin}</strong>
        <span>{route.originState}</span>
        <ArrowRight size={18} />
        <strong>{route.destination}</strong>
        <span>{route.destinationState}</span>
      </div>
      {rest && (
        <p className="express-card__rest">
          <Coffee size={16} />
          Descanso de {rest.durationMinutes} min em {rest.city} · sem embarque ou desembarque
        </p>
      )}
      <div className="express-card__meta">
        <span><Clock size={14} /> {route.duration}</span>
        <span>{route.distance} km</span>
        <span>A partir de <strong>R$ {route.priceFrom.toFixed(2)}</strong></span>
      </div>
      <div className="express-card__times">
        {route.departures.slice(0, 4).map((time) => (
          <span key={time}>{time}</span>
        ))}
      </div>
      <Link
        to={`/resultados?origem=${encodeURIComponent(`${route.origin} - ${route.originState}`)}&destino=${encodeURIComponent(`${route.destination} - ${route.destinationState}`)}&tipo=passagens&servico=express`}
        className="btn btn-primary express-card__btn"
      >
        Reservar Linha Direta
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}

export function ExpressLinesSection() {
  const [limit, setLimit] = useState(6);
  const visible = expressDirectRoutes.slice(0, limit);
  const canShowMore = limit < expressDirectRoutes.length;

  return (
    <section className="express-lines" id="linhas-diretas" aria-labelledby="express-lines-title">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Caminho direto</span>
          <h2 id="express-lines-title">Linhas entre rotas com uma pausa de 20 minutos</h2>
          <p>
            Ligamos destinos que já existiam na malha — sem nova parada comercial.
            O ônibus descansa 20 minutos e segue. Ninguém sobe nem desce no meio do caminho.
          </p>
        </div>

        <div className="express-lines__legend">
          <span><Coffee size={16} /> Só descanso</span>
          <span><Ban size={16} /> Sem embarque / desembarque</span>
          <span><Zap size={16} /> Uma conexão, um ônibus</span>
        </div>

        <div className="express-lines__grid">
          {visible.map((route) => (
            <ExpressCard key={route.id} route={route} />
          ))}
        </div>

        {canShowMore && (
          <div className="express-lines__more">
            <button type="button" className="btn btn-outline" onClick={() => setLimit(expressDirectRoutes.length)}>
              Ver todas as linhas diretas
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
