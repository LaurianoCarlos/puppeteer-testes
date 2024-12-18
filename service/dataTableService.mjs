export class DataTableService {
    /**
     * Verifica se o botão "Anterior" está desabilitado.
     * @param {object} page - Instância da página do Puppeteer.
     * @returns {boolean}
     */
    static async isPreviousDisabled(page) {
        return await page.$eval(
            'ul.pagination li.page-item.previous',
            (el) => el.classList.contains('disabled')
        );
    }

    /**
     * Verifica se o botão "Próximo" está desabilitado.
     * @param {object} page - Instância da página do Puppeteer.
     * @returns {boolean}
     */
    static async isNextDisabled(page) {
        return await page.$eval(
            'ul.pagination li.page-item.next',
            (el) => el.classList.contains('disabled')
        );
    }

    /**
     * Navega para a próxima página se o botão "Próximo" estiver habilitado.
     * @param {object} page - Instância da página do Puppeteer.
     * @returns {boolean} - True se a navegação foi bem-sucedida, false se não.
     */
    static async goToNextPage(page, route) {
        await page.goto(route);

        const nextButtonSelector = 'ul.pagination li.page-item.next a';
        await page.evaluate(() => {
            document
                .querySelector('.dataTables_paginate.paging_simple_numbers')
                .scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        const isDisabled = await this.isNextDisabled(page);
        if (!isDisabled) {
            await Promise.all([
                page.click(nextButtonSelector),
            ]);
            return true;
        }
        return false;
    }

    /**
     * Navega para uma página específica clicando no número correspondente.
     * @param {object} page - Instância da página do Puppeteer.
     * @param {number} pageNumber - Número da página a ser acessada.
     * @param {number} route - Rota a ser acessada.
     */
    static async goToPage(page, pageNumber, route) {
        const pageSelector = `#currentPage-${pageNumber}`;

        await page.goto(route);

        await page.waitForFunction(
            (selector) => document.querySelector(selector)?.style.display === 'none',
            {},
            '#loading'
        );

        await page.evaluate(() => {
            document
                .querySelector('.dataTables_paginate.paging_simple_numbers')
                .scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        await page.waitForSelector(pageSelector, { visible: true });
        await page.evaluate((selector) => {
            document.querySelector(selector).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, pageSelector);

        await page.click(pageSelector);

        await page.waitForFunction(
            (selector) => {
                const element = document.querySelector(selector);
                return element && element.classList.contains('active');
            },
            {},
            pageSelector
        );

        return true;
    }


    /**
     * Altera o valor do 'perPage' e valida o texto exibido.
     * @param {object} page - Instância do Puppeteer.
     * @param {string} newValue - Valor a ser selecionado no dropdown.
     * @param {string} route - URL para acessar a página.
     * @returns {object} - Contém o valor selecionado e o texto exibido.
     */
    static async perPage(page, newValue, route) {
        const selectSelector = 'select.form-select[wire\\:change="setPerPage($event.target.value)"]';
        const infoSelector = '.dataTables_info';
        const updateLoading ='#loading-update';

        await page.goto(route);
        await page.waitForSelector(selectSelector, { visible: true });
        await page.locator(selectSelector).hover();
        await page.select(selectSelector, newValue);
        await page.waitForFunction(
            (selector) => {
                const element = document.querySelector(selector);
                return element && element.classList.contains('c-hidden');
            },
            {},
            updateLoading
        );

        const selectedValue = await page.$eval(selectSelector, (select) => select.value);

        await page.evaluate((selector) => {
            document.querySelector(selector).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, infoSelector);

        const infoText = await page.$eval(infoSelector, (info) => info.textContent.trim());

        return { quantity: selectedValue, message: infoText };
    }
}

