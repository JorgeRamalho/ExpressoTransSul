import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import {
  travelMoods,
  travelSuggestions,
  type TravelMood,
} from '../data/travelSuggestions';
import './TravelSuggestions.css';

export function TravelSuggestions() {
  const [mood, setMood] = useState<TravelMood>('praia');
  const filtered = useMemo(
    () => travelSuggestions.filter((item) => item.mood === mood),
    [mood],
  );

  return (
    <section className="suggestions" id="sugestoes" aria-labelledby="suggestions-title">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Para onde ir agora</span>
          <h2 id="suggestions-title">Sugestões de viagens que combinam com você</h2>
          <p>Escolha o clima da viagem. A gente sugere o trecho, o tempo e se vale a Linha Direta.</p>
        </div>

        <div className="suggestions__moods" role="tablist" aria-label="Clima da viagem">
          {travelMoods.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mood === item.id}
              className={`suggestions__mood ${mood === item.id ? 'suggestions__mood--active' : ''}`}
              onClick={() => setMood(item.id)}
            >
              <strong>{item.label}</strong>
              <span>{item.hint}</span>
            </button>
          ))}
        </div>

        <div className="suggestions__grid">
          {filtered.map((trip) => (
            <article key={trip.id} className="suggestion-card card">
              <div className="suggestion-card__top">
                <Compass size={18} />
                {trip.expressAvailable && (
                  <span className="suggestion-card__express">
                    <Sparkles size={14} />
                    Linha Direta
                  </span>
                )}
              </div>
              <h3>{trip.title}</h3>
              <p>{trip.hook}</p>
              <div className="suggestion-card__meta">
                <span>{trip.origin} → {trip.destination}</span>
                <span>{trip.duration}</span>
                <span>A partir de R$ {trip.priceFrom.toFixed(2)}</span>
              </div>
              <small>{trip.season}</small>
              <Link
                to={`/resultados?origem=${encodeURIComponent(`${trip.origin} - ${trip.originState}`)}&destino=${encodeURIComponent(`${trip.destination} - ${trip.destinationState}`)}`}
                className="btn btn-secondary suggestion-card__btn"
              >
                Ver passagens
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
