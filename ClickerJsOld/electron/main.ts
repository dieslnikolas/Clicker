import { Shell } from './common/shell';
import { BaseIPCService } from './common/base-ipc-service';
import { Settings } from './tools/settings';
/**
 * Electron aplication main class
 */
export class Application {

    /**
     * Init our electron application
     */
    public init(): void {

        // 1) READ SETTINGS
        Settings.init();

        //2) PREPARE IPC's
        BaseIPCService.init();

        // 3) CREATE WINDOW
        Shell.init();
    }
}

// Starts application
(new Application()).init();