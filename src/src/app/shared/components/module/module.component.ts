import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { ScriptGenerator } from '../../../core/script-generator/script-generator';
import { ScriptScope } from '../../../core/script-generator/script-scope';
import { CommandDialogComponent } from '../command-dialog/command-dialog.component';
import { Settings } from './../../../core/common/settings'

@Component({
  selector: 'shared-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent {

  @Input()
  public data: any

  constructor(private settings: Settings, private dialog: MatDialog, private scriptGenerator: ScriptGenerator) { }

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
      const dialogRef = this.dialog.open(CommandDialogComponent, {
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.scriptGenerator.generate(result.name, ScriptScope.Global, result.scriptType)
      });
    }
    // change data
    else {
      this.settings.selectedModule = event.tab.textLabel;
    }
  }
}
