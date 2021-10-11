import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScriptGenerator } from '../../../core/script-generator/script-generator';
import { ScriptScope } from '../../../core/script-generator/script-scope';
import { CommandDialogComponent } from '../command-dialog/command-dialog.component';

@Component({
  selector: 'shared-global-commands',
  templateUrl: './global-commands.component.html',
  styleUrls: ['./global-commands.component.css']
})
export class GlobalCommandsComponent {

  constructor(private dialog: MatDialog, private scriptGenerator: ScriptGenerator) {}

  ngOnInit(): void {
    console.log('GlobalCommandsComponent INIT');
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

