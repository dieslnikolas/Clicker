import * as log4js from "log4js";
import * as path from 'path'
import { app, ipcMain } from "electron";

/**
 * Class for creating menubar
 */
export class Logger {

    private logger;

    /** Where error comes from */
    private isRenderProcess: boolean = false;

    /**
     * Creates initial menu
     */
    public write(message: any) {
        this.logger.error(this.isRenderProcess ? `RENDERER PROCESS` : `MAIN PROCESS:`, message);
    }

    constructor() {
        // gets logger
        this.logger = log4js.getLogger();

        // FILE - only errors to file
        let pathF = path.resolve(app.getPath('temp'), 'Clicker', "log.txt");
        log4js.configure({
            appenders: {
                toFile:
                {
                    type: "file", filename: pathF
                }
            },
            categories:
            {
                default:
                {
                    appenders: ["toFile"], level: "error"
                }
            }
        });

        // how much we want to log
        this.logger.level = "debug";

        // REGISTER EVENTS
        this.loggerIpc();
    }

    /**
     * IPC method
     */
    loggerIpc() {
        ipcMain.handle('logger-ipc', async (event, message, logSeverity) => {
            switch (logSeverity) {
                case 0: // LogSeverity.DEBUG:
                    this.logger.debug(message);
                    break;
                case 1: // LogSeverity.WARN:
                    this.logger.warn(message);
                    break;
                case 2: //LogSeverity.ERROR:
                    this.logger.error(message);
                    break;
                case 3: // LogSeverity.SUCCESS:
                    this.logger.info(message);
                    break;
            }
        })
    }
}