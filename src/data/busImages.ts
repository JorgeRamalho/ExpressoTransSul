export type BusImageCategory = 'estrada' | 'rodoviaria' | 'parada-rapida';

export interface BusImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: BusImageCategory;
  location?: string;
  credit: string;
}

export const busImages: BusImage[] = [
  {
    id: 'coach-montanha',
    src: '/images/buses/onibus-estrada-coach.jpg',
    alt: 'Ônibus rodoviário executivo grande parado com montanhas ao fundo',
    title: 'Coach Executivo',
    category: 'estrada',
    location: 'Estrada · Região Sul',
    credit: 'Unsplash',
  },
  {
    id: 'estrada-montanha',
    src: '/images/buses/onibus-estrada-montanha.jpg',
    alt: 'Ônibus viajando em estrada com montanhas ao fundo',
    title: 'Viagem na Estrada',
    category: 'estrada',
    location: 'Rodovia · Interior',
    credit: 'Unsplash / Jeffrey W',
  },
  {
    id: 'viagem-por-do-sol',
    src: '/images/buses/onibus-viagem-por-do-sol.jpg',
    alt: 'Ônibus viajando na estrada durante o pôr do sol',
    title: 'Ônibus ao Entardecer',
    category: 'estrada',
    location: 'Rodovia · Viagem noturna',
    credit: 'Unsplash / Milin John',
  },
  {
    id: 'estrada-arvores',
    src: '/images/buses/onibus-estrada-arvores.jpg',
    alt: 'Ônibus circulando em avenida arborizada',
    title: 'Ônibus na Avenida',
    category: 'estrada',
    location: 'Via urbana · Sul do Brasil',
    credit: 'Unsplash',
  },
  {
    id: 'rodoviaria-fln',
    src: '/images/buses/onibus-rodoviaria-florianopolis.jpg',
    alt: 'Ônibus laranja no Terminal Rodoviário de Florianópolis',
    title: 'Terminal Rita Maria',
    category: 'rodoviaria',
    location: 'Florianópolis · SC',
    credit: 'Unsplash / Joao Vitor Marcilio',
  },
  {
    id: 'terminal-passageiros',
    src: '/images/buses/onibus-terminal-passageiros.jpg',
    alt: 'Terminal rodoviário com ônibus e passageiros aguardando embarque',
    title: 'Embarque de Passageiros',
    category: 'rodoviaria',
    location: 'Terminal · Aguardando viagem',
    credit: 'Unsplash / Alan Alves',
  },
  {
    id: 'parado-rodoviaria',
    src: '/images/buses/onibus-parado-rodoviaria.jpg',
    alt: 'Ônibus turismo branco parado na rodoviária sob céu azul',
    title: 'Ônibus na Rodoviária',
    category: 'rodoviaria',
    location: 'Terminal · Região Sul',
    credit: 'Unsplash',
  },
  {
    id: 'parada-lanchonete',
    src: '/images/buses/parada-rapida-lanchonete.jpg',
    alt: 'Lanchonete e restaurante em parada de estrada para refeição rápida',
    title: 'Parada Rápida',
    category: 'parada-rapida',
    location: 'Lanchonete · Restaurante de Estrada',
    credit: 'Unsplash / Louis Hansel',
  },
  {
    id: 'parada-embarque',
    src: '/images/buses/parada-rapida-embarque.jpg',
    alt: 'Passageiros embarcando e desembarcando de ônibus em ponto de conexão',
    title: 'Parada Rápida',
    category: 'parada-rapida',
    location: 'Conexão · Embarque e Desembarque',
    credit: 'Unsplash',
  },
];

export const heroBusImages = busImages.filter((img) => img.category === 'estrada');

export const busImagesByCategory = {
  estrada: busImages.filter((img) => img.category === 'estrada'),
  rodoviaria: busImages.filter((img) => img.category === 'rodoviaria'),
  'parada-rapida': busImages.filter((img) => img.category === 'parada-rapida'),
};
