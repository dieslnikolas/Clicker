// Angular 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Electron 
import { NgxElectronModule } from 'ngx-electron';

// Components
import { AppRoot } from './components/shared/app-root.component';

@NgModule({
  declarations: [
    AppRoot
  ],
  imports: [
    BrowserModule,
    NgxElectronModule,
  ],
  providers: [],
  bootstrap: [AppRoot]
})
export class AppModule { }