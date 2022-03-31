import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ElectronService } from "../electron/electron.service";
import { Log, LogSeverity } from "./log.model";

@Injectable({
    providedIn: 'root'
})
export class LogService {

    private logger;
    public onLogged: Subject<Log> = new Subject<Log>();

    constructor(private electronService: ElectronService) {

        // gets logger
        this.logger = this.electronService.log4js.getLogger();

        // FILE - only errors to file
        let path = this.electronService.path.resolve(this.electronService.remote.app.getPath('temp'), 'Clicker', "log.txt");
        this.electronService.log4js.configure({
            appenders: { toFile: { type: "file", filename: path } },
            categories: { default: { appenders: ["toFile"], level: "error" } }
        });

        // how much we want to log
        this.logger.level = "debug";
    }

    /**
     * Log message
     * @param message log messagfe
     */
    public async write(message: string) {
        this.writeMsg(message, LogSeverity.DEBUG);
    }

    error(error: any) {
        this.writeMsg(error, LogSeverity.ERROR);
    }

    warn(message: string) {
        this.writeMsg(message, LogSeverity.WARN);
    }

    success(message: string) {
        this.writeMsg(message, LogSeverity.SUCCESS);
    }

    private writeMsg(message: any, logSeverity: LogSeverity) {

        switch (logSeverity) {
            case LogSeverity.DEBUG:
                this.logger.debug(message);
                break;
            case LogSeverity.WARN:
                this.logger.warn(message);
                break;
            case LogSeverity.ERROR:
                this.logger.error(message);
                break;
             case LogSeverity.SUCCESS:
                this.logger.info(message);
                    break;
        }

        // new log
        let log = new Log();

        // SEVERITY ADN MESSAGE
        log.logSeverity = logSeverity;
        log.message = message
        
        // ERROR CALL STACK
        if (message.stack != null) {
            log.message = `
            
            \r\nSTACK: ${message.stack}`;
        }

        // date
        const d = new Date();
        const dd = [d.getHours(), d.getMinutes(), d.getSeconds()].map((a) => (a < 10 ? '0' + a : a));
        log.datetime = dd.join(':')

        log.log4jsOutput = `${log.datetime} - ${LogSeverity[log.logSeverity]}: ${log.message}`;

        this.onLogged.next(log);
    }
}

