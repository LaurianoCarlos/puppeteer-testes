import fs from 'fs/promises';
import { BASE_URL, USER_PORTAL, PASSWORD } from '../config/constant.mjs';

const baseUrl = `${BASE_URL}`;
const cookiesPath = './auth_cookies.json';

export async function login(page) {

  try {
    await fs.access(cookiesPath);
  } catch (error) {
    await fs.writeFile(cookiesPath, JSON.stringify([], null, 2));
  }

  try {
    const cookiesData = await fs.readFile(cookiesPath, 'utf-8');
    const cookies = JSON.parse(cookiesData);
    await page.setCookie(...cookies);
    await page.goto(baseUrl);

    if (page.url() === baseUrl) {
      return;
    }
  } catch (error) {
    throw new Error(`Error ${error}.`);
  }

  await page.goto(`${baseUrl}login`);
  await page.waitForSelector('#username', { timeout: 30000 });
  await page.type('#username', USER_PORTAL);

  await page.waitForSelector('#password', { timeout: 30000 });
  await page.type('#password', PASSWORD);

  try {
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ timeout: 30000 }),
    ]);
  } catch (navError) {
    throw new Error('Navegação falhou após o login.', navError);
  }
  const url = page.url();
  if (url !== baseUrl) {
    throw new Error('Login falhou, URL inesperada.');
  }

  const cookies = await page.cookies();
  await fs.writeFile(cookiesPath, JSON.stringify(cookies, null, 2));
}


