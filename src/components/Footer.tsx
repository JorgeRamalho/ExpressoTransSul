import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, Share2 } from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo variant="full" size="lg" light />
            <p>
              Portal oficial de passagens e horários de ônibus para a região Sul do Brasil.
              RS, SC e PR conectados.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Facebook"><Share2 size={20} /></a>
              <a href="#" aria-label="Instagram"><Share2 size={20} /></a>
              <a href="#" aria-label="YouTube"><Share2 size={20} /></a>
            </div>
          </div>

          <div className="footer__links">
            <h4>Serviços</h4>
            <ul>
              <li><Link to="/horarios">Buscar Passagens</Link></li>
              <li><Link to="/horarios">Consultar Horários</Link></li>
              <li><Link to="/area-cliente">Minhas Reservas</Link></li>
              <li><Link to="/area-cliente">Área do Cliente</Link></li>
              <li><Link to="/cadastro">Cadastre-se</Link></li>
            </ul>
          </div>

          <div className="footer__links">
            <h4>Informações</h4>
            <ul>
              <li><Link to="/companhias">Companhias Parceiras</Link></li>
              <li><Link to="/terminais">Terminais Rodoviários</Link></li>
              <li><Link to="/destinos">Destinos Populares</Link></li>
              <li><a href="#">Política de Privacidade</a></li>
              <li><a href="#">Termos de Uso</a></li>
            </ul>
          </div>

          <div className="footer__contact">
            <h4>Contato</h4>
            <a href="tel:08006474300" className="footer__contact-item">
              <Phone size={18} />
              0800 647 4300
            </a>
            <a href="mailto:contato@expressotranssul.com.br" className="footer__contact-item">
              <Mail size={18} />
              contato@expressotranssul.com.br
            </a>
            <span className="footer__contact-item">
              <MapPin size={18} />
              Região Sul · RS · SC · PR
            </span>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} ExpressoTransSul. Todos os direitos reservados.</p>
          <p className="footer__disclaimer">
            Portal informativo. Compras realizadas junto às transportadoras parceiras.
          </p>
        </div>
      </div>
    </footer>
  );
}
