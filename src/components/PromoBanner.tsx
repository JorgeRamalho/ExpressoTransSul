import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Sparkles, Ticket, UserPlus } from 'lucide-react';
import { FIRST_TRIP_PROMO, persistFirstTripCoupon } from '../data/promoCampaign';
import { assetUrl } from '../lib/assetUrl';
import './PromoBanner.css';

const PASSENGER_IMAGE = assetUrl('images/promo-boarding-primeira-viagem.png');

const steps = [
  { icon: UserPlus, label: 'Cadastre-se grátis' },
  { icon: Ticket, label: `Ative ${FIRST_TRIP_PROMO.code}` },
  { icon: Sparkles, label: 'Embarque com 20% OFF' },
] as const;

export function PromoBanner() {
  const [copied, setCopied] = useState(false);

  const copyCoupon = async () => {
    persistFirstTripCoupon();

    try {
      await navigator.clipboard.writeText(FIRST_TRIP_PROMO.code);
    } catch {
      const field = document.createElement('textarea');
      field.value = FIRST_TRIP_PROMO.code;
      field.setAttribute('readonly', '');
      field.style.position = 'absolute';
      field.style.left = '-9999px';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      document.body.removeChild(field);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="promo-banner" id="oferta" aria-labelledby="promo-banner-title">
      <div className="promo-banner__stage">
        <div className="promo-banner__copy">
          <span className="promo-banner__eyebrow">{FIRST_TRIP_PROMO.eyebrow}</span>
          <h2 id="promo-banner-title">{FIRST_TRIP_PROMO.title}</h2>
          <p>{FIRST_TRIP_PROMO.description}</p>
        </div>

        <div className="promo-banner__offer">
          <div className="promo-banner__badge">
            <span className="promo-banner__badge-value">20%</span>
            <span className="promo-banner__badge-off">OFF</span>
            <span className="promo-banner__badge-hint">Primeira viagem</span>
          </div>

          <div className="promo-banner__coupon">
            <p className="promo-banner__fomo">{FIRST_TRIP_PROMO.fomo}</p>
            <p className="promo-banner__code">
              Cupom: <strong>{FIRST_TRIP_PROMO.code}</strong>
            </p>
            <span className="promo-banner__deadline">Válido até {FIRST_TRIP_PROMO.deadlineLabel}</span>
          </div>
        </div>

        <div className="promo-banner__photo">
          <img
            src={PASSENGER_IMAGE}
            alt="Passageiros felizes embarcando em um ônibus da ExpressoTransSul"
            width={640}
            height={853}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="container">
        <div className="promo-banner__cta-card">
          <div className="promo-banner__cta-copy">
            <h3>Cadastre-se e ative seu desconto agora</h3>
            <ol className="promo-banner__steps">
              {steps.map(({ icon: Icon, label }, index) => (
                <li key={label}>
                  <span className="promo-banner__step-index">{index + 1}</span>
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ol>
          </div>

          <div className="promo-banner__cta-actions">
            <button
              type="button"
              className="btn btn-outline promo-banner__copy-btn"
              onClick={() => void copyCoupon()}
              aria-live="polite"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Cupom copiado!' : `Copiar ${FIRST_TRIP_PROMO.code}`}
            </button>
            <Link
              to="/cadastro#formulario"
              className="btn btn-secondary btn-lg"
              onClick={persistFirstTripCoupon}
            >
              <Ticket size={18} />
              Cadastrar e resgatar cupom
            </Link>
          </div>
        </div>
        <p className="promo-banner__legal">{FIRST_TRIP_PROMO.legal}</p>
      </div>
    </section>
  );
}
