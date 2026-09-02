import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RegistrationForm } from '../components/RegistrationForm';

export function CadastroPage() {
  const location = useLocation();

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
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
