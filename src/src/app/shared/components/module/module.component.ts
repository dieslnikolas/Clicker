import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';
import { ScriptScope } from '../../../core/common/scripts/script-scope';
import { DialogComponent } from '../dialog/dialog.component';
import { ProjectService } from '../../../core/services/project/project.service'

@Component({
  selector: 'shared-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent {

  @Input()
  public data: any

  constructor(private projectService: ProjectService, private dialog: MatDialog, private scriptGeneratorService: ScriptGeneratorService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    let data = changes[`data`];
    if (data) {
      console.log('ModuleComponent got data');
    }
  }

  onSelectedTabChange(event: MatTabChangeEvent) {
    this.projectService.selectedModule = event.tab.textLabel;
  }

  createNewModule() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.scriptGeneratorService.generate(result.name, ScriptScope.Global, result.scriptType)
    });
  }
}
