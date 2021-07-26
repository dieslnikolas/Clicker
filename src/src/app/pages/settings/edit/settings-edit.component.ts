import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-edit',
  templateUrl: './settings-edit.component.html',
  styleUrls: ['./settings-edit.component.scss']
})
export class SettingsEditComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('SettingsEditComponent INIT');
   }

}
