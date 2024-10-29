import chalk from 'chalk';

export async function login(page) {
  // Acesse a página de login
  await page.goto('http://localhost:8023/login');

  // Preencha o formulário de login
  await page.type('input[name="username"]', 'alex-teixeira'); 
  await page.type('input[name="password"]', 'abc@123'); 

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ timeout: 60000 }),
  ]);

  const url = page.url();
  if (url.includes('/')) { 
    console.log(chalk.green('Teste de Login Passou!')); 
  } else {
    console.log(chalk.red('Teste de Login falhou.')); 
    throw new Error('Login falhou');
  }
}
