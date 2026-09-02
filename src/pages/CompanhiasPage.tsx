import { CompaniesSection } from '../components/CompaniesSection';

export function CompanhiasPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Parceiros</span>
          <h1>Companhias de Ônibus do Sul</h1>
          <p>
            Dados compilados de pesquisa em portais oficiais, ANTT e sites das transportadoras.
            Conheça as empresas que conectam RS, SC e PR.
          </p>
        </div>
      </section>
      <CompaniesSection />
    </div>
  );
}
