import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';
import { ScriptScope } from '../../../core/common/scripts/script-scope';
import { DialogComponent } from '../dialog/dialog.component';
import { ProjectService } from '../../../core/services/project/project.service'
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'shared-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.scss']
})
export class ModuleComponent {

    @Input()
    public data: any

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;

    contextMenuPosition = { x: '0px', y: '0px' };

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
