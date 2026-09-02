import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ArrowLeftRight,
  Search,
  Users,
  Ticket,
  Clock,
  Bookmark,
} from 'lucide-react';
import { cities } from '../data/routes';
import './SearchEngine.css';

type TripType = 'ida' | 'ida-volta';
type SearchTab = 'passagens' | 'horarios' | 'reservas' | 'embarques';

interface SearchEngineProps {
  variant?: 'hero' | 'page';
}

export function SearchEngine({ variant = 'hero' }: SearchEngineProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SearchTab>('passagens');
  const [tripType, setTripType] = useState<TripType>('ida');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      origem: origin,
      destino: destination,
      data: departureDate,
      ...(tripType === 'ida-volta' && returnDate ? { retorno: returnDate } : {}),
      passageiros: String(passengers),
      tipo: activeTab,
    });
    navigate(`/resultados?${params.toString()}`);
  };

  const swapCities = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const tabs: { id: SearchTab; label: string; icon: typeof Ticket }[] = [
    { id: 'passagens', label: 'Passagens', icon: Ticket },
    { id: 'horarios', label: 'Horários', icon: Clock },
    { id: 'reservas', label: 'Reservas', icon: Bookmark },
    { id: 'embarques', label: 'Embarques', icon: MapPin },
  ];

  return (
    <div className={`search-engine search-engine--${variant}`}>
      <div className="search-engine__tabs" role="tablist">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            className={`search-engine__tab ${activeTab === id ? 'search-engine__tab--active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <form className="search-engine__form" onSubmit={handleSearch}>
        <div className="search-engine__trip-type">
          <button
            type="button"
            className={`search-engine__trip-btn ${tripType === 'ida' ? 'search-engine__trip-btn--active' : ''}`}
            onClick={() => setTripType('ida')}
          >
            Somente Ida
          </button>
          <button
            type="button"
            className={`search-engine__trip-btn ${tripType === 'ida-volta' ? 'search-engine__trip-btn--active' : ''}`}
            onClick={() => setTripType('ida-volta')}
          >
            Ida e Volta
          </button>
        </div>

        <div
          className={`search-engine__fields ${
            tripType === 'ida-volta' ? 'search-engine__fields--roundtrip' : ''
          }`}
        >
          <div className="search-engine__field search-engine__field--origin">
            <label htmlFor="origin" className="form-label">
              <MapPin size={16} /> Origem
            </label>
            <input
              id="origin"
              list="cities-list"
              className="form-input"
              placeholder="De onde você sai?"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>

          <button
            type="button"
            className="search-engine__swap"
            onClick={swapCities}
            aria-label="Trocar origem e destino"
          >
            <ArrowLeftRight size={20} />
          </button>

          <div className="search-engine__field search-engine__field--destination">
            <label htmlFor="destination" className="form-label">
              <MapPin size={16} /> Destino
            </label>
            <input
              id="destination"
              list="cities-list"
              className="form-input"
              placeholder="Para onde você vai?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="search-engine__field">
            <label htmlFor="departure" className="form-label">
              <Calendar size={16} /> Data de Ida
            </label>
            <input
              id="departure"
              type="date"
              className="form-input"
              min={today}
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </div>

          {tripType === 'ida-volta' && (
            <div className="search-engine__field">
              <label htmlFor="return" className="form-label">
                <Calendar size={16} /> Data de Volta
              </label>
              <input
                id="return"
                type="date"
                className="form-input"
                min={departureDate || today}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          )}

          <div className="search-engine__field search-engine__field--passengers">
            <label htmlFor="passengers" className="form-label">
              <Users size={16} /> Passageiros
            </label>
            <select
              id="passengers"
              className="form-select"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'passageiro' : 'passageiros'}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-secondary btn-lg search-engine__submit">
            <Search size={20} />
            {activeTab === 'passagens' ? 'Buscar Passagens' :
             activeTab === 'horarios' ? 'Consultar Horários' :
             activeTab === 'reservas' ? 'Ver Reservas' : 'Consultar Embarques'}
          </button>
        </div>

        <datalist id="cities-list">
          {cities.map(({ name, state }) => (
            <option key={`${name}-${state}`} value={`${name} - ${state}`} />
          ))}
        </datalist>
      </form>
    </div>
  );
}
