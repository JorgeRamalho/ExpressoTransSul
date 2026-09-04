import { Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { PromoBanner } from '../components/PromoBanner';
import { promotions } from '../data/promotions';
import { persistFirstTripCoupon } from '../data/promoCampaign';
import './PromocoesPage.css';

export function PromocoesPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    if (code === 'PRIMEIRA20') persistFirstTripCoupon();
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // fallback silencioso: o código continua visível na tela
    }
    setCopied(code);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Ofertas do Sul</span>
          <h1>Promoções para embarcar agora</h1>
          <p>Cupons claros, prazo visível e desconto que vale na primeira compra ou na Linha Direta.</p>
        </div>
      </section>

      <PromoBanner />

      <section className="section">
        <div className="container promo-grid">
          {promotions.map((promo) => (
            <article key={promo.id} className={`promo-tile card promo-tile--${promo.tone}`}>
              <span className="promo-tile__audience">{promo.audience}</span>
              <strong className="promo-tile__off">{promo.discountLabel}</strong>
              <h2>{promo.title}</h2>
              <p>{promo.description}</p>
              <p className="promo-tile__code">Cupom {promo.code} · até {promo.deadline}</p>
              <div className="promo-tile__actions">
                <button type="button" className="btn btn-outline" onClick={() => void copyCode(promo.code)}>
                  {copied === promo.code ? <Check size={16} /> : <Copy size={16} />}
                  {copied === promo.code ? 'Copiado' : 'Copiar cupom'}
                </button>
                <Link to="/cadastro#formulario" className="btn btn-secondary">Usar oferta</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
