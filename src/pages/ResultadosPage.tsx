import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Bus, Clock, ArrowRight, Filter, Coffee, Zap } from 'lucide-react';
import { allRoutes, findMatchingRoutes, type Route } from '../data/routes';
import './ResultadosPage.css';

type ServiceFilter = 'todos' | 'regular' | 'express';

function buildResults(route: Route) {
  return route.departures.map((time, index) => ({
    id: `${route.id}-${index}`,
    time,
    company: route.companies[index % route.companies.length] ?? route.companies[0],
    type: (['Convencional', 'Semi-leito', 'Leito'] as const)[index % 3],
    price: route.priceFrom + index * 12,
    seats: 8 + ((index * 5) % 24),
    duration: route.duration,
    serviceKind: route.serviceKind,
    restStop: route.restStop,
  }));
}

export function ResultadosPage() {
  const [params] = useSearchParams();
  const origem = params.get('origem') || '';
  const destino = params.get('destino') || '';
  const data = params.get('data') || '';
  const tipo = params.get('tipo') || 'passagens';
  const requestedService = params.get('servico') === 'express' ? 'express' : 'todos';
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>(requestedService);

  const matchingRoutes = useMemo(() => {
    const found = findMatchingRoutes(origem, destino);
    return found.length > 0 ? found : [allRoutes[0]];
  }, [origem, destino]);

  const visibleRoutes = matchingRoutes.filter((route) =>
    serviceFilter === 'todos' ? true : route.serviceKind === serviceFilter,
  );

  const results = visibleRoutes.flatMap(buildResults);
  const headlineRoute = visibleRoutes[0] ?? matchingRoutes[0];

  return (
    <div className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <h1>{tipo === 'horarios' ? 'Horários encontrados' : 'Resultados da Busca'}</h1>
          <p className="resultados-route">
            {origem || headlineRoute.origin} <ArrowRight size={18} /> {destino || headlineRoute.destination}
            {data && <span> · {new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR')}</span>}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="resultados-layout">
            <aside className="resultados-filters card">
              <h3><Filter size={18} /> Filtros</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="filtro-servico">Tipo de linha</label>
                <select
                  id="filtro-servico"
                  className="form-select"
                  value={serviceFilter}
                  onChange={(event) => setServiceFilter(event.target.value as ServiceFilter)}
                >
                  <option value="todos">Todas</option>
                  <option value="express">Linha Direta (20 min)</option>
                  <option value="regular">Rotas regulares</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Companhia</label>
                <select className="form-select">
                  <option>Todas</option>
                  {[...new Set(visibleRoutes.flatMap((route) => route.companies))].map((company) => (
                    <option key={company}>{company}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Serviço</label>
                <select className="form-select">
                  <option>Todos</option>
                  <option>Convencional</option>
                  <option>Semi-leito</option>
                  <option>Leito</option>
                </select>
              </div>
            </aside>

            <div className="resultados-list">
              <p className="resultados-count">{results.length} opções encontradas</p>
              {results.map((result) => (
                <article key={result.id} className="resultado-card card">
                  <div className="resultado-card__time">
                    <Clock size={20} />
                    <strong>{result.time}</strong>
                    <span>{result.duration}</span>
                  </div>
                  <div className="resultado-card__info">
                    <div className="resultado-card__company">
                      <Bus size={18} />
                      <span>{result.company}</span>
                      <span className="resultado-card__type">{result.type}</span>
                      {result.serviceKind === 'express' && (
                        <span className="resultado-card__express">
                          <Zap size={12} /> Direta
                        </span>
                      )}
                    </div>
                    {result.restStop && (
                      <span className="resultado-card__rest">
                        <Coffee size={14} />
                        Descanso de {result.restStop.durationMinutes} min em {result.restStop.city} · sem embarque
                      </span>
                    )}
                    <span className="resultado-card__seats">{result.seats} assentos disponíveis</span>
                  </div>
                  <div className="resultado-card__price">
                    <span>A partir de</span>
                    <strong>R$ {result.price.toFixed(2)}</strong>
                    <Link to={tipo === 'horarios' ? '/embarques' : '/reservas'} className="btn btn-secondary btn-sm">
                      {tipo === 'horarios' ? 'Ver embarque' : 'Selecionar'}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
