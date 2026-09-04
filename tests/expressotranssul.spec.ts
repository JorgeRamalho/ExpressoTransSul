import { test, expect } from '@playwright/test';

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
  const digits = base + d1 + String(remainder);
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

test.describe('ExpressoTransSul - SEO', () => {
  test('deve ter meta tags essenciais para SEO', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/ExpressoTransSul/);
    
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /passagens de ônibus/i);

    const lang = page.locator('html');
    await expect(lang).toHaveAttribute('lang', 'pt-BR');

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('deve ter heading hierarchy correta na home', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Sul do Brasil/i);
  });

  test('páginas internas devem ter títulos descritivos', async ({ page }) => {
    const pages = [
      { path: '/#/horarios', title: /Horários|Passagens/i },
      { path: '/#/companhias', title: /Companhias|ExpressoTransSul/i },
      { path: '/#/terminais', title: /Terminais|ExpressoTransSul/i },
      { path: '/#/cadastro', title: /ExpressoTransSul/i },
    ];

    for (const { path, title } of pages) {
      await page.goto(path);
      await expect(page).toHaveTitle(title);
    }
  });
});

test.describe('ExpressoTransSul - Usabilidade e Navegação', () => {
  test('header deve ter links de navegação funcionais', async ({ page }, testInfo) => {
    await page.goto('/');

    const needsMenu = testInfo.project.name !== 'chromium-desktop';

    if (needsMenu) {
      await page.getByRole('button', { name: /Abrir menu/i }).click();
    }

    await page.locator('header nav').getByRole('link', { name: 'Horários', exact: true }).click();
    await expect(page).toHaveURL(/horarios/);

    if (needsMenu) {
      await page.getByRole('button', { name: /Abrir menu/i }).click();
    }

    await page.locator('header nav').getByRole('link', { name: 'Companhias', exact: true }).click();
    await expect(page).toHaveURL(/companhias/);

    if (needsMenu) {
      await page.getByRole('button', { name: /Abrir menu/i }).click();
    }

    await page.locator('header nav').getByRole('link', { name: 'Terminais', exact: true }).click();
    await expect(page).toHaveURL(/terminais/);
  });

  test('banner de primeira viagem deve levar ao cadastro com cupom', async ({ page }) => {
    await page.goto('/');

    const banner = page.getByRole('region', { name: /Motivos pra viajar em Setembro/i });
    await banner.scrollIntoViewIfNeeded();
    await expect(banner.getByRole('heading', { name: /Motivos pra viajar em Setembro/i })).toBeVisible();
    await expect(banner.getByText('PRIMEIRA20').first()).toBeVisible();

    await banner.getByRole('link', { name: /Cadastrar e resgatar cupom/i }).click();
    await expect(page).toHaveURL(/cadastro/);
    await expect(page.getByLabel('Promoção de primeira viagem')).toContainText('PRIMEIRA20');
  });

  test('motor de busca deve permitir pesquisa de passagens', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('De onde você sai?').fill('Porto Alegre - RS');
    await page.getByPlaceholder('Para onde você vai?').fill('Florianópolis - SC');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.locator('#departure').fill(dateStr);

    await page.getByRole('button', { name: /Buscar Passagens/i }).click();
    await expect(page).toHaveURL(/resultados/);
  });

  test('cadastro multi-step deve funcionar', async ({ page }) => {
    const unique = Date.now();
    await page.goto('/#/cadastro');

    await page.locator('#nome').fill('Maria');
    await page.locator('#sobrenome').fill('Santos');
    await page.locator('#cpf').fill(generateValidCpf());
    await page.locator('#dataNascimento').fill('1990-05-15');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await page.locator('#email').fill(`maria.${unique}@test.com`);
    await page.locator('#celular').fill('(51) 99999-9999');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await page.locator('#cep').fill('82410-450');
    await page.getByRole('button', { name: 'Buscar CEP' }).click();
    await expect(page.getByText(/ViaCEP|BrasilAPI|CEP encontrado/i)).toBeVisible({ timeout: 15000 });
    await page.locator('#numero').fill('123');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await page.locator('#senha').fill('senha12345');
    await page.locator('#confirmarSenha').fill('senha12345');
    await page.locator('input[type="checkbox"]').first().check();
    await page.getByRole('button', { name: /Finalizar Cadastro/i }).click();

    await expect(page.getByText(/Cadastro realizado com sucesso/i)).toBeVisible({ timeout: 15000 });
  });

  test('área do cliente exibe login com botão Entrar', async ({ page }) => {
    await page.goto('/#/area-cliente');
    await expect(page.getByRole('heading', { name: /Área do Cliente/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /^Entrar$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Entrar \(Demo\)/i })).toHaveCount(0);
    await expect(page.locator('#login-email')).toBeVisible();
    await expect(page.locator('#login-senha')).toBeVisible();
  });

  test('área do cliente rejeita login inválido', async ({ page }) => {
    await page.goto('/#/area-cliente');
    await page.locator('#login-email').fill('naoexiste@test.com');
    await page.locator('#login-senha').fill('senhaerrada');
    await page.getByRole('button', { name: /^Entrar$/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/Olá/i)).toHaveCount(0);
  });
});

