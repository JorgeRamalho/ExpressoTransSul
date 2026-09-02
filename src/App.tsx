import { Routes, Route } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { HomePage } from './pages/HomePage';
import { HorariosPage } from './pages/HorariosPage';
import { CompanhiasPage } from './pages/CompanhiasPage';
import { TerminaisPage } from './pages/TerminaisPage';
import { AreaClientePage } from './pages/AreaClientePage';
import { CadastroPage } from './pages/CadastroPage';
import { ResultadosPage } from './pages/ResultadosPage';
import { RoutesSection } from './components/RoutesSection';

function DestinosPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Explore o Sul</span>
          <h1>Destinos Populares</h1>
          <p>Descubra as rotas mais buscadas entre Rio Grande do Sul, Santa Catarina e Paraná.</p>
        </div>
      </section>
      <RoutesSection />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="horarios" element={<HorariosPage />} />
        <Route path="companhias" element={<CompanhiasPage />} />
        <Route path="terminais" element={<TerminaisPage />} />
        <Route path="destinos" element={<DestinosPage />} />
        <Route path="area-cliente" element={<AreaClientePage />} />
        <Route path="cadastro" element={<CadastroPage />} />
        <Route path="resultados" element={<ResultadosPage />} />
      </Route>
    </Routes>
  );
}
