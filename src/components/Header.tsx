import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Ticket, Phone, Smartphone } from 'lucide-react';
import { Logo } from './Logo';
import './Header.css';

const navLinks = [
  { to: '/horarios', label: 'Horários' },
  { to: '/promocoes', label: 'Promoções' },
  { to: '/app#app-experiencia', label: 'App', menuOnly: true },
  { to: '/companhias', label: 'Companhias', compactHidden: true },
  { to: '/terminais', label: 'Terminais', compactHidden: true },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" aria-label="ExpressoTransSul - Página inicial">
          <Logo variant="compact" size="md" />
        </Link>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label="Navegação principal">
          {navLinks.map(({ to, label, compactHidden, menuOnly }) => {
            const path = to.split('#')[0] ?? to;
            const isActive = location.pathname === path;
            const extraClass = [
              compactHidden ? 'header__link--compact-hidden' : '',
              menuOnly ? 'header__link--menu-only' : '',
            ].filter(Boolean).join(' ');

            return (
              <Link
                key={to}
                to={to}
                className={`header__link ${isActive ? 'header__link--active' : ''} ${extraClass}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="header__actions">
          <Link
            to="/app#baixar-app"
            className="header__app-btn"
            aria-label="Baixar o aplicativo ExpressoTransSul, grátis"
            onClick={() => setMenuOpen(false)}
          >
            <Smartphone size={16} />
            <span className="header__app-btn__label">Baixar App</span>
            <span className="header__app-btn__badge">Grátis</span>
          </Link>
          <a href="tel:08006474300" className="header__phone" aria-label="Ligue 0800 647 4300">
            <Phone size={18} />
            <span>0800 647 4300</span>
          </a>
          <Link
            to="/cadastro#formulario"
            className="btn btn-primary btn-sm header__search-btn"
            onClick={() => setMenuOpen(false)}
          >
            <Ticket size={16} />
            <span className="header__search-btn__full">Comprar Passagem</span>
            <span className="header__search-btn__short">Comprar Passagem</span>
          </Link>
          <Link to="/area-cliente" className="btn btn-outline btn-sm">
            <User size={16} />
            Entrar
          </Link>
          <button
            className="header__menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
