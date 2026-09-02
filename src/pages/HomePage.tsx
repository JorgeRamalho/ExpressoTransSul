import { Hero } from '../components/Hero';
import { RoutesSection } from '../components/RoutesSection';
import { CompaniesSection } from '../components/CompaniesSection';
import { BusGallery } from '../components/BusGallery';
import { Link } from 'react-router-dom';
import { Shield, Clock, Headphones, Award } from 'lucide-react';
import './HomePage.css';

const benefits = [
  { icon: Shield, title: 'Compra 100% Segura', desc: 'Pagamento protegido com criptografia SSL' },
  { icon: Clock, title: 'Horários em Tempo Real', desc: 'Status ao vivo de todos os terminais parceiros' },
  { icon: Headphones, title: 'Suporte 24/7', desc: 'Atendimento humanizado via 0800 e chat' },
  { icon: Award, title: 'Melhor Preço Garantido', desc: 'Compare entre 18+ companhias do Sul' },
];

export function HomePage() {
  return (
    <>
      <Hero />

      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="benefit-card">
                <div className="benefit-card__icon">
                  <Icon size={28} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RoutesSection />
      <BusGallery />
      <CompaniesSection />

      <section className="cta-section">
        <div className="container cta-section__inner">
          <h2>Pronto para embarcar?</h2>
          <p>Crie sua conta gratuita e tenha acesso a descontos exclusivos, histórico de viagens e embarque prioritário.</p>
          <div className="cta-section__actions">
            <Link to="/cadastro" className="btn btn-secondary btn-lg">Criar Conta Grátis</Link>
            <Link to="/area-cliente" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
              Acessar Área do Cliente
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
