import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'shared-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent {

  @Input()
  public data: any

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    let data = changes[`data`];
    if (data) {
      console.log('ModuleComponent got data');
    }
  }
}
