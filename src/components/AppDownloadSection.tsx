import { useState } from 'react';
import { Check, Smartphone, QrCode } from 'lucide-react';
import { appScreens, appStoreLinks, type AppScreenId } from '../data/appExperience';
import { AppPhone } from './AppPhone';
import './AppDownloadSection.css';

export function AppDownloadSection() {
  const [screen, setScreen] = useState<AppScreenId>('passagens');

  return (
    <section className="app-download" id="baixar-app" aria-labelledby="app-download-title">
      <div className="container app-download__grid">
        <div>
          <span className="eyebrow">Aplicativo oficial</span>
          <h2 id="app-download-title">Leve o ExpressoTransSul no bolso</h2>
          <p>
            Passagens, horários, reservas, embarques, promoções e sugestões de viagem —
            com a mesma clareza do portal, no ritmo do seu celular.
          </p>

          <ul className="app-download__list">
            {appScreens.map((item) => (
              <li key={item.id}>
                <Check size={16} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.caption}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="app-download__stores">
            {appStoreLinks.map((store) => (
              <a key={store.id} className="btn btn-secondary" href={store.href} target="_blank" rel="noreferrer">
                <Smartphone size={16} />
                {store.label}
              </a>
            ))}
          </div>

          <div className="app-download__qr">
            <QrCode size={28} />
            <p>Aponte a câmera para o QR no terminal ou abra esta página no celular para instalar.</p>
          </div>
        </div>

        <AppPhone activeScreen={screen} onScreenChange={setScreen} />
      </div>
    </section>
  );
}
