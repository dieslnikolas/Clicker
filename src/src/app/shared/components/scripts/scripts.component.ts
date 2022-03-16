import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScriptGenerator } from '../../../core/script-generator/script-generator';
import { ScriptScope } from '../../../core/script-generator/script-scope';
import { CommandDialogComponent } from '../command-dialog/command-dialog.component';

@Component({
  selector: 'shared-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.css']
})
export class ScriptsCommandsComponent implements OnChanges {

  @Input()
  public data: any

  constructor(private dialog: MatDialog, private scriptGenerator: ScriptGenerator) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    let data = changes[`data`];
    if (data) {
      console.log(data.currentValue);
    }
  }

  generateGlobalScript() {
    const dialogRef = this.dialog.open(CommandDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.scriptGenerator.generate(result.name, ScriptScope.Global, result.scriptType)
    });
  }
}

