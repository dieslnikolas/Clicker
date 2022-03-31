import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../core/services/logger/log.service';

@Component({
  selector: 'app-settings-edit',
  templateUrl: './settings-edit.component.html',
  styleUrls: ['./settings-edit.component.scss']
})
export class SettingsEditComponent implements OnInit {

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.logService.write('SettingsEditComponent INIT');
   }

}
