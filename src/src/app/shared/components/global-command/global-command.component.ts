import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
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

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;

    contextMenuPosition = { x: '0px', y: '0px' };

    constructor(private dialog: MatDialog, private scriptGeneratorService: ScriptGeneratorService, private scriptRunnerService: ScriptRunnerService) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
        let data = changes[`data`];
        if (data) {
            console.log('GlobalCommandComponent got data');
        }
    }

    generateGlobalScript(commandGroup: any, commandgroupKey: string) {

        // dialog open
        const dialogRef = this.dialog.open(DialogComponent, {
            disableClose : true,
            autoFocus : true,
            data: {
                scriptScope: ScriptScope.Global
            }
        });

        // closed event
        dialogRef.afterClosed().subscribe(result => {});
    }

    runCommand(data: any, command: any) {
        this.scriptRunnerService.Run("GlobalCommand", data);
    }

    onRightClick(event: MouseEvent, command: any) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'item': command };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }
        
    deleteItem(command: any) {
        console.log(command);
    }
    renameItem(command: any) {
        console.log(command);
    }
    editItem(command: any) {
        console.log(command);
    }
}

