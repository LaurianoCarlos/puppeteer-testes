import chalk from 'chalk';
import fs from 'fs/promises';
import { BASE_URL, USER, PASSWORD } from './constant.mjs';

const baseUrl = `${BASE_URL}`;
const cookiesPath = './auth_cookies.json';

export async function login(page) {
  console.log(chalk.yellow('Realizando login com:', USER));

  try {
    const cookiesData = await fs.readFile(cookiesPath, 'utf-8');
    const cookies = JSON.parse(cookiesData);
    await page.setCookie(...cookies);
    await page.goto(baseUrl);

    console.log(page.url(), baseUrl)
    if (page.url() === baseUrl) {
      console.log(chalk.green('Já está logado!'));
      return; // Retorna se já estiver logado
    }
  } catch (error) {
    console.log(chalk.yellow('Arquivo de cookies não encontrado, realizando login...'));
  }

  // Navega para a página de login
  await page.goto(`${baseUrl}/login`);
  console.log(chalk.yellow('Navegando para a página de login...'));

  // Aguarda o campo de entrada de username estar disponível
  await page.waitForSelector('#username', { timeout: 60000 });
  await page.type('#username', USER);
  console.log(chalk.yellow('Usuário digitado...'));

  // Aguarda o campo de entrada de password estar disponível
  await page.waitForSelector('#password', { timeout: 60000 });
  await page.type('#password', PASSWORD);
  console.log(chalk.yellow('Senha digitada...'));

  // Tenta clicar no botão de login e aguardar a navegação
  try {
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ timeout: 60000 }),
    ]);
    console.log(chalk.yellow('Tentando fazer login...'));
  } catch (navError) {
    console.log(chalk.red('Erro ao navegar após clicar em login:', navError));
    throw new Error('Navegação falhou após o login.');
  }

  // Verifique se a navegação foi bem-sucedida
  const url = page.url();
  if (url !== baseUrl) { // Verifique se a URL está correta após o login
    console.log(chalk.red('Teste de Login falhou. URL inesperada:', url));
    throw new Error('Login falhou, URL inesperada.');
  }

  console.log(chalk.green('Login bem-sucedido!'));
  const cookies = await page.cookies();
  await fs.writeFile(cookiesPath, JSON.stringify(cookies, null, 2));
}
