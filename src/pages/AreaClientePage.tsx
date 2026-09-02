import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Ticket,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Calendar,
  Bus,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react';
import './AreaClientePage.css';

interface UserData {
  nome: string;
  email: string;
  cpf: string;
}

const mockTrips = [
  { id: 1, from: 'Porto Alegre', to: 'Florianópolis', date: '2026-09-15', time: '14:30', company: 'Catarinense', status: 'confirmada', seat: '12A' },
  { id: 2, from: 'Curitiba', to: 'Joinville', date: '2026-09-22', time: '08:00', company: 'Penha', status: 'pendente', seat: '05B' },
];

const mockHistory = [
  { id: 1, route: 'POA → FLN', date: '2026-08-10', price: 89.90 },
  { id: 2, route: 'CWB → POA', date: '2026-07-25', price: 145.00 },
  { id: 3, route: 'FLN → BLU', date: '2026-06-18', price: 52.00 },
];

export function AreaClientePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const stored = localStorage.getItem('ets_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ets_user');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="page">
        <section className="page-hero page-hero--compact">
          <div className="container">
            <h1>Área do Cliente</h1>
            <p>Faça login ou crie sua conta para acessar suas passagens e reservas.</p>
          </div>
        </section>
        <section className="section">
          <div className="container login-prompt">
            <div className="login-prompt__card card">
              <User size={48} />
              <h2>Bem-vindo de volta!</h2>
              <p>Acesse sua conta para gerenciar viagens, reservas e preferências.</p>
              <div className="login-prompt__demo">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    const demoUser = { nome: 'João Silva', email: 'joao@email.com', cpf: '123.456.789-00' };
                    localStorage.setItem('ets_user', JSON.stringify(demoUser));
                    setUser(demoUser);
                  }}
                >
                  Entrar (Demo)
                </button>
                <Link to="/cadastro" className="btn btn-outline btn-lg">Criar Conta</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page dashboard-page">
      <div className="container dashboard">
        <aside className="dashboard__sidebar card">
          <div className="dashboard__profile">
            <div className="dashboard__avatar">
              {user.nome.charAt(0)}
            </div>
            <div>
              <strong>{user.nome}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <nav className="dashboard__nav">
            {[
              { id: 'dashboard', label: 'Painel', icon: TrendingUp },
              { id: 'viagens', label: 'Minhas Viagens', icon: Ticket },
              { id: 'historico', label: 'Histórico', icon: Clock },
              { id: 'config', label: 'Configurações', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`dashboard__nav-item ${activeTab === id ? 'dashboard__nav-item--active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <button className="dashboard__logout" onClick={handleLogout}>
            <LogOut size={18} />
            Sair
          </button>
        </aside>

        <div className="dashboard__content">
          {activeTab === 'dashboard' && (
            <>
              <div className="dashboard__welcome">
                <h1>Olá, {user.nome.split(' ')[0]}! 👋</h1>
                <p>Gerencie suas viagens pelo Sul do Brasil.</p>
              </div>

              <div className="dashboard__stats">
                <div className="dashboard-stat card">
                  <Ticket size={24} />
                  <div>
                    <strong>2</strong>
                    <span>Viagens Ativas</span>
                  </div>
                </div>
                <div className="dashboard-stat card">
                  <Bus size={24} />
                  <div>
                    <strong>12</strong>
                    <span>Viagens Realizadas</span>
                  </div>
                </div>
                <div className="dashboard-stat card">
                  <Star size={24} />
                  <div>
                    <strong>850</strong>
                    <span>Pontos Fidelidade</span>
                  </div>
                </div>
                <div className="dashboard-stat card">
                  <MapPin size={24} />
                  <div>
                    <strong>8</strong>
                    <span>Cidades Visitadas</span>
                  </div>
                </div>
              </div>

              <div className="dashboard__section">
                <div className="dashboard__section-header">
                  <h2>Próximas Viagens</h2>
                  <Link to="/horarios" className="btn btn-primary btn-sm">
                    <Plus size={16} /> Nova Viagem
                  </Link>
                </div>
                <div className="dashboard-trips">
                  {mockTrips.map((trip) => (
                    <div key={trip.id} className="dashboard-trip card">
                      <div className="dashboard-trip__route">
                        <MapPin size={16} />
                        <span>{trip.from} → {trip.to}</span>
                      </div>
                      <div className="dashboard-trip__details">
                        <span><Calendar size={14} /> {trip.date}</span>
                        <span><Clock size={14} /> {trip.time}</span>
                        <span><Bus size={14} /> {trip.company}</span>
                        <span>Assento {trip.seat}</span>
                      </div>
                      <span className={`badge badge-${trip.status === 'confirmada' ? 'success' : 'warning'}`}>
                        {trip.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'viagens' && (
            <div className="dashboard__section">
              <h2>Minhas Viagens</h2>
              <div className="dashboard-trips">
                {mockTrips.map((trip) => (
                  <div key={trip.id} className="dashboard-trip card">
                    <div className="dashboard-trip__route">
                      <strong>{trip.from} → {trip.to}</strong>
                    </div>
                    <div className="dashboard-trip__details">
                      <span>{trip.date} às {trip.time}</span>
                      <span>{trip.company} · Assento {trip.seat}</span>
                    </div>
                    <span className={`badge badge-${trip.status === 'confirmada' ? 'success' : 'warning'}`}>
                      {trip.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="dashboard__section">
              <h2>Histórico de Viagens</h2>
              <div className="dashboard-history">
                {mockHistory.map((item) => (
                  <div key={item.id} className="dashboard-history__item">
                    <span>{item.route}</span>
                    <span>{item.date}</span>
                    <strong>R$ {item.price.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="dashboard__section">
              <h2>Configurações da Conta</h2>
              <div className="dashboard-config card">
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input className="form-input" defaultValue={user.nome} />
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input className="form-input" defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label className="form-label">CPF</label>
                  <input className="form-input" defaultValue={user.cpf} disabled />
                </div>
                <button className="btn btn-primary">Salvar Alterações</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
