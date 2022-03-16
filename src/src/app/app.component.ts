import { Component, ViewChild } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TerminalComponent } from './shared/components';
import { Settings } from './core/common/settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public showOverlay = true;
  public loadingMessage = `Loading...`;

  // data 
  public globalComands: [];

  @ViewChild(TerminalComponent) terminal: TerminalComponent;

  constructor(private electronService: ElectronService, private translate: TranslateService, private _snackBar: MatSnackBar, private settings: Settings) {

    this.translate.setDefaultLang('en');
    this.settings.loadSettings().then(() => {
      this.globalComands = this.settings.commands;

      this.showOverlay = false;
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
