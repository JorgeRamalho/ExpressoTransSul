import { FIRST_TRIP_PROMO } from './promoCampaign';

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  discountLabel: string;
  deadline: string;
  tone: 'gold' | 'ocean' | 'sunset' | 'forest';
  audience: string;
}

export const promotions: Promotion[] = [
  {
    id: 'primeira-viagem',
    code: FIRST_TRIP_PROMO.code,
    title: 'Primeira viagem com 20% OFF',
    description: 'Crie sua conta e ganhe desconto na primeira passagem do CPF.',
    discountLabel: '20% OFF',
    deadline: FIRST_TRIP_PROMO.deadlineLabel,
    tone: 'gold',
    audience: 'Novos passageiros',
  },
  {
    id: 'linha-direta',
    code: 'DIRETO20',
    title: 'Linha Direta com descanso único',
    description: '10% nas rotas express com parada de 20 minutos sem embarque comercial.',
    discountLabel: '10% OFF',
    deadline: '15/10',
    tone: 'ocean',
    audience: 'Quem quer chegar mais rápido',
  },
  {
    id: 'ida-volta',
    code: 'SULVOLTA',
    title: 'Ida e volta pelo Sul',
    description: 'Economize na volta ao reservar o trecho completo no mesmo pedido.',
    discountLabel: '15% OFF',
    deadline: '31/10',
    tone: 'sunset',
    audience: 'Viagens de fim de semana',
  },
  {
    id: 'app-exclusivo',
    code: 'APPETS',
    title: 'Exclusivo no app',
    description: 'Reserve pelo aplicativo e ganhe embarque prioritário + cupom extra.',
    discountLabel: 'R$ 15',
    deadline: '30/11',
    tone: 'forest',
    audience: 'Usuários do app',
  },
];
