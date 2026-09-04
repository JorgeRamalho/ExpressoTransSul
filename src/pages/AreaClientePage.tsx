import { useState, useEffect, type FormEvent } from 'react';
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
  Mail,
  Lock,
  Shield,
  Headphones,
  Gift,
  CreditCard,
  Bell,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { loginPassenger } from '../services/registrationApi';
import './AreaClientePage.css';

interface UserData {
  nome: string;
  email: string;
  cpf: string;
}

const mockTrips = [
  { id: 1, from: 'Porto Alegre', to: 'Florianópolis', date: '2026-09-15', time: '14:30', company: 'Catarinense', status: 'confirmada', seat: '12A', platform: '12', terminal: 'Rodoviária de Porto Alegre' },
  { id: 2, from: 'Curitiba', to: 'Joinville', date: '2026-09-22', time: '08:00', company: 'Penha', status: 'pendente', seat: '05B', platform: '07', terminal: 'Rodoviária de Curitiba' },
];

const mockHistory = [
  { id: 1, route: 'POA → FLN', from: 'Porto Alegre', to: 'Florianópolis', date: '2026-08-10', price: 89.90, company: 'Catarinense' },
  { id: 2, route: 'CWB → POA', from: 'Curitiba', to: 'Porto Alegre', date: '2026-07-25', price: 145.00, company: 'Penha' },
  { id: 3, route: 'FLN → BLU', from: 'Florianópolis', to: 'Blumenau', date: '2026-06-18', price: 52.00, company: 'Reunidas' },
];

const loginBenefits = [
  { icon: Ticket, title: 'Passagens', text: 'Compre e gerencie suas reservas em um só lugar.' },
  { icon: Star, title: 'Fidelidade', text: 'Acumule pontos e troque por descontos na próxima viagem.' },
  { icon: Headphones, title: 'Suporte', text: 'Atendimento 24h para embarque, horários e reembolso.' },
];

