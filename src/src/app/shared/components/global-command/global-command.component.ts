import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { APP_CONFIG } from '../../../../environments/environment';
import { ScriptScope } from '../../../core/common/scripts/script-scope';
import { ProjectService } from '../../../core/services/project/project.service';
import { ScriptRunnerService } from '../../../core/services/script/script-runner.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'shared-global-command',
    templateUrl: './global-command.component.html',
    styleUrls: ['./global-command.component.scss']
})
export class GlobalCommandComponent implements OnInit {

    @Input()
    public data: any

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };

    isProjectNotSaved = false;

    constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private scriptGeneratorSercice: ScriptGeneratorService, private projectService: ProjectService, private scriptRunnerService: ScriptRunnerService) {
    }
    
    ngOnInit(): void {
       this.registerSubscribtion();
    }

    private registerSubscribtion() {
        this.projectService.projectLoaded.subscribe(() => {
            console.log("Global -> project reloaded")
            setTimeout(() => {
                this.data = this.projectService.commands;
                this.isProjectNotSaved = this.projectService.appPath == null;
            }, APP_CONFIG.projectLoadedZoneTimeout);
        })
    }

    generateGlobalScript() {
        // dialog open
        const dialogRef = this.dialog.open(DialogComponent, {
            data: {
                scriptScope: ScriptScope.Global
            }
        });
    }

    runCommand(data: any) {

        // File
        if (data.Path == "Scripts/Core/FileOperations/Open-File.ps1") {
            this.projectService.load(null, true);
        }
        else if (data.Path == "Scripts/Core/FileOperations/Save-File.ps1") {
            this.projectService.save(null);
        }
        else if (data.Path == "Scripts/Core/FileOperations/Save-As-File.ps1") {
            this.projectService.save(null, true);
        }
        
        // Settings
        else if (data.Path == "Scripts/Core/Commands/Publish-Project.ps1") 
            this.projectService.load(null, true);
        else if (data.Path == "Scripts/Core/SettingOperations/Set-Settings.ps1")
            this.projectService.save(null);
        else if (data.Path == "Scripts/Core/SettingOperations/Open-Temp-Folder.ps1")
            this.projectService.save(null, true);
        
        // OTHER
        else 
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
        if(confirm(`Are you sure to delete ${command.DisplayName}`)) {
            this.scriptGeneratorSercice.delete(command, ScriptScope.Global);
        }
    }
    renameItem(command: any) {
        let name = null; // TODO GET NEW NAME
        this.scriptGeneratorSercice.rename(name, command, ScriptScope.Global);
    }
    editItem(command: any) {
        this.scriptGeneratorSercice.edit(command);
    }
}

