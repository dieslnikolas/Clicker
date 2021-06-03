// Angular 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Flex layout
import { FlexLayoutModule } from '@angular/flex-layout';

// Components
import { LayoutLoginComponent } from './components/layouts/layout-login/layout-login.component';
import { LayoutMainComponent } from './components/layouts/layout-main/layout-main.component';
import { LoginComponent } from './pages/user/login/login.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { MenuComponent } from './components/menu/menu.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './app.component';

// Services
import { SSHService } from './providers/ssh.service';
import { LogService } from './providers/log.service';
import { AuthenticationService } from './providers/autehentication.service';

@NgModule({
    declarations: [
        LayoutLoginComponent,
        LayoutMainComponent,
        LoginComponent,
        TerminalComponent,
        DashboardComponent,
        MenuComponent,
        AppComponent,
        NavbarComponent 
    ],
    imports: [
        // Angular
         BrowserModule,
         FormsModule,
         AppRoutingModule,

        // App Modules
         //ProvidersModule
         //PagesModule
         //ServicesModule
         //ComponentsModule

        // Material
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatInputModule,
        MatGridListModule,
        MatToolbarModule,
        MatMenuModule,
        MatCardModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatSnackBarModule,

        // Flexlayout
        FlexLayoutModule
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