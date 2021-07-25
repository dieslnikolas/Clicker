import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-detail',
  templateUrl: './about-detail.component.html',
  styleUrls: ['./about-detail.component.scss']
})
export class AboutDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('AboutDetailComponent INIT');
   }

}
