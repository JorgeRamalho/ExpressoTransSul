export const FIRST_TRIP_PROMO = {
  code: 'PRIMEIRA20',
  discountLabel: '20% OFF',
  storageKey: 'ets-promo-primeira20',
  deadlineLabel: '30/09',
  eyebrow: 'Campanha de cadastro · Setembro',
  title: 'Motivos pra viajar em Setembro não faltam!',
  description:
    'Ganhe 20% de desconto na primeira passagem ao criar sua conta ExpressoTransSul. Oferta limitada à primeira viagem do CPF.',
  fomo: 'Pegue esse cupom antes que as datas passem!',
  legal:
    'Válido para a primeira compra após o cadastro. Uma utilização por CPF. Consulte o regulamento da campanha.',
} as const;

export function persistFirstTripCoupon(): void {
  try {
    sessionStorage.setItem(FIRST_TRIP_PROMO.storageKey, FIRST_TRIP_PROMO.code);
  } catch {
    // sessionStorage pode estar bloqueado em modo privado
  }
}

export function readFirstTripCoupon(): string {
  try {
    return sessionStorage.getItem(FIRST_TRIP_PROMO.storageKey) ?? FIRST_TRIP_PROMO.code;
  } catch {
    return FIRST_TRIP_PROMO.code;
  }
}
