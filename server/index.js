import { createHash, randomBytes } from 'node:crypto';
import express from 'express';
import cors from 'cors';
import { formatCpf, isValidCpf, normalizeCpf } from './lib/cpf.js';
import { createPassenger, findPassengerByCpf, findPassengerByEmail } from './lib/db.js';

const app = express();
const PORT = Number(process.env.API_PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function normalizeCep(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function formatCep(value) {
  const digits = normalizeCep(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function hashPassword(password, salt) {
  return createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ExpressoTransSul API' });
});

app.get('/api/cep/:cep', async (req, res) => {
  const cep = normalizeCep(req.params.cep);

  if (cep.length !== 8) {
    res.status(400).json({
      valid: false,
      message: 'CEP deve conter 8 dígitos.',
      source: null,
    });
    return;
  }

  try {
    const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const viaCepData = await viaCepResponse.json();

    if (!viaCepData.erro) {
      res.json({
        valid: true,
        message: 'CEP confirmado via ViaCEP.',
        source: 'ViaCEP',
        cep: formatCep(viaCepData.cep ?? cep),
        logradouro: viaCepData.logradouro ?? '',
        complemento: viaCepData.complemento ?? '',
        bairro: viaCepData.bairro ?? '',
        cidade: viaCepData.localidade ?? '',
        estado: viaCepData.uf ?? '',
        ibge: viaCepData.ibge ?? '',
      });
      return;
    }

    const brasilApiResponse = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
    if (brasilApiResponse.ok) {
      const brasilApiData = await brasilApiResponse.json();
      res.json({
        valid: true,
        message: 'CEP confirmado via BrasilAPI.',
        source: 'BrasilAPI',
        cep: formatCep(brasilApiData.cep ?? cep),
        logradouro: brasilApiData.street ?? '',
        complemento: '',
        bairro: brasilApiData.neighborhood ?? '',
        cidade: brasilApiData.city ?? '',
        estado: brasilApiData.state ?? '',
        ibge: '',
      });
      return;
    }

    res.status(404).json({
      valid: false,
      message: 'CEP não encontrado. Verifique o número informado.',
      source: null,
    });
  } catch {
    res.status(502).json({
      valid: false,
      message: 'Não foi possível consultar o CEP no momento. Tente novamente.',
      source: null,
    });
  }
});

app.post('/api/cpf/validate', async (req, res) => {
  const cpf = normalizeCpf(req.body?.cpf);

  if (cpf.length !== 11) {
    res.status(400).json({
      valid: false,
      exists: false,
      message: 'CPF deve conter 11 dígitos.',
      formatted: formatCpf(cpf),
    });
    return;
  }

  if (!isValidCpf(cpf)) {
    res.status(400).json({
      valid: false,
      exists: false,
      message: 'CPF inválido. Verifique os números informados.',
      formatted: formatCpf(cpf),
    });
    return;
  }

  const existing = await findPassengerByCpf(cpf);
  if (existing) {
    res.status(409).json({
      valid: true,
      exists: true,
      message: 'CPF válido, porém já cadastrado em nossa base.',
      formatted: formatCpf(cpf),
    });
    return;
  }

  res.json({
    valid: true,
    exists: false,
    message: 'CPF válido e disponível para cadastro.',
    formatted: formatCpf(cpf),
  });
});

app.post('/api/passengers/register', async (req, res) => {
  const body = req.body ?? {};
  const cpf = normalizeCpf(body.cpf);
  const email = String(body.email ?? '').trim().toLowerCase();
  const cep = normalizeCep(body.cep);
  const password = String(body.senha ?? '');
  const confirmPassword = String(body.confirmarSenha ?? '');

  const errors = [];

  if (!body.nome?.trim()) errors.push('Nome é obrigatório.');
  if (!body.sobrenome?.trim()) errors.push('Sobrenome é obrigatório.');
  if (!isValidCpf(cpf)) errors.push('CPF inválido.');
  if (!body.dataNascimento) errors.push('Data de nascimento é obrigatória.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('E-mail inválido.');
  if (!body.celular?.trim()) errors.push('Celular é obrigatório.');
  if (cep.length !== 8) errors.push('CEP inválido.');
  if (!body.logradouro?.trim()) errors.push('Logradouro é obrigatório.');
  if (!body.numero?.trim()) errors.push('Número é obrigatório.');
  if (!body.bairro?.trim()) errors.push('Bairro é obrigatório.');
  if (!body.cidade?.trim()) errors.push('Cidade é obrigatória.');
  if (!body.estado?.trim()) errors.push('Estado é obrigatório.');
  if (password.length < 8) errors.push('Senha deve ter no mínimo 8 caracteres.');
  if (password !== confirmPassword) errors.push('As senhas não coincidem.');
  if (!body.aceitaTermos) errors.push('É necessário aceitar os termos de uso.');

  if (errors.length > 0) {
    res.status(400).json({ success: false, message: 'Corrija os campos indicados.', errors });
    return;
  }

  if (await findPassengerByCpf(cpf)) {
    res.status(409).json({ success: false, message: 'CPF já cadastrado.' });
    return;
  }

  if (await findPassengerByEmail(email)) {
    res.status(409).json({ success: false, message: 'E-mail já cadastrado.' });
    return;
  }

  const salt = randomBytes(16).toString('hex');

  const passenger = await createPassenger({
    nome: body.nome.trim(),
    sobrenome: body.sobrenome.trim(),
    cpf,
    cpfFormatted: formatCpf(cpf),
    rg: body.rg?.trim() ?? '',
    dataNascimento: body.dataNascimento,
    sexo: body.sexo ?? '',
    nacionalidade: body.nacionalidade?.trim() ?? 'Brasileira',
    profissao: body.profissao?.trim() ?? '',
    email,
    telefone: body.telefone?.trim() ?? '',
    celular: body.celular.trim(),
    contatoEmergencia: body.contatoEmergencia?.trim() ?? '',
    telefoneEmergencia: body.telefoneEmergencia?.trim() ?? '',
    cep: formatCep(cep),
    cepSource: body.cepSource ?? 'manual',
    logradouro: body.logradouro.trim(),
    numero: body.numero.trim(),
    complemento: body.complemento?.trim() ?? '',
    bairro: body.bairro.trim(),
    cidade: body.cidade.trim(),
    estado: body.estado.trim(),
    aceitaMarketing: Boolean(body.aceitaMarketing),
    passwordHash: hashPassword(password, salt),
    passwordSalt: salt,
  });

  res.status(201).json({
    success: true,
    message: 'Cadastro realizado com sucesso.',
    passenger: {
      id: passenger.id,
      nome: `${passenger.nome} ${passenger.sobrenome}`,
      email: passenger.email,
      cpf: passenger.cpfFormatted,
    },
  });
});

app.post('/api/passengers/login', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.senha ?? '');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
    res.status(400).json({ success: false, message: 'Informe e-mail e senha válidos.' });
    return;
  }

  const passenger = await findPassengerByEmail(email);
  if (!passenger || hashPassword(password, passenger.passwordSalt) !== passenger.passwordHash) {
    res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
    return;
  }

  res.json({
    success: true,
    message: 'Login realizado com sucesso.',
    passenger: {
      id: passenger.id,
      nome: `${passenger.nome} ${passenger.sobrenome}`,
      email: passenger.email,
      cpf: passenger.cpfFormatted,
    },
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`ExpressoTransSul API em http://127.0.0.1:${PORT}`);
});
