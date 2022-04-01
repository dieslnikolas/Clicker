import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from './core/services/project/project.service';
import { ElectronService } from './core/services/electron/electron.service';
import { ScriptRunnerService } from './core/services/script/script-runner.service';
import { APP_CONFIG } from '../environments/environment';
import { GlobalCommandComponent } from './shared/components/global-command/global-command.component';
import { ModuleComponent } from './shared/components/module/module.component';
import { LogService } from './core/services/logger/log.service';

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
    public isProject: boolean = false; 

    // for speeding devel proces, there is template
    private PROJECT_TEMPLATE: string = '/project_template/IT2021Sale2.pwgen';

    @ViewChild(GlobalCommandComponent) globalCommand: GlobalCommandComponent;
    @ViewChild(ModuleComponent) module: ModuleComponent;

    constructor(private logService: LogService, private electronService: ElectronService, private translate: TranslateService,
        public dialog: MatDialog, private snackBar: MatSnackBar, private projectService: ProjectService,
        private scriptRunnerService: ScriptRunnerService) {

        this.translate.setDefaultLang('en');

         /**
         * Project is loading
         */
        this.projectService.projectLoading.subscribe((projectFile) => {
            setTimeout(() => {
                this.isLoading = true; 

                if (projectFile != null)
                    this.loadingMessage = `<span style="font-weight:bolder">Loading:</span> <small style="color:#aaa">${projectFile}</small>`
                else
                    this.loadingMessage = `Loading...`;
            }, 50);
        });

        /**
         * Project is loaded
         */
        this.projectService.projectLoaded.subscribe(() => {
            setTimeout(() => {
                this.projectLoaded(true)

                if (this.projectService.appPath!=null) {
                    let message = `Application oppened at: ${this.projectService.appPath ?? "<empty project>"}`;
                    this.snackBar.open(message, 'Dismiss', {
                        duration: 3000
                    });
                    this.logService.success(message);
                }
            }, APP_CONFIG.projectLoadedZoneTimeout);
        });

    }

    ngAfterViewInit(): void {
        let path = this.electronService.remote.app.getAppPath() + this.PROJECT_TEMPLATE;
        if (process.argv[1] != null) {
            path = process.argv[1];
            this.logService.write(path);
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
                    { name: 'Clicker', extensions: ['clicker'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

        if (dialogResult != null)
            this.loadProjectFromFile(dialogResult.pop());
    }

    async createProject() {
        let filePath = this.electronService.remote.dialog.showSaveDialogSync(
            {
                filters: [
                    { name: 'Powergene', extensions: ['pwgen'] },
                    { name: 'Clicker', extensions: ['clicker'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

        if (filePath != null) {
            await this.projectService.save(filePath);
            await this.loadProjectFromFile(filePath);
        }
    }

    /**
     * 
     * @param file project file
     */
    async loadProjectFromFile(file: string): Promise<void> {
        setTimeout(() => { this.loadingMessage = `<span style="font-weight:bolder">Loading:</span> <small style="color:#aaa">${file}</small>` }, 100);
        await this.projectService.load(file);
    }

    async openExternal(url: string)
    {
        this.electronService.remote.shell.openExternal(url);
    }

    private async projectLoaded(isLoaded: Boolean) {
        this.isProject = this.projectService.appPath != null;
        if (isLoaded) {
            this.isLoading = false;
            await this.scriptRunnerService.Init();
        }
        else {
            this.isLoading = false;
        }
    }
}

