import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from './core/services/project/project.service';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { TerminalComponent } from './shared/components/terminal/terminal.component';
import { ElectronService } from './core/services/electron/electron.service';
import { ScriptRunnerService } from './core/services/script/script-runner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // page state
  public isLoading = true;
  public isProjectLoaded = false;
  public loadingMessage = `Loading...`;
  public selectedModule: string;

  // data 
  public globalComands: any;
  public modules: any;

  // for speeding devel proces, there is template
  private PROJECT_TEMPLATE: string = '/project_template/IT2021Sale.pwgen';

  @ViewChild(TerminalComponent) terminal: TerminalComponent;

  constructor(private electronService: ElectronService, private translate: TranslateService,
    public dialog: MatDialog, private _snackBar: MatSnackBar, private projectService: ProjectService,
    private scriptRunnerService: ScriptRunnerService) {

    this.translate.setDefaultLang('en');

    // try to load default project
    this.loadProjectFromFile(
      this.electronService.path.resolve(this.electronService.remote.app.getAppPath() + this.PROJECT_TEMPLATE)
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
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
   * Sends snack bar message
   * @param message Message to snack bar info
   */
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Dismiss', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000
    });
  }

  /**
   * Sends message to terminal
   * @param message Terminal message (testing purposes)
   */
  testTerminal(message: string) {
    this.terminal.write(message);
  }


  loadProjectFromFile(file: string) {
    this.projectService.load(file).then((isLoaded) => {
      if (isLoaded) {
        this.globalComands = this.projectService.commands;
        this.modules = this.projectService.modules;
        this.isLoading = false;
        this.isProjectLoaded = true;

        this.scriptRunnerService.Init();
      }
      else {
        this.isLoading = false;
      }
    });
  }
}

