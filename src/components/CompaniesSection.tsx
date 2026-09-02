import { Link } from 'react-router-dom';
import { Bus, Phone, MapPin, Users } from 'lucide-react';
import { busCompanies } from '../data/companies';
import './CompaniesSection.css';

export function CompaniesSection() {
  return (
    <section className="section companies-section" id="companhias">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Parceiros Oficiais</span>
          <h2>Companhias de Ônibus do Sul</h2>
          <p>
            Conheça as principais empresas de transporte rodoviário que operam na região Sul do Brasil.
            Dados compilados de fontes oficiais e portais do setor.
          </p>
        </div>

        <div className="companies-grid">
          {busCompanies.map((company) => (
            <article key={company.id} className="company-card card">
              <div className="company-card__header" style={{ borderColor: company.color }}>
                <div className="company-card__logo" style={{ backgroundColor: company.color }}>
                  {company.logoInitials}
                </div>
                <div className="company-card__title">
                  <h3>{company.name}</h3>
                  <span className="company-card__state">
                    <MapPin size={12} /> {company.state === 'Multi' ? 'Multi-estado' : company.state}
                  </span>
                </div>
              </div>

              <div className="company-card__body">
                <p className="company-card__desc">{company.description}</p>

                <div className="company-card__stats">
                  <div className="company-card__stat">
                    <Bus size={16} />
                    <span>{company.fleet > 0 ? `${company.fleet} veículos` : 'Histórica'}</span>
                  </div>
                  <div className="company-card__stat">
                    <Users size={16} />
                    <span>{company.passengersYear}/ano</span>
                  </div>
                  <div className="company-card__stat">
                    <span>Desde {company.founded}</span>
                  </div>
                </div>

                <div className="company-card__routes">
                  <strong>Principais rotas:</strong>
                  <ul>
                    {company.routes.slice(0, 3).map((route) => (
                      <li key={route}>{route}</li>
                    ))}
                  </ul>
                </div>

                <div className="company-card__services">
                  {company.services.map((service) => (
                    <span key={service} className="company-card__tag">{service}</span>
                  ))}
                </div>

                <div className="company-card__amenities">
                  {company.amenities.slice(0, 4).map((amenity) => (
                    <span key={amenity} className="company-card__amenity">{amenity}</span>
                  ))}
                </div>
              </div>

              <div className="company-card__footer">
                <a href={`tel:${company.phone.replace(/\D/g, '')}`} className="company-card__phone">
                  <Phone size={14} />
                  {company.phone}
                </a>
                <Link to={`/companhias/${company.id}`} className="btn btn-outline btn-sm">
                  Ver detalhes
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="companies-section__cta">
          <p>Precisa de ajuda para escolher? Nossa equipe está pronta para orientar.</p>
          <Link to="/horarios" className="btn btn-primary btn-lg">
            Consultar Horários Agora
          </Link>
        </div>
      </div>
    </section>
  );
}