test.describe('ExpressoTransSul - Responsividade', () => {
  test('home deve ser responsiva em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByPlaceholder('De onde você sai?')).toBeVisible();
  });

  test('menu mobile deve abrir e fechar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const menuBtn = page.getByRole('button', { name: /Abrir menu/i });
    await menuBtn.click();
    await expect(page.locator('header nav').getByRole('link', { name: 'Horários', exact: true })).toBeVisible();

    await page.getByRole('button', { name: /Fechar menu/i }).click();
  });

  test('dashboard deve adaptar em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.addInitScript(() => {
      localStorage.setItem('ets_user', JSON.stringify({
        nome: 'Maria Silva',
        email: 'maria@test.com',
        cpf: '529.982.247-25',
      }));
    });
    await page.goto('/#/area-cliente');
    await expect(page.getByText(/Pontos Fidelidade/i)).toBeVisible();
  });
});

test.describe('ExpressoTransSul - Identidade Visual e Layout', () => {
  test('deve exibir logo e barra de status', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('header').getByLabel('ExpressoTransSul - Página inicial')).toBeVisible();
    await expect(page.getByText('AO VIVO', { exact: true })).toBeVisible();
  });

  test('seção de companhias deve listar empresas do Sul', async ({ page }) => {
    await page.goto('/#/companhias');

    await expect(page.getByText('Viação Catarinense')).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Grupo Reunidas' }).first()).toBeVisible();
    await expect(page.getByText('Viação Penha')).toBeVisible();
    await expect(page.getByText('Planalto Transportes')).toBeVisible();
  });

  test('terminais devem mostrar status ao vivo', async ({ page }) => {
    await page.goto('/#/terminais');
    await expect(page.getByText(/Status ao Vivo/i)).toBeVisible();
    await expect(page.getByText(/Estação Rodoviária de Porto Alegre/i)).toBeVisible();
  });
});

test.describe('ExpressoTransSul - Funcionalidade', () => {
  test('tabs do motor de busca devem alternar', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('tab', { name: /Horários/i }).click();
    await expect(page.getByRole('button', { name: /Consultar Horários/i })).toBeVisible();

    await page.getByRole('tab', { name: /Embarques/i }).click();
    await expect(page.getByRole('button', { name: /Consultar Embarques/i })).toBeVisible();
  });

  test('ida e volta deve mostrar campo de retorno', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Ida e Volta/i }).click();
    await expect(page.locator('#return')).toBeVisible();
  });

  test('resultados devem exibir opções de viagem', async ({ page }) => {
    await page.goto('/#/resultados?origem=Porto+Alegre+-+RS&destino=Florianópolis+-+SC&data=2026-09-15');
    await expect(page.getByText(/opções encontradas/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Selecionar/i }).first()).toBeVisible();
  });
});

test.describe('ExpressoTransSul - App, linhas diretas e jornada', () => {
  test('home deve exibir hub do app e linhas diretas', async ({ page }) => {
    await page.goto('/');

    const hub = page.getByRole('region', { name: /Tudo o que você precisa para embarcar/i });
    await hub.scrollIntoViewIfNeeded();
    await expect(hub.getByRole('heading', { name: /Tudo o que você precisa para embarcar/i })).toBeVisible();
    await hub.getByRole('tab', { name: 'Reservas' }).click();
    await expect(hub.getByRole('heading', { name: /Reserve o assento/i })).toBeVisible();

    const express = page.getByRole('region', { name: /Linhas entre rotas com uma pausa de 20 minutos/i });
    await express.scrollIntoViewIfNeeded();
    await expect(express.getByText(/sem embarque ou desembarque/i).first()).toBeVisible();
    await expect(express.getByText('Linha Direta').first()).toBeVisible();
  });

  test('seção de app deve oferecer download', async ({ page }) => {
    await page.goto('/#/app');
    await expect(page.getByRole('heading', { name: /Baixe o app e viaje com mais leveza/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Baixar no Android/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Baixar no iPhone/i })).toBeVisible();
  });

  test('header deve atalhar para baixar o app', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Baixar o aplicativo ExpressoTransSul/i }).click();
    await expect(page).toHaveURL(/app/);
    await expect(page.getByRole('heading', { name: /Leve o ExpressoTransSul no bolso/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /Tudo o que você precisa para embarcar/i })).toBeVisible();
  });

  test('promoções, reservas e embarques devem abrir', async ({ page }) => {
    await page.goto('/#/promocoes');
    await expect(page.getByRole('heading', { name: /Promoções para embarcar agora/i })).toBeVisible();

    await page.goto('/#/reservas');
    await expect(page.getByRole('heading', { name: /Escolha o assento/i })).toBeVisible();
    await page.getByRole('button', { name: 'Assento 03A' }).click();
    await page.getByRole('button', { name: /Reservar assento 03A/i }).click();
    await expect(page.getByText(/Assento 03A reservado/i)).toBeVisible();

    await page.goto('/#/embarques');
    await expect(page.getByRole('heading', { name: /Painel de plataformas/i })).toBeVisible();
    await expect(page.getByText(/Agora nos terminais/i)).toBeVisible();
  });

  test('sugestões devem filtrar por clima da viagem', async ({ page }) => {
    await page.goto('/#/sugestoes');
    await page.getByRole('tab', { name: /Serra/i }).click();
    await expect(page.getByRole('heading', { name: /Serra Gaúcha/i })).toBeVisible();
  });
});
