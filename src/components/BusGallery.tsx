import { useState } from 'react';
import { MapPin, Bus, Building2, Coffee } from 'lucide-react';
import { busImages, busImagesByCategory, type BusImageCategory } from '../data/busImages';
import './BusGallery.css';

const tabs: { id: BusImageCategory | 'todos'; label: string; icon: typeof MapPin }[] = [
  { id: 'todos', label: 'Todas', icon: MapPin },
  { id: 'estrada', label: 'Na Estrada', icon: Bus },
  { id: 'rodoviaria', label: 'Na Rodoviária', icon: Building2 },
  { id: 'parada-rapida', label: 'Parada Rápida', icon: Coffee },
];

const badgeLabels: Record<BusImageCategory, string> = {
  estrada: 'Na Estrada',
  rodoviaria: 'Rodoviária',
  'parada-rapida': 'Parada Rápida',
};

export function BusGallery() {
  const [filter, setFilter] = useState<BusImageCategory | 'todos'>('todos');

  const filtered =
    filter === 'todos' ? busImages : busImagesByCategory[filter];

  return (
    <section className="section bus-gallery" id="galeria-onibus">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Galeria ExpressoTransSul</span>
          <h2>Ônibus na Estrada e na Rodoviária</h2>
          <p>
            Imagens reais de ônibus viajando pelas rodovias e parados nos terminais da região Sul.
            Pesquisadas e selecionadas para o portal.
          </p>
        </div>

        <div className="bus-gallery__tabs" role="tablist">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={filter === id}
              className={`bus-gallery__tab ${filter === id ? 'bus-gallery__tab--active' : ''}`}
              onClick={() => setFilter(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        <div className="bus-gallery__grid">
          {filtered.map((image) => (
            <figure key={image.id} className="bus-gallery__card card">
              <div className="bus-gallery__image-wrap">
                <img src={image.src} alt={image.alt} loading="lazy" />
                <span className={`bus-gallery__badge bus-gallery__badge--${image.category}`}>
                  {badgeLabels[image.category]}
                </span>
              </div>
              <figcaption className="bus-gallery__caption">
                <strong>{image.title}</strong>
                {image.location && (
                  <span><MapPin size={14} /> {image.location}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
