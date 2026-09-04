export type RouteServiceKind = 'regular' | 'express';
export type BrazilianSouthState = 'RS' | 'SC' | 'PR';

export interface RouteStop {
  city: string;
  state: BrazilianSouthState;
}

export interface RestStop {
  city: string;
  state: BrazilianSouthState;
  durationMinutes: 20;
  boardingAllowed: false;
  disembarkingAllowed: false;
}

export interface Route {
  id: string;
  origin: string;
  originState: BrazilianSouthState;
  destination: string;
  destinationState: BrazilianSouthState;
  stops?: RouteStop[];
  restStop?: RestStop;
  serviceKind: RouteServiceKind;
  distance: number;
  duration: string;
  priceFrom: number;
  companies: string[];
  departures: string[];
}

function expressRest(city: string, state: BrazilianSouthState): RestStop {
  return {
    city,
    state,
    durationMinutes: 20,
    boardingAllowed: false,
    disembarkingAllowed: false,
  };
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
    serviceKind: 'regular',
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
    serviceKind: 'regular',
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
    serviceKind: 'regular',
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
    serviceKind: 'regular',
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
    serviceKind: 'regular',
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
    serviceKind: 'regular',
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
    serviceKind: 'regular',
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
    serviceKind: 'regular',
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
    serviceKind: 'regular',
    companies: ['Garcia', 'Catarinense', 'Penha', 'Reunidas'],
    departures: ['06:00', '08:30', '11:00', '14:00', '17:30', '20:30'],
  },
];

export const expressDirectRoutes: Route[] = [
  {
    id: 'poa-cwb-x',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Curitiba',
    destinationState: 'PR',
    restStop: expressRest('Florianópolis', 'SC'),
    serviceKind: 'express',
    distance: 749,
    duration: '10h 35min',
    priceFrom: 168.00,
    companies: ['Penha', 'Catarinense', 'Garcia'],
    departures: ['06:15', '10:45', '15:20', '21:10'],
  },
  {
    id: 'cwb-poa-x',
    origin: 'Curitiba',
    originState: 'PR',
    destination: 'Porto Alegre',
    destinationState: 'RS',
    restStop: expressRest('Florianópolis', 'SC'),
    serviceKind: 'express',
    distance: 749,
    duration: '10h 35min',
    priceFrom: 168.00,
    companies: ['Garcia', 'Catarinense', 'Penha'],
    departures: ['05:50', '11:10', '16:40', '22:00'],
  },
  {
    id: 'poa-blu-x',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Blumenau',
    destinationState: 'SC',
    restStop: expressRest('Florianópolis', 'SC'),
    serviceKind: 'express',
    distance: 579,
    duration: '7h 45min',
    priceFrom: 118.00,
    companies: ['Catarinense', 'Reunidas'],
    departures: ['06:40', '12:20', '18:10'],
  },
  {
    id: 'poa-joi-x',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Joinville',
    destinationState: 'SC',
    restStop: expressRest('Curitiba', 'PR'),
    serviceKind: 'express',
    distance: 879,
    duration: '12h 10min',
    priceFrom: 179.00,
    companies: ['Penha', 'Garcia'],
    departures: ['07:20', '14:00', '20:30'],
  },
  {
    id: 'cax-fln-x',
    origin: 'Caxias do Sul',
    originState: 'RS',
    destination: 'Florianópolis',
    destinationState: 'SC',
    restStop: expressRest('Porto Alegre', 'RS'),
    serviceKind: 'express',
    distance: 579,
    duration: '7h 50min',
    priceFrom: 118.00,
    companies: ['Ouro e Prata', 'Catarinense'],
    departures: ['05:45', '11:30', '17:15'],
  },
  {
    id: 'cax-cwb-x',
    origin: 'Caxias do Sul',
    originState: 'RS',
    destination: 'Curitiba',
    destinationState: 'PR',
    restStop: expressRest('Porto Alegre', 'RS'),
    serviceKind: 'express',
    distance: 879,
    duration: '12h 20min',
    priceFrom: 189.00,
    companies: ['Penha', 'Planalto'],
    departures: ['06:10', '13:40', '21:00'],
  },
  {
    id: 'pf-fln-x',
    origin: 'Passo Fundo',
    originState: 'RS',
    destination: 'Florianópolis',
    destinationState: 'SC',
    restStop: expressRest('Porto Alegre', 'RS'),
    serviceKind: 'express',
    distance: 769,
    duration: '10h 15min',
    priceFrom: 154.00,
    companies: ['Planalto', 'Reunidas'],
    departures: ['05:20', '12:00', '19:30'],
  },
  {
    id: 'cha-poa-x',
    origin: 'Chapecó',
    originState: 'SC',
    destination: 'Porto Alegre',
    destinationState: 'RS',
    restStop: expressRest('Florianópolis', 'SC'),
    serviceKind: 'express',
    distance: 999,
    duration: '13h 20min',
    priceFrom: 198.00,
    companies: ['Reunidas', 'Eucatur'],
    departures: ['05:10', '14:30', '20:45'],
  },
  {
    id: 'cha-cwb-x',
    origin: 'Chapecó',
    originState: 'SC',
    destination: 'Curitiba',
    destinationState: 'PR',
    restStop: expressRest('Florianópolis', 'SC'),
    serviceKind: 'express',
    distance: 850,
    duration: '11h 40min',
    priceFrom: 186.00,
    companies: ['Reunidas', 'Garcia'],
    departures: ['06:00', '13:15', '21:20'],
  },
  {
    id: 'blu-cwb-x',
    origin: 'Blumenau',
    originState: 'SC',
    destination: 'Curitiba',
    destinationState: 'PR',
    restStop: expressRest('Florianópolis', 'SC'),
    serviceKind: 'express',
    distance: 430,
    duration: '5h 55min',
    priceFrom: 129.00,
    companies: ['Garcia', 'Catarinense'],
    departures: ['07:10', '12:45', '18:30'],
  },
  {
    id: 'joi-fln-x',
    origin: 'Joinville',
    originState: 'SC',
    destination: 'Florianópolis',
    destinationState: 'SC',
    restStop: expressRest('Curitiba', 'PR'),
    serviceKind: 'express',
    distance: 430,
    duration: '5h 50min',
    priceFrom: 124.00,
    companies: ['Penha', 'Garcia'],
    departures: ['07:40', '13:20', '19:10'],
  },
  {
    id: 'poa-fln-x',
    origin: 'Porto Alegre',
    originState: 'RS',
    destination: 'Florianópolis',
    destinationState: 'SC',
    restStop: expressRest('Criciúma', 'SC'),
    serviceKind: 'express',
    distance: 449,
    duration: '5h 40min',
    priceFrom: 94.90,
    companies: ['Catarinense', 'Reunidas', 'Penha'],
    departures: ['06:20', '11:50', '17:40', '22:10'],
  },
];

export const allRoutes: Route[] = [...popularRoutes, ...expressDirectRoutes];

export function findMatchingRoutes(origin: string, destination: string): Route[] {
  const originKey = origin.toLowerCase();
  const destinationKey = destination.toLowerCase();

  return allRoutes.filter(
    (route) =>
      originKey.includes(route.origin.toLowerCase()) &&
      destinationKey.includes(route.destination.toLowerCase()),
  );
}

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
