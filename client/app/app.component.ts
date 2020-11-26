import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {

  title = 'Endomondo vykrádač';
  errorLog = '';
  email; 
  password;

  constructor(private _electronService: ElectronService) { }

  public DownloadActivities(): void {
    if (this._electronService.isElectronApp) {
      let pong: string = this._electronService.ipcRenderer.sendSync('ping');
      console.log(pong);
      console.log(this.email);
      console.log(this.password);
    }
    else {
      this.errorLog = 'V pohodě';
    }
  }
}