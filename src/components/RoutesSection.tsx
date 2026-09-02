import { Link } from 'react-router-dom';
import { popularRoutes, type Route } from '../data/routes';
import { ArrowRight, Clock, MapPin, DollarSign } from 'lucide-react';
import './RoutesSection.css';

function RouteCities({ route }: { route: Route }) {
  const stops = route.stops ?? [
    { city: route.origin, state: route.originState },
    { city: route.destination, state: route.destinationState },
  ];

  return (
    <div className={`route-card__cities ${route.stops ? 'route-card__cities--multi' : ''}`}>
      {stops.map((stop, index) => (
        <span key={`${stop.city}-${stop.state}`} className="route-card__stop">
          {index > 0 && <ArrowRight className="route-card__arrow" size={20} aria-hidden="true" />}
          <span className="route-card__city">{stop.city}</span>
          <span className="route-card__state">{stop.state}</span>
        </span>
      ))}
    </div>
  );
}

export function RoutesSection() {
  return (
    <section className="section routes-section" id="destinos">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Rotas Populares</span>
          <h2>Destinos Mais Buscados</h2>
          <p>Consulte horários, preços e disponibilidade nas principais rotas do Sul do Brasil.</p>
        </div>

        <div className="routes-grid">
          {popularRoutes.map((route) => (
            <article key={route.id} className="route-card card">
              <div className="route-card__header">
                <RouteCities route={route} />
              </div>

              <div className="route-card__info">
                <div className="route-card__detail">
                  <MapPin size={16} />
                  <span>{route.distance} km</span>
                </div>
                <div className="route-card__detail">
                  <Clock size={16} />
                  <span>{route.duration}</span>
                </div>
                <div className="route-card__detail route-card__detail--price">
                  <DollarSign size={16} />
                  <span>A partir de <strong>R$ {route.priceFrom.toFixed(2)}</strong></span>
                </div>
              </div>

              <div className="route-card__companies">
                {route.companies.map((c) => (
                  <span key={c} className="route-card__company">{c}</span>
                ))}
              </div>

              <div className="route-card__departures">
                <strong>Próximos horários:</strong>
                <div className="route-card__times">
                  {route.departures.slice(0, 5).map((time) => (
                    <span key={time} className="route-card__time">{time}</span>
                  ))}
                </div>
              </div>

              <Link
                to={`/resultados?origem=${encodeURIComponent(route.origin + ' - ' + route.originState)}&destino=${encodeURIComponent(route.destination + ' - ' + route.destinationState)}`}
                className="btn btn-primary route-card__btn"
              >
                Ver Passagens
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
