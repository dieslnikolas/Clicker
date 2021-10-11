import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ScriptGenerator } from '../../../core/script-generator/script-generator';
import { ScriptType } from '../../../core/script-generator/script-type';

/**
 * Output model for dialog
 */
export interface DialogData {
  name: string,
  scriptType: ScriptType
}

@Component({
  selector: 'shared-command-dialog',
  templateUrl: './command-dialog.component.html',
  styleUrls: ['./command-dialog.component.scss']
})
export class CommandDialogComponent implements OnInit {

  public name: string;
  public scriptTypes: ScriptType[] 

  constructor(public scriptGenerator: ScriptGenerator, public dialogRef: MatDialogRef<CommandDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.scriptTypes = ScriptType.toArray();
    this.data.scriptType = this.scriptGenerator.defaultType();
  }
}
