import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.scss']
})
export class AppRoot {

  model = { 
    currentYear: 2021,
    server: null,
    email: null,
    password: null,
    isRemember: true
  }

  constructor() {
  }

  public LogIn() : void {
    
  }

}