import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title = 'Tic Tac Toe';
  isAuthenticated = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('LoginComponent INIT');
  }

  async logout(): Promise<void> {
    // todo
  }

}
