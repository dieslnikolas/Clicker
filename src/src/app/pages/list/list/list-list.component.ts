import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ScriptScope } from '../../../core/common/scripts/script-scope';
import { ProjectService } from '../../../core/services/project/project.service';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';
import { ScriptRunnerService } from '../../../core/services/script/script-runner.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-list-list',
    styleUrls: ['list-list.component.scss'],
    templateUrl: 'list-list.component.html',
})
export class ListListComponent {

    contextMenuPosition = { x: '0px', y: '0px' };
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[];
    commands: any;
    dataLoaded: boolean = false;
    existsImport = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;

    constructor(private projectService: ProjectService, private dialog: MatDialog,
        private scriptRunnerService: ScriptRunnerService, private scriptGeneratorSercice: ScriptGeneratorService
        ) {
        this.projectService.moduleChanged.subscribe(() => {
            this.refreshModule();
        });

        this.projectService.projectLoaded.subscribe(() => {
            this.refreshModule();
        });
    }
    
    /**
     * 
     */
    private async createNewScript() {

        // create dialog
        const dialogRef = this.dialog.open(DialogComponent, {
            data: {
                scriptScope: ScriptScope.Item
            }
        });
    }


    /**
     * 
     * @param event Moouse click
     * @param item selected item
     */
    onContextMenu(event: MouseEvent, item: any) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'item': item };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }

    onContextMenuAction(item: any, action: string) {
        this.scriptRunnerService.Run(action, item.value);
    }

    importData() {
        this.scriptRunnerService.Run("Import", this.projectService.moduleImport);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    
    deleteItem(command: any) {
        if(confirm(`Are you sure to delete ${command.DisplayName}`))
            this.scriptGeneratorSercice.delete(command, ScriptScope.Item);
    }
    renameItem(command: any) {
        let name = null; // TODO GET NEW NAME
        this.scriptGeneratorSercice.rename(name, command, ScriptScope.Item);
    }
    editItem(command: any) {
        this.scriptGeneratorSercice.edit(command);
    }

    private async refreshModule() {
        // Assign the data to the data source for the table to render
        this.commands = this.projectService.moduleCommands;
        this.displayedColumns = this.projectService.moduleColumns;

        // datasource
        let data = this.projectService.moduleData;
        this.dataSource = new MatTableDataSource(data);
        this.dataLoaded = data != null && data.length > 0;

        // filter pagination
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.existsImport = this.projectService.moduleImport != null;
   }
}