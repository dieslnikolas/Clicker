import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';

@Component({
    selector: 'shared-dialog-import',
    templateUrl: './dialog-import.component.html',
    styleUrls: ['./dialog-import.component.scss']
})
export class DialogImportComponent implements OnInit {
    
    constructor(public scriptGeneratorService: ScriptGeneratorService, public dialogRef: MatDialogRef<DialogImportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
    }

    async onOkClick(): Promise<void> {
        // await this.scriptGeneratorService.generate(this.data.name, this.data.scriptScope, this.data.scriptType, this.data.hasData ?? false);
    }
}
