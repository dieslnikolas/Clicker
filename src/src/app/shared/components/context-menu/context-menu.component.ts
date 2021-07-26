import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shared-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('ContextMenuComponent INIT');
  }
}
