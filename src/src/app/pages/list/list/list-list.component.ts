import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-list',
  templateUrl: './list-list.component.html',
  styleUrls: ['./list-list.component.scss']
})
export class ListListComponent implements OnInit {
  title = 'Tic Tac Toe';
  isAuthenticated = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('ListListComponent INIT');
  }

  async logout(): Promise<void> {
    // todo
  }

}
