import { Component, ViewChild } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TerminalComponent } from './shared/components';
import { Settings } from './core/common/settings';
import { CommandDialogComponent } from './shared/components/command-dialog/command-dialog.component';
import { MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public showOverlay = true;
  public loadingMessage = `Loading...`;
  public selectedModule: string;
  // data 
  public globalComands: any;
  public modules: any;

  @ViewChild(TerminalComponent) terminal: TerminalComponent;

  constructor(private electronService: ElectronService, private translate: TranslateService, 
    public dialog: MatDialog, private _snackBar: MatSnackBar, private settings: Settings) {

    this.translate.setDefaultLang('en');
    this.settings.loadSettings().then(() => {
      this.globalComands = this.settings.commands;
      this.modules = this.settings.modules;
      this.showOverlay = false;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(CommandDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
    });
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

}
