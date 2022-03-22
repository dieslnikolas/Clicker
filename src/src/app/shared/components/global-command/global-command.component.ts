import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScriptScope } from '../../../core/common/scripts/script-scope';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';
import { ScriptRunnerService } from '../../../core/services/script/script-runner.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'shared-global-command',
    templateUrl: './global-command.component.html',
    styleUrls: ['./global-command.component.scss']
})
export class GlobalCommandComponent implements OnChanges {

    @Input()
    public data: any

    constructor(private dialog: MatDialog, private scriptGenerator: ScriptGeneratorService, private scriptRunnerService: ScriptRunnerService) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
        let data = changes[`data`];
        if (data) {
            console.log('GlobalCommandComponent got data');
        }
    }

    generateGlobalScript(commandGroup: any, commandgroupKey: string) {

        console.log(commandgroupKey, commandGroup);
        const dialogRef = this.dialog.open(DialogComponent, {
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.scriptGenerator.generate(result.name, ScriptScope.Global, result.scriptType)
        });
    }

    RunCommand(data: any) {
        this.scriptRunnerService.Run("GlobalCommand", data);
    }
}

