import puppeteer from 'puppeteer';
import { login } from './login.mjs';
import { TIME } from '../config/constant.mjs';
let browser;
let page;

export async function setup() {
  if (!browser) {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    page.setDefaultTimeout(TIME.ONE_MINUTE);
    await page.setViewport();
    await login(page); 
  }
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

export async function getAppPage(){
  page && await login(page);
  !page && await setup();

  return page;
}
