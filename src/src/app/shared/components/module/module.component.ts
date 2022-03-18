import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { Settings } from './../../../core/common/settings'

@Component({
  selector: 'shared-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent {

  @Input()
  public data: any

  constructor(private settings: Settings) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    let data = changes[`data`];
    if (data) {
      console.log('ModuleComponent got data');
    }
  }

  onSelectedTabChange(event: MatTabChangeEvent) {

    // new module
    if (event.index == this.settings.modulesCount) {
      console.log('todo: new')
    }
    // change data
    else {
      this.settings.selectedModule = event.tab.textLabel;
    }
  }
}
