import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../core/services/logger/log.service';

@Component({
  selector: 'app-about-detail',
  templateUrl: './about-detail.component.html',
  styleUrls: ['./about-detail.component.scss']
})
export class AboutDetailComponent implements OnInit {

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.logService.write('AboutDetailComponent INIT');
   }

}
