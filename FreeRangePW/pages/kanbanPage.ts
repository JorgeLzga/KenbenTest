import { Page, Locator, expect } from '@playwright/test';

export class KanbanPage {
    private page: Page;
    private logo: Locator;
    private tarjetas: Locator;
    private checkLabels: Locator;
    private dropdown: Locator;
    private opcionesDropdown: Locator;
    private modalBackground: Locator;
    private primeraColumnaTarjetas: Locator;
    private modalOff: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logo = page.getByRole('img', { name: 'logo' });
        this.tarjetas = page.locator('.flex.gap-6 > section:not(:first-child) .flex.flex-col > article');
        this.checkLabels = page.locator('label.cursor-pointer.bg-light-grey');
        this.dropdown = page.locator('.text-sm.text-black.dark\\:text-white.font-bold.rounded.px-4.py-3.relative.w-full.flex.items-center.border');
        this.opcionesDropdown = page.locator('.hidden.absolute.rounded.left-0.top-full.mt-4.w-full.bg-white.dark\\:bg-dark-grey.group-focus\\:block > div.p-4');
        this.modalBackground = page.locator('div.fixed.min-h-screen.min-w-full.bg-black.bg-opacity-50.top-0.left-0.z-10[data-no-dragscroll]');
        this.primeraColumnaTarjetas = page.locator('.flex.gap-6 > section:nth-child(1) .flex.flex-col > article');
        this.modalOff = page.locator('div.fixed.min-h-screen.min-w-full.bg-black.bg-opacity-50.top-0.left-0.z-10[data-no-dragscroll]');
    }

    async navegar() {
        await this.page.goto('https://kanban-566d8.firebaseapp.com/');
        await expect(this.logo, 'La página no cargó correctamente').toBeEnabled();
    }

    async seleccionarTarjeta() {
        const count = await this.tarjetas.count();
        if (count === 0) {
            console.log('No hay tarjetas disponibles para editar.');
            return null;
        }
        const primeraTarjeta = this.tarjetas.first();
        await primeraTarjeta.click();
        return primeraTarjeta.locator('h3').innerText();
    }

    async marcarSubtareas() {
        const count = await this.checkLabels.count();
        if (count === 0) return;
        for (let i = 0; i < count; i++) {
            const checkbox = this.checkLabels.nth(i).locator('input[type="checkbox"]');
            if (!(await checkbox.isChecked())) {
                await this.checkLabels.nth(i).click();
                await expect(this.checkLabels.nth(i).locator('span')).toHaveCSS('text-decoration', /line-through/);
            }
        }
    }

    async moverTarjeta() {
        await this.dropdown.click();
        await this.opcionesDropdown.first().waitFor({ state: 'visible' });
        if (await this.opcionesDropdown.count() > 0) {
            await this.opcionesDropdown.first().click();
        }
    }

    async cerrarModal() {
        await this.modalOff.click();
        //await this.modalBackground.click();
        await expect(this.modalBackground).not.toBeVisible();
    }

    async verificarMovimiento(tituloOriginal: string) {
        await expect(this.primeraColumnaTarjetas.first()).toBeVisible();
        const tituloNuevo = await this.primeraColumnaTarjetas.first().locator('h3').innerText();
        
        console.log(`Título original: "${tituloOriginal}"`);
        console.log(`Título nuevo: "${tituloNuevo}"`);    
        //await expect(tituloNuevo.trim().toLowerCase()).toEqual(tituloOriginal.trim().toLowerCase());
    }
    
}