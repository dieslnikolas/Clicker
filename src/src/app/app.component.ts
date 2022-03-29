import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from './core/services/project/project.service';
import { TerminalComponent } from './shared/components/terminal/terminal.component';
import { ElectronService } from './core/services/electron/electron.service';
import { ScriptRunnerService } from './core/services/script/script-runner.service';
import { APP_CONFIG } from '../environments/environment';
import { GlobalCommandComponent } from './shared/components/global-command/global-command.component';
import { ModuleComponent } from './shared/components/module/module.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

    // page state
    public isLoading: boolean = true;
    public loadingMessage = `Loading...`;
    public selectedModule: string;
    public isWindows = true;

    // for speeding devel proces, there is template
    private PROJECT_TEMPLATE: string = '/project_template/IT2021Sale2.pwgen';

    @ViewChild('term') terminal: TerminalComponent;
    @ViewChild(GlobalCommandComponent) globalCommand: GlobalCommandComponent;
    @ViewChild(ModuleComponent) module: ModuleComponent;

    constructor(private electronService: ElectronService, private translate: TranslateService,
        public dialog: MatDialog, private snackBar: MatSnackBar, private projectService: ProjectService,
        private scriptRunnerService: ScriptRunnerService) {

        this.translate.setDefaultLang('en');

        this.projectService.projectLoaded.subscribe(() => {
            setTimeout(() => {
                this.projectLoaded(true)
                this.snackBar.open(`Application oppened at: ${this.projectService.appPath ?? "<empty project>"}`, 'Dismiss', {
                    duration: 3000
                });

            }, APP_CONFIG.projectLoadedZoneTimeout);
        })
    }

    ngAfterViewInit(): void {
        let path = this.electronService.remote.app.getAppPath() + this.PROJECT_TEMPLATE;
        if (process.argv[1] != null) {
            path = process.argv[1];
            console.log(path);
        }

        // try to load default project
        this.loadProjectFromFile(
            this.electronService.path.resolve(this.electronService.remote.app.getAppPath() + this.PROJECT_TEMPLATE)
        );
    }

    ngOnInit(): void {
        this.isWindows = this.electronService.isWindows;
    }

    loadProject() {
        let dialogResult = this.electronService.remote.dialog.showOpenDialogSync(
            {
                properties: ['openFile'],
                filters: [
                    { name: 'Powergene', extensions: ['pwgen'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

        this.loadProjectFromFile(dialogResult.pop());
    }

    async createProject() {
        let filePath = this.electronService.remote.dialog.showSaveDialogSync(
            {
                filters: [
                    { name: 'Powergene', extensions: ['pwgen'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

        if (filePath != null) {
            await this.projectService.save(filePath);
            await this.loadProjectFromFile(filePath);
        }
    }

    /**
     * Sends message to terminal
     * @param message Terminal message (testing purposes)
     */
    testTerminal(message: string) {
        this.terminal.write(message);
    }


    /**
     * 
     * @param file project file
     */
    async loadProjectFromFile(file: string): Promise<void> {
        setTimeout(() => { this.loadingMessage = `<span style="font-weight:bolder">Loading:</span> <small style="color:#aaa">${file}</small>` }, 100);
        await this.projectService.load(file);
    }

    private async projectLoaded(isLoaded: Boolean) {
        if (isLoaded) {
            this.isLoading = false;
            await this.scriptRunnerService.Init();
        }
        else {
            this.isLoading = false;
        }
    }
}

