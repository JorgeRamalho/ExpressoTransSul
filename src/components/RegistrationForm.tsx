import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Mail, CreditCard, Shield, CheckCircle } from 'lucide-react';
import './RegistrationForm.css';

interface FormData {
  nome: string;
  sobrenome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: string;
  celular: string;
  cep: string;
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
  tipoDocumento: string;
  nacionalidade: string;
  profissao: string;
  contatoEmergencia: string;
  telefoneEmergencia: string;
}

const initialFormData: FormData = {
  nome: '',
  sobrenome: '',
  cpf: '',
  rg: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  telefone: '',
  celular: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  senha: '',
  confirmarSenha: '',
  aceitaTermos: false,
  aceitaMarketing: false,
  tipoDocumento: 'CPF',
  nacionalidade: 'Brasileira',
  profissao: '',
  contatoEmergencia: '',
  telefoneEmergencia: '',
};

const estados = ['RS', 'SC', 'PR', 'SP', 'RJ', 'MG', 'Outro'];

export function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }
    if (!formData.aceitaTermos) {
      alert('Você precisa aceitar os termos de uso.');
      return;
    }
    localStorage.setItem('ets_user', JSON.stringify({
      nome: `${formData.nome} ${formData.sobrenome}`,
      email: formData.email,
      cpf: formData.cpf,
    }));
    setSubmitted(true);
    setTimeout(() => navigate('/area-cliente'), 2000);
  };

  if (submitted) {
    return (
      <div className="registration-success">
        <CheckCircle size={64} />
        <h2>Cadastro realizado com sucesso!</h2>
        <p>Redirecionando para sua área do cliente...</p>
      </div>
    );
  }

  return (
    <form id="formulario" className="registration-form" onSubmit={handleSubmit}>
      <div className="registration-form__steps">
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            type="button"
            className={`registration-form__step ${step === s ? 'registration-form__step--active' : ''} ${step > s ? 'registration-form__step--done' : ''}`}
            onClick={() => setStep(s)}
          >
            <span>{s}</span>
            {s === 1 && 'Dados Pessoais'}
            {s === 2 && 'Contato'}
            {s === 3 && 'Endereço'}
            {s === 4 && 'Acesso'}
          </button>
        ))}
      </div>

      {step === 1 && (
        <section className="registration-form__section">
          <h3><User size={20} /> Dados Pessoais</h3>
          <div className="registration-form__grid">
            <div className="form-group">
              <label htmlFor="nome" className="form-label">Nome *</label>
              <input id="nome" className="form-input" required value={formData.nome} onChange={(e) => updateField('nome', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="sobrenome" className="form-label">Sobrenome *</label>
              <input id="sobrenome" className="form-input" required value={formData.sobrenome} onChange={(e) => updateField('sobrenome', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="cpf" className="form-label">CPF *</label>
              <input id="cpf" className="form-input" required placeholder="000.000.000-00" value={formData.cpf} onChange={(e) => updateField('cpf', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="rg" className="form-label">RG</label>
              <input id="rg" className="form-input" value={formData.rg} onChange={(e) => updateField('rg', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="dataNascimento" className="form-label">Data de Nascimento *</label>
              <input id="dataNascimento" type="date" className="form-input" required value={formData.dataNascimento} onChange={(e) => updateField('dataNascimento', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="sexo" className="form-label">Sexo</label>
              <select id="sexo" className="form-select" value={formData.sexo} onChange={(e) => updateField('sexo', e.target.value)}>
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
                <option value="N">Prefiro não informar</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="nacionalidade" className="form-label">Nacionalidade</label>
              <input id="nacionalidade" className="form-input" value={formData.nacionalidade} onChange={(e) => updateField('nacionalidade', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="profissao" className="form-label">Profissão</label>
              <input id="profissao" className="form-input" value={formData.profissao} onChange={(e) => updateField('profissao', e.target.value)} />
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="registration-form__section">
          <h3><Phone size={20} /> Dados de Contato</h3>
          <div className="registration-form__grid">
            <div className="form-group registration-form__full">
              <label htmlFor="email" className="form-label"><Mail size={14} /> E-mail *</label>
              <input id="email" type="email" className="form-input" required value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="telefone" className="form-label">Telefone Fixo</label>
              <input id="telefone" className="form-input" placeholder="(00) 0000-0000" value={formData.telefone} onChange={(e) => updateField('telefone', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="celular" className="form-label">Celular *</label>
              <input id="celular" className="form-input" required placeholder="(00) 00000-0000" value={formData.celular} onChange={(e) => updateField('celular', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="contatoEmergencia" className="form-label">Contato de Emergência</label>
              <input id="contatoEmergencia" className="form-input" value={formData.contatoEmergencia} onChange={(e) => updateField('contatoEmergencia', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="telefoneEmergencia" className="form-label">Telefone de Emergência</label>
              <input id="telefoneEmergencia" className="form-input" value={formData.telefoneEmergencia} onChange={(e) => updateField('telefoneEmergencia', e.target.value)} />
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="registration-form__section">
          <h3><MapPin size={20} /> Endereço</h3>
          <div className="registration-form__grid">
            <div className="form-group">
              <label htmlFor="cep" className="form-label">CEP *</label>
              <input id="cep" className="form-input" required placeholder="00000-000" value={formData.cep} onChange={(e) => updateField('cep', e.target.value)} />
            </div>
            <div className="form-group registration-form__span-2">
              <label htmlFor="logradouro" className="form-label">Logradouro *</label>
              <input id="logradouro" className="form-input" required value={formData.logradouro} onChange={(e) => updateField('logradouro', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="numero" className="form-label">Número *</label>
              <input id="numero" className="form-input" required value={formData.numero} onChange={(e) => updateField('numero', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="complemento" className="form-label">Complemento</label>
              <input id="complemento" className="form-input" value={formData.complemento} onChange={(e) => updateField('complemento', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="bairro" className="form-label">Bairro *</label>
              <input id="bairro" className="form-input" required value={formData.bairro} onChange={(e) => updateField('bairro', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="cidade" className="form-label">Cidade *</label>
              <input id="cidade" className="form-input" required value={formData.cidade} onChange={(e) => updateField('cidade', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="estado" className="form-label">Estado *</label>
              <select id="estado" className="form-select" required value={formData.estado} onChange={(e) => updateField('estado', e.target.value)}>
                <option value="">Selecione</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="registration-form__section">
          <h3><Shield size={20} /> Dados de Acesso</h3>
          <div className="registration-form__grid">
            <div className="form-group">
              <label htmlFor="senha" className="form-label">Senha *</label>
              <input id="senha" type="password" className="form-input" required minLength={8} value={formData.senha} onChange={(e) => updateField('senha', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmarSenha" className="form-label">Confirmar Senha *</label>
              <input id="confirmarSenha" type="password" className="form-input" required value={formData.confirmarSenha} onChange={(e) => updateField('confirmarSenha', e.target.value)} />
            </div>
          </div>

          <div className="registration-form__checkboxes">
            <label className="registration-form__checkbox">
              <input type="checkbox" checked={formData.aceitaTermos} onChange={(e) => updateField('aceitaTermos', e.target.checked)} required />
              <span>Li e aceito os <a href="#">Termos de Uso</a> e a <a href="#">Política de Privacidade</a> *</span>
            </label>
            <label className="registration-form__checkbox">
              <input type="checkbox" checked={formData.aceitaMarketing} onChange={(e) => updateField('aceitaMarketing', e.target.checked)} />
              <span>Desejo receber ofertas e promoções por e-mail</span>
            </label>
          </div>
        </section>
      )}

      <div className="registration-form__actions">
        {step > 1 && (
          <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
            Voltar
          </button>
        )}
        {step < 4 ? (
          <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
            Continuar
          </button>
        ) : (
          <button type="submit" className="btn btn-secondary btn-lg">
            <CreditCard size={18} />
            Finalizar Cadastro
          </button>
        )}
      </div>
    </form>
  );
}
