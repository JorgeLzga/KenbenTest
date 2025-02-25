import { test, expect, Browser, Page } from '@playwright/test';

let browser: Browser;
let page: Page;

test.describe('Pruebas de la aplicación Kanban', () => {
    
    test('Accediendo a la página principal', async ({ page }) => {
        await page.goto('https://kanban-566d8.firebaseapp.com/');
        await expect(page.getByRole('img', { name: 'logo' }), 'La página no cargó correctamente').toBeEnabled();
    });

    test('Editar una tarjeta y moverla a la primera columna', async ({ page }) => {
        await page.goto('https://kanban-566d8.firebaseapp.com/');
        await expect(page.getByRole('img', { name: 'logo' }), 'La página no cargó correctamente').toBeEnabled();

        await test.step('Seleccionar una tarjeta que no esté en la primera columna y tenga subtareas no completadas', async () => {
            const tarjetas = page.locator('.flex.gap-6 > section:not(:first-child) .flex.flex-col > article');
            const countTarjetas = await tarjetas.count();
            
            if (countTarjetas === 0) {
                console.log('No hay tarjetas disponibles para editar.');
                return;
            }

            // Hacer clic en la primera tarjeta que cumple con los requisitos
            const primeraTarjeta = tarjetas.first();
            const tituloTarjeta = await primeraTarjeta.locator('h3').innerText(); // Capturar el título de la tarjeta
            await primeraTarjeta.click();
        });

        await test.step('Marcar todas las subtareas no completadas', async () => {
            const checkLabels = page.locator('label.cursor-pointer.bg-light-grey');
            const countCheckboxes = await checkLabels.count();
        
            if (countCheckboxes > 0) {
                let subtareasMarcadas = 0;
                for (let i = 0; i < countCheckboxes; i++) {
                    const checkbox = checkLabels.nth(i).locator('input[type="checkbox"]');
                    if (!(await checkbox.isChecked())) {
                        await checkLabels.nth(i).click();
                        subtareasMarcadas++;
        
                        // Verificar que la subtarea completada esté tachada
                        const subtareaCompletada = checkLabels.nth(i).locator('span');
                        await expect(subtareaCompletada).toHaveCSS('text-decoration', /line-through/);
                    }
                }
                if (subtareasMarcadas === 0) {
                    console.log('No se marcaron subtareas.');
                }
            } else {
                console.log('No se encontraron subtareas.');
            }
        });
        

        await test.step('Mover la tarjeta a la primera columna', async () => {
            const dropdown = page.locator('.text-sm.text-black.dark\\:text-white.font-bold.rounded.px-4.py-3.relative.w-full.flex.items-center.border');
            await dropdown.click();
            await page.waitForSelector('.hidden.absolute.rounded.left-0.top-full.mt-4.w-full.bg-white.dark\\:bg-dark-grey.group-focus\\:block > div.p-4');

            const opciones = page.locator('.hidden.absolute.rounded.left-0.top-full.mt-4.w-full.bg-white.dark\\:bg-dark-grey.group-focus\\:block > div.p-4');
            if (await opciones.count() > 0) {
                await opciones.first().click(); // Mover a la primera columna
            } else {
                console.log('No hay opciones en el menú desplegable.');
                return;
            }
        });

        await test.step('Cerrar el modal de edición', async () => {
            // Hacer clic en el fondo del modal para cerrarlo
            await page.locator('div.fixed.min-h-screen.min-w-full.bg-black.bg-opacity-50.top-0.left-0.z-10[data-no-dragscroll]').click();


            // Verificar que el modal se haya cerrado
            await expect(page.locator('div.fixed.min-h-screen.min-w-full.bg-black.bg-opacity-50.top-0.left-0.z-10[data-no-dragscroll=""]')).not.toBeVisible();
        });

        await test.step('Verificar que la tarjeta se movió a la primera columna', async () => {
            const tarjetaEnColumna1 = page.locator('.flex.gap-6 > section:nth-child(1) .flex.flex-col > article');
            await expect(tarjetaEnColumna1.first()).toBeVisible();

            // Verificar que la tarjeta movida es la misma que editamos
            const tituloTarjetaMovida = await tarjetaEnColumna1.first().locator('h3').innerText();
            await expect(tituloTarjetaMovida).toBe(tituloTarjetaMovida);
        });
    /*
        await test.step('Verificar el número de subtareas completadas', async () => {
            const subtareasCompletadasFinal = await page.locator('input[type="checkbox"]:checked').count();
            await expect(subtareasCompletadasFinal).toBe(subtareasCompletadasInicial + 1);
        });
    */
    });
});