function formatDate(value: string) {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function persistUser(user: UserData) {
  localStorage.setItem('ets_user', JSON.stringify(user));
}

export function AreaClientePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ets_user');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as UserData;
      if (parsed.nome && parsed.email) {
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem('ets_user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ets_user');
    setUser(null);
    setPassword('');
    setLoginError('');
    setActiveTab('dashboard');
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setLoginError('Informe e-mail e senha para entrar.');
      return;
    }

    setSubmitting(true);
    const response = await loginPassenger(trimmedEmail, password);
    setSubmitting(false);

    if (!response.success || !response.passenger) {
      setLoginError(response.message || 'E-mail ou senha incorretos.');
      return;
    }

    const nextUser = {
      nome: response.passenger.nome,
      email: response.passenger.email,
      cpf: response.passenger.cpf,
    };
    persistUser(nextUser);
    setUser(nextUser);
    setPassword('');
  };

  if (!user) {
    return (
      <div className="page login-page">
        <section className="page-hero page-hero--compact">
          <div className="container login-hero">
            <span className="eyebrow">Área do Cliente</span>
            <h1>Área do Cliente</h1>
            <p>Faça login para acessar suas passagens, reservas e pontos de fidelidade.</p>
          </div>
        </section>

        <section className="section login-section">
          <div className="container">
            <div className="login-panel card">
              <div className="login-panel__icon" aria-hidden="true">
                <User size={28} />
              </div>
              <h2>Bem-vindo de volta</h2>
              <p className="login-panel__lead">
                Digite seus dados para entrar. Ainda não tem cadastro? Crie sua conta gratuita abaixo.
              </p>

              <form className="login-form" onSubmit={(event) => void handleLogin(event)} noValidate>
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">
                    <Mail size={14} /> E-mail
                  </label>
                  <input
                    id="login-email"
                    className="form-input"
                    type="email"
                    autoComplete="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setLoginError('');
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-senha" className="form-label">
                    <Lock size={14} /> Senha
                  </label>
                  <input
                    id="login-senha"
                    className="form-input"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setLoginError('');
                    }}
                    required
                  />
                </div>

                {loginError && (
                  <p className="login-form__error" role="alert">{loginError}</p>
                )}

                <button type="submit" className="btn btn-primary btn-lg login-form__submit" disabled={submitting}>
                  {submitting ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <p className="login-panel__signup">
                Não tem conta? <Link to="/cadastro">Criar Conta</Link>
              </p>

              <ul className="login-panel__benefits">
                {loginBenefits.map(({ icon: Icon, title, text }) => (
                  <li key={title}>
                    <span className="login-panel__benefit-icon">
                      <Icon size={18} />
                    </span>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const firstName = user.nome.split(' ')[0];
  const nextTrip = mockTrips[0];
  const loyaltyPoints = 850;
  const loyaltyGoal = 1000;
  const loyaltyProgress = Math.round((loyaltyPoints / loyaltyGoal) * 100);

  return (
    <div className="page dashboard-page">
      <div className="container dashboard">
        <aside className="dashboard__sidebar card">
          <div className="dashboard__profile">
            <div className="dashboard__avatar">{user.nome.charAt(0)}</div>
            <div className="dashboard__profile-copy">
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
                <h1>Olá, {firstName}!</h1>
                <p>Acompanhe suas próximas viagens, pontos e reservas em um só painel.</p>
              </div>

              {nextTrip && (
                <article className="dashboard-featured card">
                  <div className="dashboard-featured__label">
                    <Bus size={16} /> Próxima viagem
                  </div>
                  <div className="dashboard-featured__route">
                    <div>
                      <span>Origem</span>
                      <strong>{nextTrip.from}</strong>
                    </div>
                    <ArrowRight size={22} />
                    <div>
                      <span>Destino</span>
                      <strong>{nextTrip.to}</strong>
                    </div>
                  </div>
                  <div className="dashboard-featured__meta">
                    <span><Calendar size={14} /> {formatDate(nextTrip.date)}</span>
                    <span><Clock size={14} /> {nextTrip.time}</span>
                    <span><MapPin size={14} /> Plataforma {nextTrip.platform}</span>
                    <span>Assento {nextTrip.seat}</span>
                  </div>
                </article>
              )}

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
                    <strong>{loyaltyPoints}</strong>
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

              <div className="dashboard-grid">
                <section className="dashboard__section">
                  <div className="dashboard__section-header">
                    <h2>Próximas Viagens</h2>
                    <Link to="/horarios" className="btn btn-primary btn-sm">
                      <Plus size={16} /> Nova Viagem
                    </Link>
                  </div>
                  <div className="dashboard-trips">
                    {mockTrips.map((trip) => (
                      <article key={trip.id} className="dashboard-trip card">
                        <div className="dashboard-trip__route">
                          <MapPin size={16} />
                          <span>{trip.from} → {trip.to}</span>
                        </div>
                        <div className="dashboard-trip__details">
                          <span><Calendar size={14} /> {formatDate(trip.date)}</span>
                          <span><Clock size={14} /> {trip.time}</span>
                          <span><Bus size={14} /> {trip.company}</span>
                          <span>Assento {trip.seat}</span>
                        </div>
                        <span className={`badge badge-${trip.status === 'confirmada' ? 'success' : 'warning'}`}>
                          {trip.status}
                        </span>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="dashboard__section">
                  <div className="dashboard__section-header">
                    <h2>Fidelidade</h2>
                  </div>
                  <div className="dashboard-loyalty card">
                    <div className="dashboard-loyalty__head">
                      <Gift size={20} />
                      <strong>Clube ExpressoTransSul</strong>
                    </div>
                    <p>Faltam {loyaltyGoal - loyaltyPoints} pontos para o próximo desconto de 20%.</p>
                    <div className="dashboard-loyalty__bar" aria-hidden="true">
                      <span style={{ width: `${loyaltyProgress}%` }} />
                    </div>
                    <small>{loyaltyPoints} / {loyaltyGoal} pontos</small>
                  </div>

                  <div className="dashboard-shortcuts">
                    <Link to="/horarios" className="dashboard-shortcut card">
                      <Ticket size={18} />
                      <span>Buscar horários</span>
                      <ChevronRight size={16} />
                    </Link>
                    <Link to="/terminais" className="dashboard-shortcut card">
                      <MapPin size={18} />
                      <span>Ver terminais</span>
                      <ChevronRight size={16} />
                    </Link>
                    <Link to="/cadastro" className="dashboard-shortcut card">
                      <Shield size={18} />
                      <span>Atualizar cadastro</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </section>
              </div>
            </>
          )}

          {activeTab === 'viagens' && (
            <section className="dashboard__section">
              <div className="dashboard__welcome">
                <h2>Minhas Viagens</h2>
                <p>Confira embarque, assento e status de cada reserva ativa.</p>
              </div>
              <div className="dashboard-trips">
                {mockTrips.map((trip) => (
                  <article key={trip.id} className="dashboard-trip card dashboard-trip--full">
                    <div className="dashboard-trip__route">
                      <strong>{trip.from} → {trip.to}</strong>
                    </div>
                    <div className="dashboard-trip__details">
                      <span>{formatDate(trip.date)} às {trip.time}</span>
                      <span>{trip.company} · Assento {trip.seat}</span>
                      <span>{trip.terminal}</span>
                    </div>
                    <span className={`badge badge-${trip.status === 'confirmada' ? 'success' : 'warning'}`}>
                      {trip.status}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'historico' && (
            <section className="dashboard__section">
              <div className="dashboard__welcome">
                <h2>Histórico de Viagens</h2>
                <p>Todas as passagens já utilizadas na ExpressoTransSul.</p>
              </div>
              <div className="dashboard-history">
                {mockHistory.map((item) => (
                  <article key={item.id} className="dashboard-history__item">
                    <div>
                      <strong>{item.from} → {item.to}</strong>
                      <span>{item.company} · {formatDate(item.date)}</span>
                    </div>
                    <strong>R$ {item.price.toFixed(2)}</strong>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'config' && (
            <section className="dashboard__section">
              <div className="dashboard__welcome">
                <h2>Configurações da Conta</h2>
                <p>Mantenha seus dados atualizados para embarque e comunicação.</p>
              </div>
              <form className="dashboard-config card" onSubmit={(event) => event.preventDefault()}>
                <div className="form-group">
                  <label className="form-label" htmlFor="config-nome">Nome</label>
                  <input id="config-nome" className="form-input" defaultValue={user.nome} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="config-email">E-mail</label>
                  <input id="config-email" className="form-input" type="email" defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="config-cpf">CPF</label>
                  <input id="config-cpf" className="form-input" defaultValue={user.cpf} disabled />
                </div>
                <div className="dashboard-config__prefs">
                  <label className="dashboard-config__check">
                    <input type="checkbox" defaultChecked />
                    <Bell size={16} /> Receber alertas de embarque
                  </label>
                  <label className="dashboard-config__check">
                    <input type="checkbox" defaultChecked />
                    <CreditCard size={16} /> Ofertas e cupons por e-mail
                  </label>
                </div>
                <button type="submit" className="btn btn-primary">Salvar Alterações</button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
