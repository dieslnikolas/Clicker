// Angular 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { AppRoutingModule } from './app-routing.module';

// // App moduels
// import { CoreModule } from './core/core.module';
// import { SharedModule } from './shared/shared.module';
// import { ListModule } from './pages/list/list.module';
// import { AboutModule } from './pages/about/about.module';
// import { SettingsModule } from './pages/settings/settings.module';

// // NG Translate
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';

// AoT requires an exported function for factories
// const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        
        // // Angular Modules
        // CoreModule,
        BrowserModule,
        // FormsModule,
        // HttpClientModule,

        // // App modules
        // SharedModule,
        // ListModule,
        // AboutModule,
        // SettingsModule,
        // AppRoutingModule,

        // // Translations
        // TranslateModule.forRoot({
        //     loader: {
        //         provide: TranslateLoader,
        //         useFactory: httpLoaderFactory,
        //         deps: [HttpClient]
        //     }
        // })
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
