import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScriptScope } from '../../../core/common/scripts/script-scope';
import { ScriptType } from '../../../core/common/scripts/script-type';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';

/**
 * Output model for dialog
 */
export class DialogData {
    name: string;
    scriptType: ScriptType;
    scriptTypes: ScriptType[];
    scriptScope: ScriptScope;
    hasData: boolean;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class ErrorMatcherRequired implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }

@Component({
    selector: 'shared-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
    name = new FormControl('valid', [Validators.required]);
    scriptType = new FormControl('valid', [Validators.required]);
    matcher = new ErrorMatcherRequired();
    
    constructor(public scriptGeneratorService: ScriptGeneratorService, public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
        }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        // model
        this.data.scriptTypes = this.scriptGeneratorService.scriptTypes;
        this.data.scriptType = this.scriptGeneratorService.defaultType;
    }

    async onOkClick(): Promise<void> {
        await this.scriptGeneratorService.generate(this.data.name, this.data.scriptScope, this.data.scriptType, this.data.hasData ?? false);
    }
}
