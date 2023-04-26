import { screen, BrowserWindow } from 'electron';
import Store from 'electron-store';

export default function createWindow(windowName, options) {

    // Store key
    const key = 'window-state';

    // Default options
    const name = `window-state-${windowName}`;

    // Create store
    const store = new Store({ name });

    // Window default size
    const defaultSize = {
        width: options.width,
        height: options.height,
    };

    // Window state
    let state = {};

    // Window instance
    let win;

    // Restore window state
    const restore = () => store.get(key, defaultSize);

    // Get current window position
    const getCurrentPosition = () => {

        // Get window position and size
        const position = win.getPosition();
        const size = win.getSize();
        return {
            x: position[0],
            y: position[1],
            width: size[0],
            height: size[1],
        };
    };

    // Check if window is within bounds
    const windowWithinBounds = (windowState, bounds) => {
        return (
            windowState.x >= bounds.x &&
            windowState.y >= bounds.y &&
            windowState.x + windowState.width <= bounds.x + bounds.width &&
            windowState.y + windowState.height <= bounds.y + bounds.height
        );
    };

    // Reset window to defaults
    const resetToDefaults = () => {
        const bounds = screen.getPrimaryDisplay().bounds;
        return Object.assign({}, defaultSize, {
            x: (bounds.width - defaultSize.width) / 2,
            y: (bounds.height - defaultSize.height) / 2
        });
    };

    // Ensure window is visible on some display
    const ensureVisibleOnSomeDisplay = (windowState) => {
        const visible = screen.getAllDisplays().some(display => {
            return windowWithinBounds(windowState, display.bounds)
        });
        if (!visible) {
            // Window is partially or fully not visible now.
            // Reset it to safe defaults.
            return resetToDefaults();
        }
        return windowState;
    };

    // Save window state
    const saveState = () => {

        // If window is maximized or minimized, do not save state
        if (!win.isMinimized() && !win.isMaximized()) {
            Object.assign(state, getCurrentPosition());
        }
        store.set(key, state);
    };

    // Get window state
    state = ensureVisibleOnSomeDisplay(restore());

    // Create window
    win = new BrowserWindow({
        ...state,
        ...options,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            ...options.webPreferences,
        },
    });

    // Load window state
    win.on('close', saveState);

    return win;
};
