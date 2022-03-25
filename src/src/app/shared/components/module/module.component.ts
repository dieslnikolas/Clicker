import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';
import { ScriptScope } from '../../../core/common/scripts/script-scope';
import { DialogComponent } from '../dialog/dialog.component';
import { ProjectService } from '../../../core/services/project/project.service'
import { MatMenuTrigger } from '@angular/material/menu';
import { APP_CONFIG } from '../../../../environments/environment';
import { Command } from '../../../core/common/scripts/command';

@Component({
    selector: 'shared-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {

    @Input()
    public data: any

    isNotSelected = true;

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };


    @ViewChild('tabs') public tabs: MatTabGroup;

    constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef, private scriptGeneratorSercice: ScriptGeneratorService, private dialog: MatDialog, private scriptGeneratorService: ScriptGeneratorService) {

    }
    ngOnInit(): void {
        this.registerSubscribtion();
    }

    private registerSubscribtion() {
        this.projectService.projectLoaded.subscribe(() => {
            console.log("Module -> project reloaded")
            setTimeout(() => {
                this.data = this.projectService.modules;
                this.cdr.detectChanges();
            }, APP_CONFIG.projectLoadedZoneTimeout);
        })
        
    }

    onSelectedTabChange(event: MatTabChangeEvent) {
        this.projectService.selectedModule = event.tab.textLabel;
        this.isNotSelected = false;
    }

    createNewModule() {

        // create dialog
        const dialogRef = this.dialog.open(DialogComponent, {
            data: {
                scriptScope: ScriptScope.Module
            }
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

    deleteItem(command: Command) {
        if(confirm(`Are you sure to delete ${command.DisplayName}`))
        {
            // fake command button
            let fakeCommand = new Command();
            fakeCommand.Path = command["key"];
            this.scriptGeneratorSercice.delete(fakeCommand, ScriptScope.Module);
        }
    }
    renameItem(command: any) {
        let name = null; // TODO GET NEW NAME
        this.scriptGeneratorSercice.rename(name, command, ScriptScope.Module);
    }
    editItem(command: any) {
        this.scriptGeneratorSercice.edit(command);
    }
}
