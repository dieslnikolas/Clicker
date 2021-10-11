import { Component, ViewChild } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import { CommandDialogComponent } from './shared/components/command-dialog/command-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TerminalComponent } from './shared/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(TerminalComponent) terminal : TerminalComponent;
  
  constructor(private electronService: ElectronService, private translate: TranslateService, private _snackBar: MatSnackBar) {

    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Dismiss', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000
    });
  }

  testTerminal(message: string) {
    this.terminal.write(message);
  }
}
