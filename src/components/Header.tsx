import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Ticket, Phone } from 'lucide-react';
import { Logo } from './Logo';
import './Header.css';

const navLinks = [
  { to: '/horarios', label: 'Horários' },
  { to: '/companhias', label: 'Companhias' },
  { to: '/terminais', label: 'Terminais' },
  { to: '/destinos', label: 'Destinos' },
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
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`header__link ${location.pathname === to ? 'header__link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
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
            Compre Sua Passagem, Agora !
          </Link>
          <Link to="/area-cliente" className="btn btn-outline btn-sm">
            <User size={16} />
            Área do Cliente
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
