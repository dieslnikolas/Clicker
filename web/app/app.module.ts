// Angular 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// Electron 
import { NgxElectronModule } from 'ngx-electron';

// Boostrap
import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { AlertModule } from 'ngx-bootstrap/alert'
import { ProgressbarModule } from 'ngx-bootstrap/progressbar'
import { ModalModule } from 'ngx-bootstrap/modal'
import { TooltipModule } from 'ngx-bootstrap/tooltip'

// Fontawesome
import { NgxFontAwesomeModule } from 'ngx-font-awesome';

// Components
import { LayoutLoginComponent } from './components/shared/layout-login/layout-login.component';
import { LayoutMainComponent } from './components/shared/layout-main/layout-main.component';
import { LoginComponent } from './components/user/login/login.component';
import { TerminalComponent } from './components/shared/terminal/terminal.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { MenuComponent } from './components/shared/menu/menu.component';
import { SSHService } from './providers/ssh.service';
import { LogService } from './providers/log.service';
import { AuthenticationService } from './providers/autehentication.service';
import { AppComponent } from './app.component';
import { MainPanelComponent } from './components/shared/main-panel/main-panel.component';

@NgModule({
    declarations: [
        LayoutLoginComponent,
        LayoutMainComponent,
        LoginComponent,
        TerminalComponent,
        DashboardComponent,
        MenuComponent,
        AppComponent,
        MainPanelComponent
    ],
    imports: [
        // Angular
        BrowserModule,
        FormsModule,
        AppRoutingModule,

        // Electron
        NgxElectronModule,

        // Boostrap
        ButtonsModule.forRoot(),
        AlertModule.forRoot(),
        ProgressbarModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot(),

        // Fontawesome
        NgxFontAwesomeModule
        ],
    providers: [
        SSHService,
        LogService,
        AuthenticationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}