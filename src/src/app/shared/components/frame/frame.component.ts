import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from '../../../core/services/electron/electron.service';
import { ProjectService } from '../../../core/services/project/project.service';

@Component({
    selector: 'shared-frame',
    templateUrl: './frame.component.html',
    styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit {

    @ViewChild('minimizeButton', {static: true}) public minimizeButton: any;
    @ViewChild('maximizeButton', {static: true}) public maximizeButton: any;

    public isMaximized = false;
    public windowTitle = "Clicker";
    public isMac = false;

    private static _win: Electron.BrowserWindow;
    public static win(electron: ElectronService): Electron.BrowserWindow {
        if (this._win == null) {
            this._win = electron.remote.getCurrentWindow();
            /* Note this is different to the html global `window` variable */
        }
        return this._win;
    }

    constructor(private electronService: ElectronService, private projectService: ProjectService) {     }

    ngOnInit(): void {

        FrameComponent.win(this.electronService).on('unmaximize',this.toggleMaxRestoreButtons);
        FrameComponent.win(this.electronService).on('maximize',this.toggleMaxRestoreButtons);
        this.toggleMaxRestoreButtons();

        this.isMac = this.electronService.isMac;

        this.projectService.projectLoaded.subscribe(() => {
            setTimeout(() => this.windowTitle = `Clicker - ${this.projectService.projectName}`, 100);
        });
    }

    minimize() {
        FrameComponent.win(null).minimize();
        this.toggleMaxRestoreButtons();
    }

    maximize() {
        FrameComponent.win(null).maximize();
        this.toggleMaxRestoreButtons();
    }

    restore() {
        FrameComponent.win(null).unmaximize();
        this.toggleMaxRestoreButtons();
    }

    close() {
        FrameComponent.win(null).close();
        this.toggleMaxRestoreButtons();
    }

    toggleMaxRestoreButtons() {
        this.isMaximized = FrameComponent.win(null).isMaximized();
    }
}






