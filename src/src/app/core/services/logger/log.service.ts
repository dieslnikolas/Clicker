import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ElectronService } from "../electron/electron.service";
import { Log, LogSeverity } from "./log.model";

@Injectable({
    providedIn: 'root'
})
export class LogService {

    public onLogged: Subject<Log> = new Subject<Log>();

    constructor(private electronService: ElectronService) {
    }

    /**
     * Log message
     * @param message log messagfe
     */
    public async write(message: string) {
        this.writeMsg(message, LogSeverity.DEBUG);
    }

    /**
     * Red
     * @param error 
     */
    public async error(error: any) {
        this.writeMsg(error, LogSeverity.ERROR);
    }

    /**
     * Yellow
     * @param message 
     */
    public async warn(message: string) {
        this.writeMsg(message, LogSeverity.WARN);
    }

    /**
     * Green
     * @param message 
     */
    public async success(message: string) {
        this.writeMsg(message, LogSeverity.SUCCESS);
    }

    private async writeMsg(message: any, logSeverity: LogSeverity) {

        // error check
        if (message.stack != null)
            logSeverity = LogSeverity.ERROR;

        // electron log
        this.electronService.ipcRenderer.invoke('logger-ipc', message, LogSeverity.DEBUG);

        // new log (console output)
        let log = Log.Factory(message, logSeverity);
        this.onLogged.next(log);
    }
}

