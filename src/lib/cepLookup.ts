import { formatCep, stripDigits } from './brDocuments';

export interface CepLookupResult {
  valid: boolean;
  message: string;
  source: string | null;
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

interface ViaCepPayload {
  erro?: boolean;
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

interface BrasilApiPayload {
  cep?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

declare global {
  interface Window {
    [key: string]: unknown;
  }
}

function mapViaCep(data: ViaCepPayload, digits: string): CepLookupResult {
  return {
    valid: true,
    message: 'CEP encontrado.',
    source: 'ViaCEP',
    cep: formatCep(data.cep ?? digits),
    logradouro: data.logradouro ?? '',
    complemento: data.complemento ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade ?? '',
    estado: data.uf ?? '',
  };
}

function mapBrasilApi(data: BrasilApiPayload, digits: string): CepLookupResult {
  return {
    valid: true,
    message: 'CEP encontrado.',
    source: 'BrasilAPI',
    cep: formatCep(data.cep ?? digits),
    logradouro: data.street ?? '',
    complemento: '',
    bairro: data.neighborhood ?? '',
    cidade: data.city ?? '',
    estado: data.state ?? '',
  };
}

/** ViaCEP via JSONP — funciona sem API local e sem problemas de CORS. */
function fetchViaCepJsonp(digits: string): Promise<ViaCepPayload> {
  return new Promise((resolve, reject) => {
    const callbackName = `viaCepCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    script.async = true;

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error('Tempo esgotado ao consultar ViaCEP.'));
    }, 12_000);

    function cleanup() {
      window.clearTimeout(timeoutId);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (payload: ViaCepPayload) => {
      cleanup();
      resolve(payload);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Falha na consulta ViaCEP.'));
    };

    script.src = `https://viacep.com.br/ws/${digits}/json/?callback=${callbackName}`;
    document.head.appendChild(script);
  });
}

async function fetchViaCepHttp(digits: string): Promise<ViaCepPayload | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!response.ok) return null;
    return (await response.json()) as ViaCepPayload;
  } catch {
    return null;
  }
}

async function fetchBrasilApi(digits: string): Promise<BrasilApiPayload | null> {
  try {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${digits}`);
    if (!response.ok) return null;
    return (await response.json()) as BrasilApiPayload;
  } catch {
    return null;
  }
}

/** Consulta CEP direto na internet — não depende de servidor local. */
export async function lookupCepOnline(cep: string): Promise<CepLookupResult> {
  const digits = stripDigits(cep);

  if (digits.length !== 8) {
    return {
      valid: false,
      message: 'Informe os 8 dígitos do CEP.',
      source: null,
    };
  }

  try {
    const viaCepData = await fetchViaCepJsonp(digits);
    if (!viaCepData.erro) {
      return mapViaCep(viaCepData, digits);
    }
  } catch {
    const viaCepHttp = await fetchViaCepHttp(digits);
    if (viaCepHttp && !viaCepHttp.erro) {
      return mapViaCep(viaCepHttp, digits);
    }
  }

  const brasilApiData = await fetchBrasilApi(digits);
  if (brasilApiData) {
    return mapBrasilApi(brasilApiData, digits);
  }

  return {
    valid: false,
    message: 'CEP não encontrado. Verifique o número informado.',
    source: null,
  };
}
