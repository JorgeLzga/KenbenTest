import { test } from '@playwright/test';
import { KanbanPage } from '../pages/kanbanPage';

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
});
