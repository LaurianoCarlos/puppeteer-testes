import chalk from 'chalk';
import fs from 'fs/promises';

export async function login(page) {
  await page.goto('http://localhost:8023/login');

  await page.type('input[name="username"]', 'alex-teixeira'); 
  await page.type('input[name="password"]', 'abc@123'); 

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ timeout: 60000 }),
  ]);

  const url = page.url();
  if (url.includes('/')) {
    console.log(chalk.green('Teste de Login Passou!'));

    const cookies = await page.cookies();
    await fs.writeFile('./auth_cookies.json', JSON.stringify(cookies, null, 2));
  } else {
    console.log(chalk.red('Teste de Login falhou.'));
    throw new Error('Login falhou');
  }
}
