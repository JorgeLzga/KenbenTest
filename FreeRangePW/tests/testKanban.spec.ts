import { test } from '@playwright/test';
import { KanbanPage } from '../pages/kanbanPage';
import { afterEach } from 'node:test';

test.describe('Pruebas de la aplicación Kanban', () => {
    test('Acceder a la página principal', async ({ page }) => {
        const kanban = new KanbanPage(page);
        await kanban.navegar();
    });

    test('Editar una tarjeta y moverla a la primera columna', async ({ page }) => {
        const kanban = new KanbanPage(page);
        await kanban.navegar();
        const titulo = await kanban.seleccionarTarjeta();
        if (!titulo) return;
        await kanban.marcarSubtareas();
        await kanban.moverTarjeta();
        await kanban.cerrarModal();
        await kanban.verificarMovimiento(titulo);
        
    });

    test('Idenificar Titulos', async ({ page }) => {
        const kanban = new KanbanPage(page);
        await kanban.navegar();
        
        const tituloN = await page.locator('h2')
        const contadorTitulos = await tituloN.count();

        const secciones = await page.locator('section');
        const totalSecciones = await secciones.count();


        for (let i=0; i < contadorTitulos; i++){
            const titulo = await tituloN.nth(i).innerText();
            console.log(`Titulo ${i+1} es: ${titulo}`)

            const articulos = await secciones.nth(i).locator('article h3');
            const totalArticulos = await articulos.count();

            if (totalArticulos === 0) {
                console.log('No hay articulos en esta sección');
            } else {
                for (let j = 0; j < totalArticulos; j++) {
                    const articuloTexto = await articulos.nth(j).innerText();
                    console.log(`Articulo ${j + 1}: ${articuloTexto}`);
                }
            }
        }        
        
    })
    

});
