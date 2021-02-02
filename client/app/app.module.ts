// Angular 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Electron 
import { NgxElectronModule } from 'ngx-electron';

// Boostrap
import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { AlertModule } from 'ngx-bootstrap/alert'
import { ProgressbarModule } from 'ngx-bootstrap/progressbar'
import { ModalModule } from 'ngx-bootstrap/modal'
import { TooltipModule } from 'ngx-bootstrap/tooltip'

// Components
import { AppRoot } from './components/shared/app-root.component';

@NgModule({
  declarations: [
    AppRoot
  ],
  imports: [
    // Angular
    BrowserModule,

    // Electron
    NgxElectronModule,

    // Boostrap
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppRoot]
})
export class AppModule { }