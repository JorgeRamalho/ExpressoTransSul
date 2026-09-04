import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bus, Clock, Filter, Zap } from 'lucide-react';
import { liveTerminalStatus, terminals } from '../data/terminals';
import { expressDirectRoutes } from '../data/routes';
import { SearchEngine } from '../components/SearchEngine';
import './EmbarquesPage.css';

const statusLabel: Record<(typeof liveTerminalStatus)[number]['status'], string> = {
  embarque: 'Embarque',
  chegada: 'Chegada',
  atrasado: 'Atrasado',
  cancelado: 'Cancelado',
  confirmado: 'Confirmado',
};

export function EmbarquesPage() {
  const [params] = useSearchParams();
  const origem = params.get('origem') || '';
  const [terminalFilter, setTerminalFilter] = useState('todos');

  const rows = useMemo(() => {
    return liveTerminalStatus.filter((item) => {
      const matchesOrigin = !origem || origem.toLowerCase().includes(item.city.toLowerCase());
      const matchesTerminal = terminalFilter === 'todos' || item.city === terminalFilter;
      return matchesOrigin && matchesTerminal;
    });
  }, [origem, terminalFilter]);

  const expressCities = new Set(
    expressDirectRoutes.flatMap((route) => [route.origin, route.destination, route.restStop?.city ?? '']),
  );

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Embarques ao vivo</span>
          <h1>Painel de plataformas do Sul</h1>
          <p>Acompanhe portão, horário e status. Linhas Diretas aparecem destacadas — descanso sem desembarque.</p>
        </div>
      </section>

      <section className="section" style={{ marginTop: '-3rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <SearchEngine variant="page" initialTab="embarques" />
        </div>
      </section>

      <section className="section embarques-board">
        <div className="container">
          <div className="embarques-toolbar">
            <h2><Clock size={20} /> Agora nos terminais</h2>
            <label className="embarques-filter">
              <Filter size={16} />
              <select
                className="form-select"
                value={terminalFilter}
                onChange={(event) => setTerminalFilter(event.target.value)}
              >
                <option value="todos">Todos os terminais</option>
                {terminals.map((terminal) => (
                  <option key={terminal.id} value={terminal.city}>{terminal.city}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="embarques-table card">
            {rows.length === 0 && <p className="embarques-empty">Nenhum embarque neste filtro agora.</p>}
            {rows.map((row) => {
              const isExpress = expressCities.has(row.city) && expressCities.has(row.nextDestination);
              return (
                <article key={row.id} className={`embarque-row embarque-row--${row.status}`}>
                  <div className="embarque-row__time">
                    <Bus size={18} />
                    <strong>{row.nextDeparture}</strong>
                  </div>
                  <div>
                    <p className="embarque-row__route">
                      {row.city} → {row.nextDestination}
                      {isExpress && (
                        <span className="embarque-row__express">
                          <Zap size={12} /> Direta
                        </span>
                      )}
                    </p>
                    <span>{row.company} · Plataforma {row.platform}</span>
                  </div>
                  <span className={`badge badge-${row.status === 'atrasado' ? 'warning' : row.status === 'cancelado' ? 'error' : 'success'}`}>
                    {statusLabel[row.status]}
                    {row.delay ? ` +${row.delay}min` : ''}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
