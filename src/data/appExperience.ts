export interface AppStoreLink {
  id: 'android' | 'ios';
  label: string;
  store: string;
  href: string;
}

export const appStoreLinks: AppStoreLink[] = [
  {
    id: 'android',
    label: 'Baixar no Android',
    store: 'Google Play',
    href: 'https://play.google.com/store',
  },
  {
    id: 'ios',
    label: 'Baixar no iPhone',
    store: 'App Store',
    href: 'https://apps.apple.com/br',
  },
];

export const appScreens = [
  {
    id: 'passagens',
    title: 'Passagens',
    caption: 'Compare preços e reserve em segundos.',
  },
  {
    id: 'horarios',
    title: 'Horários',
    caption: 'Grade ao vivo das linhas do Sul.',
  },
  {
    id: 'reservas',
    title: 'Reservas',
    caption: 'Assento, QR e status da viagem.',
  },
  {
    id: 'embarques',
    title: 'Embarques',
    caption: 'Plataforma e portão em tempo real.',
  },
  {
    id: 'promocoes',
    title: 'Promoções',
    caption: 'Cupons exclusivos do aplicativo.',
  },
  {
    id: 'sugestoes',
    title: 'Sugestões',
    caption: 'Roteiros pensados para o seu humor.',
  },
] as const;

export type AppScreenId = (typeof appScreens)[number]['id'];
