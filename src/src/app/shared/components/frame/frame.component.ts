import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from '../../../core/services/electron/electron.service';

@Component({
    selector: 'shared-frame',
    templateUrl: './frame.component.html',
    styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit {

    @ViewChild('minimizeButton', {static: true}) public minimizeButton: any;
    @ViewChild('maximizeButton', {static: true}) public maximizeButton: any;

    public isMaximized = false;
    public isMac = false;

    private static _win: Electron.BrowserWindow;
    public static win(electron: ElectronService): Electron.BrowserWindow {
        if (this._win == null) {
            this._win = electron.remote.getCurrentWindow();
            /* Note this is different to the html global `window` variable */
        }
        return this._win;
    }

    constructor(private electron: ElectronService) {     }

    ngOnInit(): void {

        FrameComponent.win(this.electron).on('unmaximize',this.toggleMaxRestoreButtons);
        FrameComponent.win(this.electron).on('maximize',this.toggleMaxRestoreButtons);
        this.isMac = this.electron.remote.process.platform === 'darwin';
        this.toggleMaxRestoreButtons();
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






