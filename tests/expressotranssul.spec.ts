import { test, expect } from '@playwright/test';

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
      { path: '/horarios', title: /Horários|Passagens/i },
      { path: '/companhias', title: /Companhias|ExpressoTransSul/i },
      { path: '/terminais', title: /Terminais|ExpressoTransSul/i },
      { path: '/cadastro', title: /ExpressoTransSul/i },
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
    await page.goto('/cadastro');

    await page.locator('#nome').fill('Maria');
    await page.locator('#sobrenome').fill('Santos');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await page.locator('#email').fill('maria@test.com');
    await page.locator('#celular').fill('(51) 99999-9999');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await page.locator('#cep').fill('90000-000');
    await page.locator('#logradouro').fill('Rua Teste');
    await page.locator('#numero').fill('123');
    await page.locator('#bairro').fill('Centro');
    await page.locator('#cidade').fill('Porto Alegre');
    await page.locator('#estado').selectOption('RS');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await page.locator('#senha').fill('senha12345');
    await page.locator('#confirmarSenha').fill('senha12345');
    await page.locator('input[type="checkbox"]').first().check();
    await page.getByRole('button', { name: /Finalizar Cadastro/i }).click();

    await expect(page.getByText(/Cadastro realizado com sucesso/i)).toBeVisible({ timeout: 5000 });
  });

  test('área do cliente demo login funciona', async ({ page }) => {
    await page.goto('/area-cliente');
    await page.getByRole('button', { name: /Entrar \(Demo\)/i }).click();
    await expect(page.getByText(/Olá/i)).toBeVisible();
    await expect(page.getByText(/Viagens Ativas/i)).toBeVisible();
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
    await expect(page.locator('header nav').getByRole('link', { name: 'Destinos', exact: true })).toBeVisible();

    await page.getByRole('button', { name: /Fechar menu/i }).click();
  });

  test('dashboard deve adaptar em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/area-cliente');
    await page.getByRole('button', { name: /Entrar \(Demo\)/i }).click();
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
    await page.goto('/companhias');

    await expect(page.getByText('Viação Catarinense')).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Grupo Reunidas' }).first()).toBeVisible();
    await expect(page.getByText('Viação Penha')).toBeVisible();
    await expect(page.getByText('Planalto Transportes')).toBeVisible();
  });

  test('terminais devem mostrar status ao vivo', async ({ page }) => {
    await page.goto('/terminais');
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
    await page.goto('/resultados?origem=Porto+Alegre+-+RS&destino=Florianópolis+-+SC&data=2026-09-15');
    await expect(page.getByText(/opções encontradas/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Selecionar/i }).first()).toBeVisible();
  });
});
