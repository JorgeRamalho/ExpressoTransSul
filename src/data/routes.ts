export interface RouteStop {
  city: string;
  state: 'RS' | 'SC' | 'PR';
}

export interface Route {
  id: string;
  origin: string;
  originState: 'RS' | 'SC' | 'PR';
  destination: string;
  destinationState: 'RS' | 'SC' | 'PR';
  stops?: RouteStop[];
  distance: number;
  duration: string;
  priceFrom: number;
  companies: string[];
  departures: string[];
}

export const popularRoutes: Route[] = [
  {
    id: 'poa-fln',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Florianópolis',
    destinationState: 'SC',
    distance: 449,
    duration: '6h 25min',
    priceFrom: 74.99,
    companies: ['Catarinense', 'Reunidas', 'Penha', 'Planalto'],
    departures: ['06:00', '08:30', '11:00', '14:30', '17:00', '20:00', '22:30'],
  },
  {
    id: 'poa-cwb',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Curitiba',
    destinationState: 'PR',
    distance: 749,
    duration: '11h 30min',
    priceFrom: 134.98,
    companies: ['Penha', 'Catarinense', 'Garcia', 'Eucatur'],
    departures: ['07:00', '09:30', '12:00', '14:45', '18:00', '21:00'],
  },
  {
    id: 'cwb-fln',
    origin: 'Curitiba',
    originState: 'PR',
    destination: 'Florianópolis',
    destinationState: 'SC',
    distance: 300,
    duration: '4h 30min',
    priceFrom: 89.90,
    companies: ['Garcia', 'Catarinense', 'Penha'],
    departures: ['06:30', '08:00', '10:30', '13:00', '15:00', '17:30', '20:00'],
  },
  {
    id: 'poa-cax',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Caxias do Sul',
    destinationState: 'RS',
    distance: 130,
    duration: '2h 15min',
    priceFrom: 45.00,
    companies: ['Ouro e Prata', 'Planalto'],
    departures: ['05:30', '07:00', '09:00', '11:30', '14:00', '16:30', '19:00'],
  },
  {
    id: 'fln-blu',
    origin: 'Florianópolis',
    originState: 'SC',
    destination: 'Blumenau',
    destinationState: 'SC',
    distance: 130,
    duration: '2h 00min',
    priceFrom: 52.00,
    companies: ['Catarinense', 'Reunidas'],
    departures: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
  },
  {
    id: 'poa-pf',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Passo Fundo',
    destinationState: 'RS',
    distance: 320,
    duration: '4h 30min',
    priceFrom: 68.00,
    companies: ['Planalto', 'Helios', 'Reunidas'],
    departures: ['06:30', '09:00', '12:00', '15:30', '18:00', '21:00'],
  },
  {
    id: 'cwb-joi',
    origin: 'Curitiba',
    originState: 'PR',
    destination: 'Joinville',
    destinationState: 'SC',
    distance: 130,
    duration: '2h 00min',
    priceFrom: 55.00,
    companies: ['Penha', 'Garcia'],
    departures: ['07:00', '09:30', '12:00', '14:30', '17:00', '19:30'],
  },
  {
    id: 'cha-fln',
    origin: 'Chapecó',
    originState: 'SC',
    destination: 'Florianópolis',
    destinationState: 'SC',
    distance: 550,
    duration: '8h 00min',
    priceFrom: 120.00,
    companies: ['Reunidas', 'Eucatur', 'Real'],
    departures: ['05:00', '08:00', '11:00', '14:00', '17:00', '20:00'],
  },
  {
    id: 'cwb-fln-poa',
    origin: 'Curitiba',
    originState: 'PR',
    destination: 'Porto Alegre',
    destinationState: 'RS',
    stops: [
      { city: 'Curitiba', state: 'PR' },
      { city: 'Florianópolis', state: 'SC' },
      { city: 'Porto Alegre', state: 'RS' },
    ],
    distance: 749,
    duration: '11h 15min',
    priceFrom: 149.90,
    companies: ['Garcia', 'Catarinense', 'Penha', 'Reunidas'],
    departures: ['06:00', '08:30', '11:00', '14:00', '17:30', '20:30'],
  },
];

export const cities = [
  { name: 'Porto Alegre', state: 'RS' },
  { name: 'Curitiba', state: 'PR' },
  { name: 'Florianópolis', state: 'SC' },
  { name: 'Joinville', state: 'SC' },
  { name: 'Blumenau', state: 'SC' },
  { name: 'Caxias do Sul', state: 'RS' },
  { name: 'Pelotas', state: 'RS' },
  { name: 'Santa Maria', state: 'RS' },
  { name: 'Passo Fundo', state: 'RS' },
  { name: 'Chapecó', state: 'SC' },
  { name: 'Criciúma', state: 'SC' },
  { name: 'Londrina', state: 'PR' },
  { name: 'Ponta Grossa', state: 'PR' },
  { name: 'Gramado', state: 'RS' },
  { name: 'Balneário Camboriú', state: 'SC' },
  { name: 'Foz do Iguaçu', state: 'PR' },
  { name: 'Uruguaiana', state: 'RS' },
  { name: 'Erechim', state: 'RS' },
  { name: 'Lages', state: 'SC' },
  { name: 'Caçador', state: 'SC' },
];
