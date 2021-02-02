// Angular 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoot } from './components/shared/app-root.component';

// Electron 
import { NgxElectronModule } from 'ngx-electron'

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