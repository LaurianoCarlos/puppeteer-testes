import puppeteer from 'puppeteer';
import { login } from './login.mjs';

let browser;
let page;

export async function setup() {
  if (!browser) {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.setViewport();
    await login(page); 
  }
  return page;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null; // Permite que o navegador seja reiniciado na próxima execução
  }
}
