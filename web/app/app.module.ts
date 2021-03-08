// Angular 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// Electron 
import { NgxElectronModule } from 'ngx-electron';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';

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

        // App Modules
        // ProvidersModule
        // PagesModule
        // ServicesModule
        // ComponentsModule

        // Electron
        NgxElectronModule,

        // Material
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatInputModule,
        MatGridListModule,
        MatToolbarModule,
        MatMenuModule
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