import { useState, useCallback } from 'react';
import { formatCep, formatCpf, formatPhone, isValidCpf, stripDigits } from '../lib/brDocuments';
import { lookupCepOnline, type CepLookupResult } from '../lib/cepLookup';
import { validateCpfRemote, type CpfValidationResult } from '../services/registrationApi';

export type FieldStatus = 'idle' | 'loading' | 'success' | 'error';

export function useRegistrationValidation() {
  const [cpfStatus, setCpfStatus] = useState<FieldStatus>('idle');
  const [cpfMessage, setCpfMessage] = useState('');
  const [cepStatus, setCepStatus] = useState<FieldStatus>('idle');
  const [cepMessage, setCepMessage] = useState('');
  const [cepSource, setCepSource] = useState<string | null>(null);

  const validateCpfField = useCallback(async (cpf: string): Promise<CpfValidationResult | null> => {
    const formatted = formatCpf(cpf);
    if (stripDigits(cpf).length < 11) {
      setCpfStatus('error');
      setCpfMessage('Informe os 11 dígitos do CPF.');
      return null;
    }

    if (!isValidCpf(cpf)) {
      setCpfStatus('error');
      setCpfMessage('CPF inválido. Verifique os números informados.');
      return { valid: false, exists: false, message: 'CPF inválido.', formatted };
    }

    setCpfStatus('loading');
    setCpfMessage('Validando CPF na base...');

    try {
      const result = await validateCpfRemote(cpf);
      if (!result.valid || result.exists) {
        setCpfStatus('error');
        setCpfMessage(result.message);
        return result;
      }
      setCpfStatus('success');
      setCpfMessage(result.message);
      return result;
    } catch {
      setCpfStatus('success');
      setCpfMessage('CPF válido (validação local).');
      return { valid: true, exists: false, message: 'CPF válido (validação local).', formatted };
    }
  }, []);

  const lookupCepField = useCallback(async (cep: string): Promise<CepLookupResult | null> => {
    if (stripDigits(cep).length < 8) {
      setCepStatus('error');
      setCepMessage('Informe os 8 dígitos do CEP.');
      setCepSource(null);
      return null;
    }

    setCepStatus('loading');
    setCepMessage('Consultando CEP...');
    setCepSource(null);

    const result = await lookupCepOnline(cep);
    if (!result.valid) {
      setCepStatus('error');
      setCepMessage(result.message);
      setCepSource(null);
      return result;
    }
    setCepStatus('success');
    setCepMessage(`${result.message}${result.source ? ` (${result.source})` : ''}`);
    setCepSource(result.source);
    return result;
  }, []);

  const resetCepValidation = useCallback(() => {
    setCepStatus('idle');
    setCepMessage('');
    setCepSource(null);
  }, []);

  const resetCpfValidation = useCallback(() => {
    setCpfStatus('idle');
    setCpfMessage('');
  }, []);

  return {
    cpfStatus,
    cpfMessage,
    cepStatus,
    cepMessage,
    cepSource,
    validateCpfField,
    lookupCepField,
    resetCepValidation,
    resetCpfValidation,
    formatCpf,
    formatCep,
    formatPhone,
  };
}
