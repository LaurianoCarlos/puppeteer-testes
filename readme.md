# Testes Automatizados com Puppeteer e Mocha

Este repositório contém uma suite de testes automatizados para um sistema, utilizando **Puppeteer** para automação do navegador e **Mocha** como framework de testes.

## Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em seu sistema:

- [Node.js](https://nodejs.org/) (recomendado: versão 14 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)



## Módulo de Setup

O módulo de setup é responsável por gerenciar a inicialização do navegador e realizar o login na aplicação antes da execução dos testes. Abaixo estão os principais componentes e suas funcionalidades:

### 1. `setup()`

Esta função inicializa o navegador e realiza o login, retornando a instância da página.

**Funcionamento:**
- Verifica se o navegador já foi iniciado; se não, inicia um novo navegador em modo não headless (visível) e abre uma nova aba.
- Define a dimensão da janela do navegador.
- Chama a função `login(page)` para autenticar o usuário.
- Retorna a instância da página para uso nos testes.

**Código:**
```javascript
export async function setup() {
  if (!browser) {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.setViewport();
    await login(page); 
  }
  return page;
}
