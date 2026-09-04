import { formatCep, formatCpf, isValidCpf, stripDigits } from './brDocuments';
import type {
  CpfValidationResult,
  LoginPassengerResponse,
  RegisterPassengerPayload,
  RegisterPassengerResponse,
} from '../services/registrationApi';
import { createSalt, hashPassword } from './passwordHash';

const DB_KEY = 'ets_passengers_db';

interface StoredPassenger {
  id: string;
  createdAt: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  cpfFormatted: string;
  email: string;
  celular: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  passwordHash?: string;
  passwordSalt?: string;
}

function readDb(): { passengers: StoredPassenger[] } {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) ?? '{"passengers":[]}') as { passengers: StoredPassenger[] };
  } catch {
    return { passengers: [] };
  }
}

function writeDb(db: { passengers: StoredPassenger[] }) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function validateCpfLocal(cpf: string): CpfValidationResult {
  const digits = stripDigits(cpf);
  const formatted = formatCpf(digits);

  if (digits.length !== 11) {
    return { valid: false, exists: false, message: 'CPF deve conter 11 dígitos.', formatted };
  }

  if (!isValidCpf(digits)) {
    return { valid: false, exists: false, message: 'CPF inválido. Verifique os números informados.', formatted };
  }

  const exists = readDb().passengers.some((passenger) => passenger.cpf === digits);
  if (exists) {
    return {
      valid: true,
      exists: true,
      message: 'CPF válido, porém já cadastrado em nossa base.',
      formatted,
    };
  }

  return {
    valid: true,
    exists: false,
    message: 'CPF válido e disponível para cadastro.',
    formatted,
  };
}

export async function registerPassengerLocal(payload: RegisterPassengerPayload): Promise<RegisterPassengerResponse> {
  const cpf = stripDigits(payload.cpf);
  const email = payload.email.trim().toLowerCase();
  const cep = stripDigits(payload.cep);
  const errors: string[] = [];

  if (!payload.nome.trim()) errors.push('Nome é obrigatório.');
  if (!payload.sobrenome.trim()) errors.push('Sobrenome é obrigatório.');
  if (!isValidCpf(cpf)) errors.push('CPF inválido.');
  if (!payload.dataNascimento) errors.push('Data de nascimento é obrigatória.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('E-mail inválido.');
  if (!payload.celular.trim()) errors.push('Celular é obrigatório.');
  if (cep.length !== 8) errors.push('CEP inválido.');
  if (!payload.logradouro.trim()) errors.push('Logradouro é obrigatório.');
  if (!payload.numero.trim()) errors.push('Número é obrigatório.');
  if (!payload.bairro.trim()) errors.push('Bairro é obrigatório.');
  if (!payload.cidade.trim()) errors.push('Cidade é obrigatória.');
  if (!payload.estado.trim()) errors.push('Estado é obrigatório.');
  if (payload.senha.length < 8) errors.push('Senha deve ter no mínimo 8 caracteres.');
  if (payload.senha !== payload.confirmarSenha) errors.push('As senhas não coincidem.');
  if (!payload.aceitaTermos) errors.push('É necessário aceitar os termos de uso.');

  if (errors.length > 0) {
    return { success: false, message: 'Corrija os campos indicados.', errors };
  }

  const db = readDb();
  if (db.passengers.some((passenger) => passenger.cpf === cpf)) {
    return { success: false, message: 'CPF já cadastrado.' };
  }
  if (db.passengers.some((passenger) => passenger.email === email)) {
    return { success: false, message: 'E-mail já cadastrado.' };
  }

  const passwordSalt = createSalt();
  const passwordHash = await hashPassword(payload.senha, passwordSalt);

  const passenger: StoredPassenger = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    nome: payload.nome.trim(),
    sobrenome: payload.sobrenome.trim(),
    cpf,
    cpfFormatted: formatCpf(cpf),
    email,
    celular: payload.celular.trim(),
    cep: formatCep(cep),
    logradouro: payload.logradouro.trim(),
    numero: payload.numero.trim(),
    bairro: payload.bairro.trim(),
    cidade: payload.cidade.trim(),
    estado: payload.estado.trim(),
    passwordHash,
    passwordSalt,
  };

  db.passengers.push(passenger);
  writeDb(db);

  return {
    success: true,
    message: 'Cadastro realizado com sucesso.',
    passenger: {
      id: passenger.id,
      nome: `${passenger.nome} ${passenger.sobrenome}`,
      email: passenger.email,
      cpf: passenger.cpfFormatted,
    },
  };
}

function toAuthPassenger(passenger: StoredPassenger): LoginPassengerResponse {
  return {
    success: true,
    message: 'Login realizado com sucesso.',
    passenger: {
      id: passenger.id,
      nome: `${passenger.nome} ${passenger.sobrenome}`,
      email: passenger.email,
      cpf: passenger.cpfFormatted,
    },
  };
}

export async function syncPassengerLocal(payload: RegisterPassengerPayload): Promise<void> {
  const cpf = stripDigits(payload.cpf);
  const email = payload.email.trim().toLowerCase();
  if (!isValidCpf(cpf) || !email) return;

  const db = readDb();
  const existing = db.passengers.find((item) => item.email === email || item.cpf === cpf);
  const passwordSalt = createSalt();
  const passwordHash = await hashPassword(payload.senha, passwordSalt);

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.passwordSalt = passwordSalt;
    existing.nome = payload.nome.trim() || existing.nome;
    existing.sobrenome = payload.sobrenome.trim() || existing.sobrenome;
    existing.email = email;
    existing.cpf = cpf;
    existing.cpfFormatted = formatCpf(cpf);
    writeDb(db);
    return;
  }

  db.passengers.push({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    nome: payload.nome.trim(),
    sobrenome: payload.sobrenome.trim(),
    cpf,
    cpfFormatted: formatCpf(cpf),
    email,
    celular: payload.celular.trim(),
    cep: formatCep(stripDigits(payload.cep)),
    logradouro: payload.logradouro.trim(),
    numero: payload.numero.trim(),
    bairro: payload.bairro.trim(),
    cidade: payload.cidade.trim(),
    estado: payload.estado.trim(),
    passwordHash,
    passwordSalt,
  });
  writeDb(db);
}

export async function loginPassengerLocal(email: string, senha: string): Promise<LoginPassengerResponse> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !senha) {
    return { success: false, message: 'Informe e-mail e senha.' };
  }

  const db = readDb();
  const passenger = db.passengers.find((item) => item.email === normalized);
  if (!passenger) {
    return { success: false, message: 'E-mail ou senha incorretos.' };
  }

  if (!passenger.passwordHash || !passenger.passwordSalt) {
    passenger.passwordSalt = createSalt();
    passenger.passwordHash = await hashPassword(senha, passenger.passwordSalt);
    writeDb(db);
    return toAuthPassenger(passenger);
  }

  const hash = await hashPassword(senha, passenger.passwordSalt);
  if (hash !== passenger.passwordHash) {
    return { success: false, message: 'E-mail ou senha incorretos.' };
  }

  return toAuthPassenger(passenger);
}
