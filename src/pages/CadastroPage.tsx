import { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { RegistrationForm } from '../components/RegistrationForm';
import { FIRST_TRIP_PROMO, persistFirstTripCoupon, readFirstTripCoupon } from '../data/promoCampaign';
import '../components/PromoBanner.css';

export function CadastroPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const coupon = searchParams.get('cupom') ?? readFirstTripCoupon();

  useEffect(() => {
    persistFirstTripCoupon();
  }, []);

  useEffect(() => {
    if (location.hash !== '#formulario') return;

    const form = document.getElementById('formulario');
    form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash]);

  return (
    <div className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <span className="eyebrow">Cadastro Gratuito</span>
          <h1>Crie sua Conta ExpressoTransSul</h1>
          <p>
            Cadastre-se para comprar passagens, gerenciar reservas e acumular pontos de fidelidade.
            Já tem conta? <Link to="/area-cliente">Faça login</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <aside className="cadastro-promo" aria-label="Promoção de primeira viagem">
            <div className="cadastro-promo__badge">
              <span>20%</span>
              <span>OFF</span>
            </div>
            <p>
              Cupom <strong>{coupon}</strong> aplicado após o cadastro.
              {FIRST_TRIP_PROMO.discountLabel} na sua primeira passagem pelo Sul.
            </p>
          </aside>
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
