import { lookupCepOnline, type CepLookupResult } from '../lib/cepLookup';
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

export interface RegisterPassengerResponse {
  success: boolean;
  message: string;
  passenger?: {
    id: string;
    nome: string;
    email: string;
    cpf: string;
  };
  errors?: string[];
}

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

/** CEP sempre consultado direto na internet (ViaCEP / BrasilAPI). */
export async function lookupCep(cep: string): Promise<CepLookupResult> {
  return lookupCepOnline(cep);
}

export async function validateCpfRemote(cpf: string): Promise<CpfValidationResult> {
  try {
    const response = await fetch(`${API_BASE}/api/cpf/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: stripDigits(cpf) }),
    });
    return parseJson<CpfValidationResult>(response);
  } catch {
    throw new Error('API offline');
  }
}

export async function registerPassenger(payload: RegisterPassengerPayload): Promise<RegisterPassengerResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/passengers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await parseJson<RegisterPassengerResponse>(response);
    if (!response.ok && data.success !== false) {
      return { success: false, message: 'Não foi possível concluir o cadastro.' };
    }
    return data;
  } catch {
    throw new Error('API offline');
  }
}

export async function checkApiHealth(): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
