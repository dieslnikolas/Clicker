import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ScriptType } from '../../../core/common/scripts/script-type';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';

/**
 * Output model for dialog
 */
export interface DialogData {
  name: string,
  scriptType: ScriptType
}

@Component({
  selector: 'shared-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  public name: string;
  public scriptTypes: ScriptType[] 
  public title: string;

  constructor(public scriptGeneratorService: ScriptGeneratorService, public dialogRef: MatDialogRef<DialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.scriptTypes = this.scriptGeneratorService.scriptTypes;
    this.data.scriptType = this.scriptGeneratorService.defaultType;
  }
}
