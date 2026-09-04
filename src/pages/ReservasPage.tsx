import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Armchair, Check, Coffee, Ticket } from 'lucide-react';
import { allRoutes, findMatchingRoutes } from '../data/routes';
import { SearchEngine } from '../components/SearchEngine';
import './ReservasPage.css';

const seatRows = ['01', '02', '03', '04', '05', '06', '07', '08'];
const seatLetters = ['A', 'B', 'C', 'D'] as const;
const occupiedSeats = new Set(['01A', '02D', '04B', '06C']);

export function ReservasPage() {
  const [params] = useSearchParams();
  const origem = params.get('origem') || '';
  const destino = params.get('destino') || '';
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [reserved, setReserved] = useState(false);

  const route = useMemo(() => {
    const matches = findMatchingRoutes(origem, destino);
    return matches[0] ?? allRoutes.find((item) => item.serviceKind === 'express') ?? allRoutes[0];
  }, [origem, destino]);

  const confirmReservation = () => {
    if (!selectedSeat) return;
    setReserved(true);
  };

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Reservas</span>
          <h1>Escolha o assento e reserve em um toque</h1>
          <p>Mapa do ônibus, Linha Direta e confirmação visual — sem formulário escondido.</p>
        </div>
      </section>

      <section className="section" style={{ marginTop: '-3rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <SearchEngine variant="page" initialTab="reservas" />
        </div>
      </section>

      <section className="section reservas-board">
        <div className="container reservas-layout">
          <article className="card reservas-route">
            <span className="reservas-route__kind">
              {route.serviceKind === 'express' ? 'Linha Direta' : 'Rota regular'}
            </span>
            <h2>{route.origin} → {route.destination}</h2>
            <p>{route.duration} · a partir de R$ {route.priceFrom.toFixed(2)}</p>
            {route.restStop && (
              <p className="reservas-route__rest">
                <Coffee size={16} />
                Pausa de {route.restStop.durationMinutes} min em {route.restStop.city}. Sem embarque e sem desembarque.
              </p>
            )}
            <div className="reservas-route__times">
              {route.departures.map((time) => (
                <span key={time}>{time}</span>
              ))}
            </div>
          </article>

          <article className="card reservas-seats">
            <h3><Armchair size={18} /> Mapa de assentos</h3>
            <p>Toque na poltrona livre. Corredor no centro, janela nas laterais.</p>
            <div className="seat-map" role="group" aria-label="Mapa de assentos do ônibus">
              {seatRows.map((row) => (
                <div key={row} className="seat-map__row">
                  {seatLetters.map((letter, index) => {
                    const id = `${row}${letter}`;
                    const taken = occupiedSeats.has(id);
                    return (
                      <span key={id} className="seat-map__cell">
                        <button
                          type="button"
                          className={`seat ${taken ? 'seat--taken' : ''} ${selectedSeat === id ? 'seat--selected' : ''}`}
                          disabled={taken}
                          onClick={() => {
                            setSelectedSeat(id);
                            setReserved(false);
                          }}
                          aria-label={`Assento ${id}${taken ? ' ocupado' : ''}`}
                        >
                          {id}
                        </button>
                        {index === 1 && <span className="seat-map__aisle" aria-hidden="true" />}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="seat-map__legend">
              <span>Livre</span>
              <span>Selecionado</span>
              <span>Ocupado</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              disabled={!selectedSeat}
              onClick={confirmReservation}
            >
              <Ticket size={18} />
              {selectedSeat ? `Reservar assento ${selectedSeat}` : 'Escolha um assento'}
            </button>
            {reserved && selectedSeat && (
              <div className="reservas-confirm" role="status">
                <Check size={18} />
                Assento {selectedSeat} reservado em {route.origin} → {route.destination}.
                <Link to="/area-cliente">Ver na Área do Cliente</Link>
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
