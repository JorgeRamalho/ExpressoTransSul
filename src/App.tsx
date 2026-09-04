import { Routes, Route } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { HomePage } from './pages/HomePage';
import { HorariosPage } from './pages/HorariosPage';
import { CompanhiasPage } from './pages/CompanhiasPage';
import { TerminaisPage } from './pages/TerminaisPage';
import { AreaClientePage } from './pages/AreaClientePage';
import { CadastroPage } from './pages/CadastroPage';
import { ResultadosPage } from './pages/ResultadosPage';
import { DestinosPage } from './pages/DestinosPage';
import { AppPage } from './pages/AppPage';
import { PromocoesPage } from './pages/PromocoesPage';
import { SugestoesPage } from './pages/SugestoesPage';
import { ReservasPage } from './pages/ReservasPage';
import { EmbarquesPage } from './pages/EmbarquesPage';
import { PassagensPage } from './pages/PassagensPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="horarios" element={<HorariosPage />} />
        <Route path="passagens" element={<PassagensPage />} />
        <Route path="companhias" element={<CompanhiasPage />} />
        <Route path="terminais" element={<TerminaisPage />} />
        <Route path="destinos" element={<DestinosPage />} />
        <Route path="area-cliente" element={<AreaClientePage />} />
        <Route path="cadastro" element={<CadastroPage />} />
        <Route path="resultados" element={<ResultadosPage />} />
        <Route path="app" element={<AppPage />} />
        <Route path="promocoes" element={<PromocoesPage />} />
        <Route path="sugestoes" element={<SugestoesPage />} />
        <Route path="reservas" element={<ReservasPage />} />
        <Route path="embarques" element={<EmbarquesPage />} />
      </Route>
    </Routes>
  );
}
