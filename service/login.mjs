import chalk from 'chalk';
import fs from 'fs/promises';
import { BASE_URL, USER, PASSWORD } from '../config/constant.mjs';

const baseUrl = `${BASE_URL}`;
const cookiesPath = './auth_cookies.json';

export async function login(page) {
  console.log(chalk.yellow('Realizando login com:', USER));

  try {
    const cookiesData = await fs.readFile(cookiesPath, 'utf-8');
    const cookies = JSON.parse(cookiesData);
    await page.setCookie(...cookies);
    await page.goto(baseUrl);

    if (page.url() === baseUrl) {
      console.log(chalk.green('Já está logado!'));
      return;
    }
  } catch (error) {
    console.log(chalk.yellow('Realizando login...'));
  }

  await page.goto(`${baseUrl}login`);
  console.log(chalk.yellow('Navegando para a página de login...'));

  await page.waitForSelector('#username', { timeout: 30000 });
  await page.type('#username', USER);

  await page.waitForSelector('#password', { timeout: 30000 });
  await page.type('#password', PASSWORD);

  try {
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ timeout: 30000 }),
    ]);
    console.log(chalk.yellow('Tentando fazer login...'));
  } catch (navError) {
    console.log(chalk.red('Erro ao navegar após clicar em login:', navError));
    throw new Error('Navegação falhou após o login.');
  }
  const url = page.url();
  if (url !== baseUrl) {
    console.log(chalk.red('Teste de Login falhou. URL inesperada:', url));
    throw new Error('Login falhou, URL inesperada.');
  }

  console.log(chalk.green('Login bem-sucedido!'));
  const cookies = await page.cookies();
  await fs.writeFile(cookiesPath, JSON.stringify(cookies, null, 2));
}


