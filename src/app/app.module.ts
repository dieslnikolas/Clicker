import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'; 
import { AppRoutingModule } from './app-routing.module';

// pages component
import { UserLoginComponent } from './user/user-login/user-login.component';

@NgModule({
  declarations: [
    UserLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [UserLoginComponent]
})
export class AppModule { }
