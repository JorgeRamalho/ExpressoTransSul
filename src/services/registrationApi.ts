import { lookupCepOnline, type CepLookupResult } from '../lib/cepLookup';
import {
  loginPassengerLocal,
  registerPassengerLocal,
  syncPassengerLocal,
  validateCpfLocal,
} from '../lib/localRegistrationStore';
import { stripDigits } from '../lib/brDocuments';

export type { CepLookupResult };

export interface CpfValidationResult {
  valid: boolean;
  exists: boolean;
  message: string;
  formatted: string;
}

export interface RegisterPassengerPayload {
  nome: string;
  sobrenome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  sexo: string;
  nacionalidade: string;
  profissao: string;
  email: string;
  telefone: string;
  celular: string;
  contatoEmergencia: string;
  telefoneEmergencia: string;
  cep: string;
  cepSource: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  senha: string;
  confirmarSenha: string;
  aceitaTermos: boolean;
  aceitaMarketing: boolean;
}

export interface AuthPassenger {
  id: string;
  nome: string;
  email: string;
  cpf: string;
}

export interface RegisterPassengerResponse {
  success: boolean;
  message: string;
  passenger?: AuthPassenger;
  errors?: string[];
}

export interface LoginPassengerResponse {
  success: boolean;
  message: string;
  passenger?: AuthPassenger;
}

const DEFAULT_API_BASE = 'http://127.0.0.1:3001';
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || DEFAULT_API_BASE;

function isViteDevPort(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.port === '5173';
}

function resolveApiUrl(path: string): string {
  if (isViteDevPort()) {
    return path;
  }
  return `${API_BASE}${path}`;
}

async function parseJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('Resposta da API não é JSON.');
  }
  return (await response.json()) as T;
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(resolveApiUrl(path), init);
}

/** CEP sempre consultado direto na internet (ViaCEP / BrasilAPI). */
export async function lookupCep(cep: string): Promise<CepLookupResult> {
  return lookupCepOnline(cep);
}

export async function validateCpfRemote(cpf: string): Promise<CpfValidationResult> {
  try {
    const response = await apiFetch('/api/cpf/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: stripDigits(cpf) }),
    });
    return parseJson<CpfValidationResult>(response);
  } catch {
    return validateCpfLocal(cpf);
  }
}

export async function registerPassenger(payload: RegisterPassengerPayload): Promise<RegisterPassengerResponse> {
  try {
    const response = await apiFetch('/api/passengers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await parseJson<RegisterPassengerResponse>(response);
    if (data.success && data.passenger) {
      await syncPassengerLocal(payload);
      return data;
    }
    if (data.success === false && (response.status === 400 || response.status === 409)) {
      return data;
    }
  } catch {
    // API indisponível — salva localmente
  }

  try {
    return await registerPassengerLocal(payload);
  } catch {
    return { success: false, message: 'Não foi possível salvar o cadastro. Tente novamente.' };
  }
}

export async function loginPassenger(email: string, senha: string): Promise<LoginPassengerResponse> {
  try {
    const response = await apiFetch('/api/passengers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const data = await parseJson<LoginPassengerResponse>(response);
    if (data.success && data.passenger) {
      return data;
    }
  } catch {
    // API indisponível — tenta o cadastro local
  }

  try {
    return await loginPassengerLocal(email, senha);
  } catch {
    return { success: false, message: 'Não foi possível entrar. Tente novamente.' };
  }
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await apiFetch('/api/health');
    return response.ok;
  } catch {
    return false;
  }
}

export async function isRegistrationAvailable(): Promise<boolean> {
  if (await checkApiHealth()) return true;
  return typeof localStorage !== 'undefined';
}
