/**
 * Fallback local da API ExpressoTransSul para Live Server / dist.
 * Intercepta CEP, validação de CPF e cadastro quando a API Node não está rodando.
 */
(function () {
  var DB_KEY = 'ets_passengers_db';
  var INVALID_CPFS = {
    '00000000000': true,
    '11111111111': true,
    '22222222222': true,
    '33333333333': true,
    '44444444444': true,
    '55555555555': true,
    '66666666666': true,
    '77777777777': true,
    '88888888888': true,
    '99999999999': true,
  };

  function stripDigits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function formatCep(digits) {
    if (digits.length <= 5) return digits;
    return digits.slice(0, 5) + '-' + digits.slice(5);
  }

  function formatCpf(value) {
    var digits = stripDigits(value).slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return digits.slice(0, 3) + '.' + digits.slice(3);
    if (digits.length <= 9) return digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6);
    return digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6, 9) + '-' + digits.slice(9);
  }

  function isValidCpf(value) {
    var cpf = stripDigits(value);
    if (cpf.length !== 11 || INVALID_CPFS[cpf]) return false;

    var sum = 0;
    var i;
    for (i = 0; i < 9; i += 1) sum += Number(cpf[i]) * (10 - i);
    var remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== Number(cpf[9])) return false;

    sum = 0;
    for (i = 0; i < 10; i += 1) sum += Number(cpf[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    return remainder === Number(cpf[10]);
  }

  function readDb() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEY) || '{"passengers":[]}');
    } catch (_err) {
      return { passengers: [] };
    }
  }

  function writeDb(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  function parseBody(init) {
    if (!init || !init.body) return {};
    try {
      return JSON.parse(init.body);
    } catch (_err) {
      return {};
    }
  }

  function jsonResponse(body, status) {
    return new Response(JSON.stringify(body), {
      status: status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  function mapViaCep(data, digits) {
    return {
      valid: true,
      message: 'CEP confirmado via ViaCEP.',
      source: 'ViaCEP',
      cep: formatCep(stripDigits(data.cep || digits)),
      logradouro: data.logradouro || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
    };
  }

  function mapBrasilApi(data, digits) {
    return {
      valid: true,
      message: 'CEP confirmado via BrasilAPI.',
      source: 'BrasilAPI',
      cep: formatCep(stripDigits(data.cep || digits)),
      logradouro: data.street || '',
      complemento: '',
      bairro: data.neighborhood || '',
      cidade: data.city || '',
      estado: data.state || '',
    };
  }

  function fetchViaCepJsonp(digits) {
    return new Promise(function (resolve, reject) {
      var callbackName = 'viaCepPatch_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      var script = document.createElement('script');
      script.async = true;

      var timeoutId = window.setTimeout(function () {
        cleanup();
        reject(new Error('timeout'));
      }, 12000);

      function cleanup() {
        window.clearTimeout(timeoutId);
        try {
          delete window[callbackName];
        } catch (_err) {
          window[callbackName] = undefined;
        }
        script.remove();
      }

      window[callbackName] = function (payload) {
        cleanup();
        resolve(payload);
      };

      script.onerror = function () {
        cleanup();
        reject(new Error('script error'));
      };

      script.src = 'https://viacep.com.br/ws/' + digits + '/json/?callback=' + callbackName;
      document.head.appendChild(script);
    });
  }

  var originalFetch = window.fetch.bind(window);

  async function lookupCepOnline(digits) {
    if (digits.length !== 8) {
      return { valid: false, message: 'CEP deve conter 8 dígitos.', source: null };
    }

    try {
      var viaCepData = await fetchViaCepJsonp(digits);
      if (!viaCepData.erro) return mapViaCep(viaCepData, digits);
    } catch (_err) {
      try {
        var httpRes = await originalFetch('https://viacep.com.br/ws/' + digits + '/json/');
        if (httpRes.ok) {
          var httpData = await httpRes.json();
          if (!httpData.erro) return mapViaCep(httpData, digits);
        }
      } catch (_err2) {
        /* tenta BrasilAPI */
      }
    }

    try {
      var brRes = await originalFetch('https://brasilapi.com.br/api/cep/v2/' + digits);
      if (brRes.ok) return mapBrasilApi(await brRes.json(), digits);
    } catch (_err3) {
      /* segue */
    }

    return { valid: false, message: 'CEP não encontrado. Verifique o número informado.', source: null };
  }

  function validateCpfRequest(body) {
    var cpf = stripDigits(body.cpf);
    var formatted = formatCpf(cpf);

    if (cpf.length !== 11) {
      return jsonResponse(
        { valid: false, exists: false, message: 'CPF deve conter 11 dígitos.', formatted: formatted },
        400,
      );
    }

    if (!isValidCpf(cpf)) {
      return jsonResponse(
        { valid: false, exists: false, message: 'CPF inválido. Verifique os números informados.', formatted: formatted },
        400,
      );
    }

    var db = readDb();
    var exists = db.passengers.some(function (passenger) {
      return passenger.cpf === cpf;
    });

    if (exists) {
      return jsonResponse(
        { valid: true, exists: true, message: 'CPF válido, porém já cadastrado em nossa base.', formatted: formatted },
        409,
      );
    }

    return jsonResponse(
      { valid: true, exists: false, message: 'CPF válido e disponível para cadastro.', formatted: formatted },
      200,
    );
  }

  function registerPassengerRequest(body) {
    var cpf = stripDigits(body.cpf);
    var email = String(body.email || '').trim().toLowerCase();
    var cep = stripDigits(body.cep);
    var password = String(body.senha || '');
    var confirmPassword = String(body.confirmarSenha || '');
    var errors = [];

    if (!body.nome || !String(body.nome).trim()) errors.push('Nome é obrigatório.');
    if (!body.sobrenome || !String(body.sobrenome).trim()) errors.push('Sobrenome é obrigatório.');
    if (!isValidCpf(cpf)) errors.push('CPF inválido.');
    if (!body.dataNascimento) errors.push('Data de nascimento é obrigatória.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('E-mail inválido.');
    if (!body.celular || !String(body.celular).trim()) errors.push('Celular é obrigatório.');
    if (cep.length !== 8) errors.push('CEP inválido.');
    if (!body.logradouro || !String(body.logradouro).trim()) errors.push('Logradouro é obrigatório.');
    if (!body.numero || !String(body.numero).trim()) errors.push('Número é obrigatório.');
    if (!body.bairro || !String(body.bairro).trim()) errors.push('Bairro é obrigatório.');
    if (!body.cidade || !String(body.cidade).trim()) errors.push('Cidade é obrigatória.');
    if (!body.estado || !String(body.estado).trim()) errors.push('Estado é obrigatório.');
    if (password.length < 8) errors.push('Senha deve ter no mínimo 8 caracteres.');
    if (password !== confirmPassword) errors.push('As senhas não coincidem.');
    if (!body.aceitaTermos) errors.push('É necessário aceitar os termos de uso.');

    if (errors.length > 0) {
      return jsonResponse({ success: false, message: 'Corrija os campos indicados.', errors: errors }, 400);
    }

    var db = readDb();
    if (db.passengers.some(function (p) { return p.cpf === cpf; })) {
      return jsonResponse({ success: false, message: 'CPF já cadastrado.' }, 409);
    }
    if (db.passengers.some(function (p) { return p.email === email; })) {
      return jsonResponse({ success: false, message: 'E-mail já cadastrado.' }, 409);
    }

    var id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'local-' + Date.now();

    var passenger = {
      id: id,
      createdAt: new Date().toISOString(),
      nome: String(body.nome).trim(),
      sobrenome: String(body.sobrenome).trim(),
      cpf: cpf,
      cpfFormatted: formatCpf(cpf),
      email: email,
      celular: String(body.celular).trim(),
      cep: formatCep(cep),
      logradouro: String(body.logradouro).trim(),
      numero: String(body.numero).trim(),
      bairro: String(body.bairro).trim(),
      cidade: String(body.cidade).trim(),
      estado: String(body.estado).trim(),
    };

    db.passengers.push(passenger);
    writeDb(db);

    return jsonResponse(
      {
        success: true,
        message: 'Cadastro realizado com sucesso.',
        passenger: {
          id: passenger.id,
          nome: passenger.nome + ' ' + passenger.sobrenome,
          email: passenger.email,
          cpf: passenger.cpfFormatted,
        },
      },
      201,
    );
  }

  function getMethod(input, init) {
    if (init && init.method) return String(init.method).toUpperCase();
    if (input && input.method) return String(input.method).toUpperCase();
    return 'GET';
  }

  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : input && input.url ? input.url : '';
    var method = getMethod(input, init);

    if (url.indexOf('/api/health') !== -1) {
      return Promise.resolve(jsonResponse({ status: 'ok', service: 'ExpressoTransSul local patch' }, 200));
    }

    var cepMatch = url.match(/\/api\/cep\/(\d{8})/);
    if (cepMatch) {
      return lookupCepOnline(cepMatch[1]).then(function (result) {
        return jsonResponse(result, result.valid ? 200 : 404);
      });
    }

    if (url.indexOf('/api/cpf/validate') !== -1 && method === 'POST') {
      return originalFetch(input, init).catch(function () {
        return validateCpfRequest(parseBody(init));
      });
    }

    if (url.indexOf('/api/passengers/register') !== -1 && method === 'POST') {
      return originalFetch(input, init).catch(function () {
        return registerPassengerRequest(parseBody(init));
      });
    }

    return originalFetch(input, init).catch(function () {
      throw new Error('Network error');
    });
  };
})();
