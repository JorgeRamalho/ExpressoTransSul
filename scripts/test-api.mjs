/**
 * Testes de integração da API (sem browser).
 * Execute: node scripts/test-api.mjs
 */
const API = 'http://127.0.0.1:3001';
const unique = Date.now();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, options);
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

function isValidCpf(cpf) {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === Number(digits[10]);
}

function generateValidCpf() {
  const base = String(Math.floor(Math.random() * 900000000) + 100000000);
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(base[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  const d1 = String(remainder);
  sum = 0;
  const partial = base + d1;
  for (let i = 0; i < 10; i += 1) sum += Number(partial[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return base + d1 + String(remainder);
}

const tests = [];

tests.push(async () => {
  const { response, data } = await request('/api/health');
  assert(response.ok, 'health deve retornar 200');
  assert(data.status === 'ok', 'health status ok');
});

tests.push(async () => {
  const { response, data } = await request('/api/cep/82410450');
  assert(response.ok, 'CEP válido deve retornar 200');
  assert(data.valid === true, 'CEP deve ser válido');
  assert(data.cidade === 'Curitiba', 'cidade deve ser Curitiba');
  assert(data.logradouro, 'logradouro deve vir preenchido');
});

tests.push(async () => {
  const { response, data } = await request('/api/cep/00000000');
  assert(response.status === 404, 'CEP inválido deve retornar 404');
  assert(data.valid === false, 'CEP inválido');
});

tests.push(async () => {
  const cpf = generateValidCpf();
  assert(isValidCpf(cpf), 'CPF de teste deve ser válido');
  const { response, data } = await request('/api/cpf/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cpf }),
  });
  assert(response.ok || response.status === 409, 'CPF validate deve responder');
  assert(data.valid === true, 'CPF matematicamente válido');
});

tests.push(async () => {
  const cpf = generateValidCpf();
  const payload = {
    nome: 'Teste',
    sobrenome: 'Automático',
    cpf,
    rg: '',
    dataNascimento: '1990-01-01',
    sexo: 'M',
    nacionalidade: 'Brasileira',
    profissao: '',
    email: `teste.${unique}@expressotranssul.test`,
    telefone: '',
    celular: '(51) 99999-9999',
    contatoEmergencia: '',
    telefoneEmergencia: '',
    cep: '82410-450',
    cepSource: 'ViaCEP',
    logradouro: 'Rua Deputado Carlos René Egg',
    numero: '100',
    complemento: '',
    bairro: 'Santa Felicidade',
    cidade: 'Curitiba',
    estado: 'PR',
    senha: 'senha12345',
    confirmarSenha: 'senha12345',
    aceitaTermos: true,
    aceitaMarketing: false,
  };

  const { response, data } = await request('/api/passengers/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  assert(response.status === 201, `cadastro deve retornar 201 (recebeu ${response.status})`);
  assert(data.success === true, 'cadastro success true');
  assert(data.passenger?.email === payload.email, 'email retornado');
});

async function main() {
  let passed = 0;
  for (const [index, test] of tests.entries()) {
    try {
      await test();
      passed += 1;
      console.log(`✓ teste ${index + 1}/${tests.length}`);
    } catch (error) {
      console.error(`✗ teste ${index + 1}/${tests.length}: ${error.message}`);
      process.exit(1);
    }
  }
  console.log(`\n${passed}/${tests.length} testes de API passaram.`);
}

main();
