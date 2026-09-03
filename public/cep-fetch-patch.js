/**
 * Garante busca de CEP via ViaCEP mesmo quando a API local não está rodando.
 * Carregado antes do bundle React para interceptar fetch('/api/cep/...').
 */
(function () {
  function stripDigits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function formatCep(digits) {
    if (digits.length <= 5) return digits;
    return digits.slice(0, 5) + '-' + digits.slice(5);
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

  function jsonResponse(body, status) {
    return new Response(JSON.stringify(body), {
      status: status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  var originalFetch = window.fetch.bind(window);

  async function lookupCepOnline(digits) {
    if (digits.length !== 8) {
      return {
        valid: false,
        message: 'CEP deve conter 8 dígitos.',
        source: null,
      };
    }

    try {
      var viaCepData = await fetchViaCepJsonp(digits);
      if (!viaCepData.erro) {
        return mapViaCep(viaCepData, digits);
      }
    } catch (_err) {
      try {
        var httpRes = await originalFetch('https://viacep.com.br/ws/' + digits + '/json/');
        if (httpRes.ok) {
          var httpData = await httpRes.json();
          if (!httpData.erro) {
            return mapViaCep(httpData, digits);
          }
        }
      } catch (_err2) {
        /* tenta BrasilAPI */
      }
    }

    try {
      var brRes = await originalFetch('https://brasilapi.com.br/api/cep/v2/' + digits);
      if (brRes.ok) {
        var brData = await brRes.json();
        return mapBrasilApi(brData, digits);
      }
    } catch (_err3) {
      /* segue */
    }

    return {
      valid: false,
      message: 'CEP não encontrado. Verifique o número informado.',
      source: null,
    };
  }

  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : input && input.url ? input.url : '';

    if (url.indexOf('/api/health') !== -1) {
      return Promise.resolve(jsonResponse({ status: 'ok', service: 'ExpressoTransSul CEP patch' }, 200));
    }

    var cepMatch = url.match(/\/api\/cep\/(\d{8})/);
    if (cepMatch) {
      return lookupCepOnline(cepMatch[1]).then(function (result) {
        return jsonResponse(result, result.valid ? 200 : 404);
      });
    }

    return originalFetch(input, init);
  };
})();
