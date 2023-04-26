import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

// Read environment
const isProd = process.env.NODE_ENV === 'production';

// Set userData directory
if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

// Create main window
(async () => {

    // Wait for app to be ready
    await app.whenReady();

    // Create main window
    const mainWindow = createWindow('main', {
        width: 1400,
        height: 1000,
    });

    // Load main window
    if (isProd) {
        await mainWindow.loadURL('app://./home.html');
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}`);
        mainWindow.webContents.openDevTools();
    }
})();

// Quit when all windows are closed
app.on('window-all-closed', () => {
    app.quit();
});

ipcMain.on('get-messages', (event, arg) => {
    event.returnValue = store.get('messages') || [];
});

ipcMain.on('add-message', (event, arg) => {
    const messages = store.get('messages') || [];
    messages.push(arg);
    store.set('messages', messages);
});