export type TravelMood = 'praia' | 'serra' | 'cidade' | 'natureza';

export interface TravelSuggestion {
  id: string;
  mood: TravelMood;
  title: string;
  origin: string;
  originState: 'RS' | 'SC' | 'PR';
  destination: string;
  destinationState: 'RS' | 'SC' | 'PR';
  hook: string;
  season: string;
  duration: string;
  priceFrom: number;
  expressAvailable: boolean;
}

export const travelMoods: { id: TravelMood; label: string; hint: string }[] = [
  { id: 'praia', label: 'Praia', hint: 'Mar, ilhas e orla' },
  { id: 'serra', label: 'Serra', hint: 'Frio, vinho e vista' },
  { id: 'cidade', label: 'Cidade', hint: 'Cultura e gastronomia' },
  { id: 'natureza', label: 'Natureza', hint: 'Parques e trilhas' },
];

export const travelSuggestions: TravelSuggestion[] = [
  {
    id: 'poa-fln-praia',
    mood: 'praia',
    title: 'Fim de semana em Florianópolis',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Florianópolis',
    destinationState: 'SC',
    hook: 'Chegue mais cedo na ilha com a Linha Direta e só uma pausa de 20 minutos.',
    season: 'Setembro a dezembro',
    duration: '5h 40min',
    priceFrom: 94.90,
    expressAvailable: true,
  },
  {
    id: 'cwb-fln-praia',
    mood: 'praia',
    title: 'Curitiba → Ilha da Magia',
    origin: 'Curitiba',
    originState: 'PR',
    destination: 'Florianópolis',
    destinationState: 'SC',
    hook: 'Saia depois do almoço e ainda aproveite o pôr do sol na Beira-Mar.',
    season: 'Primavera',
    duration: '4h 30min',
    priceFrom: 89.90,
    expressAvailable: false,
  },
  {
    id: 'poa-cax-serra',
    mood: 'serra',
    title: 'Serra Gaúcha em um pulo',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Caxias do Sul',
    destinationState: 'RS',
    hook: 'Rota curta para quem quer vinícolas, fondue e clima de montanha.',
    season: 'Outono e inverno',
    duration: '2h 15min',
    priceFrom: 45.00,
    expressAvailable: false,
  },
  {
    id: 'cax-fln-serra',
    mood: 'serra',
    title: 'Da serra ao mar sem trocar de ônibus',
    origin: 'Caxias do Sul',
    originState: 'RS',
    destination: 'Florianópolis',
    destinationState: 'SC',
    hook: 'Linha Direta com descanso em Porto Alegre — sem novo embarque.',
    season: 'O ano todo',
    duration: '7h 50min',
    priceFrom: 118.00,
    expressAvailable: true,
  },
  {
    id: 'poa-cwb-cidade',
    mood: 'cidade',
    title: 'Porto Alegre → Curitiba Direto',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Curitiba',
    destinationState: 'PR',
    hook: 'Caminho direto entre as capitais, com pausa de 20 min em Florianópolis.',
    season: 'Ideal para escapes urbanos',
    duration: '10h 35min',
    priceFrom: 168.00,
    expressAvailable: true,
  },
  {
    id: 'cwb-joi-cidade',
    mood: 'cidade',
    title: 'Curitiba e Joinville no mesmo dia',
    origin: 'Curitiba',
    originState: 'PR',
    destination: 'Joinville',
    destinationState: 'SC',
    hook: 'Duas horas de viagem para reuniões, compras ou um jantar diferente.',
    season: 'Dias úteis',
    duration: '2h 00min',
    priceFrom: 55.00,
    expressAvailable: false,
  },
  {
    id: 'cha-fln-natureza',
    mood: 'natureza',
    title: 'Oeste catarinense até o litoral',
    origin: 'Chapecó',
    originState: 'SC',
    destination: 'Florianópolis',
    destinationState: 'SC',
    hook: 'Saia do interior e chegue à ilha sem escalas comerciais pelo caminho.',
    season: 'Primavera',
    duration: '8h 00min',
    priceFrom: 120.00,
    expressAvailable: false,
  },
  {
    id: 'blu-cwb-natureza',
    mood: 'natureza',
    title: 'Vale do Itajaí → Curitiba',
    origin: 'Blumenau',
    originState: 'SC',
    destination: 'Curitiba',
    destinationState: 'PR',
    hook: 'Linha Direta com descanso em Florianópolis e paisagem de serra.',
    season: 'Outono',
    duration: '5h 55min',
    priceFrom: 129.00,
    expressAvailable: true,
  },
];
