import { useSearchParams, Link } from 'react-router-dom';
import { Bus, Clock, ArrowRight, Filter } from 'lucide-react';
import { popularRoutes } from '../data/routes';
import './ResultadosPage.css';

export function ResultadosPage() {
  const [params] = useSearchParams();
  const origem = params.get('origem') || '';
  const destino = params.get('destino') || '';
  const data = params.get('data') || '';

  const matchingRoute = popularRoutes.find(
    (r) =>
      origem.toLowerCase().includes(r.origin.toLowerCase()) &&
      destino.toLowerCase().includes(r.destination.toLowerCase())
  ) || popularRoutes[0];

  const mockResults = matchingRoute.departures.map((time, i) => ({
    id: i + 1,
    time,
    company: matchingRoute.companies[i % matchingRoute.companies.length],
    type: ['Convencional', 'Semi-leito', 'Leito'][i % 3],
    price: matchingRoute.priceFrom + i * 15,
    seats: Math.floor(Math.random() * 30) + 5,
    duration: matchingRoute.duration,
  }));

  return (
    <div className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <h1>Resultados da Busca</h1>
          <p className="resultados-route">
            {origem || matchingRoute.origin} <ArrowRight size={18} /> {destino || matchingRoute.destination}
            {data && <span> · {new Date(data + 'T12:00:00').toLocaleDateString('pt-BR')}</span>}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="resultados-layout">
            <aside className="resultados-filters card">
              <h3><Filter size={18} /> Filtros</h3>
              <div className="form-group">
                <label className="form-label">Companhia</label>
                <select className="form-select">
                  <option>Todas</option>
                  {matchingRoute.companies.map((c) => (
                    <option key={c}>{c}</option>
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
              <div className="form-group">
                <label className="form-label">Horário</label>
                <select className="form-select">
                  <option>Qualquer</option>
                  <option>Manhã (06h-12h)</option>
                  <option>Tarde (12h-18h)</option>
                  <option>Noite (18h-00h)</option>
                </select>
              </div>
            </aside>

            <div className="resultados-list">
              <p className="resultados-count">{mockResults.length} opções encontradas</p>
              {mockResults.map((result) => (
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
                    </div>
                    <span className="resultado-card__seats">{result.seats} assentos disponíveis</span>
                  </div>
                  <div className="resultado-card__price">
                    <span>A partir de</span>
                    <strong>R$ {result.price.toFixed(2)}</strong>
                    <Link to="/area-cliente" className="btn btn-secondary btn-sm">
                      Selecionar
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
