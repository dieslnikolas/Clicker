import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Log } from '../../../core/services/logger/log.model';
import { LogService } from '../../../core/services/logger/log.service';
import { ProjectService } from '../../../core/services/project/project.service';

@Component({
    selector: 'shared-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, AfterViewInit {

    public data: Log[]; // LIST OF LOGS
    private readonly CONSOLE_BACKUP: string = `console-data`;
    private readonly CONSOLE_MAX_LINIES: number = 150;

    panelOpenState: boolean = false;

    constructor(private projectService: ProjectService, private logService: LogService) { }

    ngOnInit(): void {

        // LOAD DATA
        this.data = JSON.parse(localStorage.getItem(this.CONSOLE_BACKUP)) ?? [];

        // SAVE AND PUSH DATA
        this.logService.onLogged.subscribe((log) => {

            // max data length
            while (this.data.length > this.CONSOLE_MAX_LINIES) {
                this.data.shift();
            }

            // push to VM
            this.data.push(log);

            // goes to temp
            localStorage.setItem(this.CONSOLE_BACKUP, JSON.stringify(this.data));
        });
    }

    ngAfterViewInit() {
        // this.xTermJS.keyEventInput.subscribe(e => {

        //     // get args
        //     const ev = e.domEvent;
        //     const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        //     // ENTER
        //     if (ev.keyCode === 13) {
        //         this.write(``);
        //     }

        //     // dont know
        //     else if (ev.keyCode === 8) {
        //         if (this.xTermJS.underlying.buffer.active.cursorX > 2) {
        //             this.xTermJS.write('\b \b');
        //         }


        //     }

        //     // regular key
        //     else if (printable) {
        //         this.xTermJS.write(e.key);
        //     }
        // })
    }

    clearTerminal() {
        this.data = [];
        localStorage.removeItem(this.CONSOLE_BACKUP);
    }
}
