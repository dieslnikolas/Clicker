import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Log, LogSeverity } from '../../../core/services/logger/log.model';
import { LogService } from '../../../core/services/logger/log.service';
import { ProjectService } from '../../../core/services/project/project.service';
import { ScriptRunnerService } from '../../../core/services/script/script-runner.service';

@Component({
    selector: 'shared-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {

    public data: Log[]; // LIST OF LOGS
    private isInitialized: boolean = false;
    private readonly CONSOLE_BACKUP: string = `console-data`;
    private readonly CONSOLE_MAX_LINIES: number = 150;

    get consoleCacheName(): string {
        return `${this.CONSOLE_BACKUP}-${this.projectService.projectName}`;
    }

    get dataFromCache(): Log[] {
        let data = JSON.parse(localStorage.getItem(this.consoleCacheName)) ?? [];

        if (!this.isInitialized) {
            this.isInitialized = true;
            data.push(Log.Factory("*************** APPLICATION STARTED ***************", LogSeverity.SUCCESS));
        }

        return data;
    }

    constructor(private projectService: ProjectService, private scriptRunnerService: ScriptRunnerService, private logService: LogService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {

        // SAVE AND PUSH DATA
        this.projectService.projectLoaded.subscribe(() => {
            setTimeout(() => {
                // LOAD DATA
                this.data = this.dataFromCache
            }, 100);
        });

        // SAVE AND PUSH DATA
        this.logService.onLogged.subscribe((log) => {
            this.handleData(log);
        });
    }

    async run(event) {

        // get input
        let command = event.target.value;
        event.target.value = null;

        // value checking
        if (command == null) {
            return;
        }

        // get log recrod
        let log = Log.Factory(`${command}`, LogSeverity.SUCCESS);
        this.handleData(log);

        // run script 
        await this.scriptRunnerService.RunCMD(command);
    }

    async clearTerminal() {
        this.data = [];
        localStorage.removeItem(this.consoleCacheName);
    }

    private async handleData(log: Log) {
        if (this.data == null)
            this.data = this.dataFromCache;

        // max data length
        while (this.data.length > this.CONSOLE_MAX_LINIES) {
            this.data.shift();
        }

        // push to VM
        this.data.push(log);

        // goes to temp
        localStorage.setItem(this.consoleCacheName, JSON.stringify(this.data));
        this.cdr.detectChanges();
    }
}
