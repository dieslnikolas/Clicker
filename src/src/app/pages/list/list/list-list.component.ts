import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ScriptScope } from '../../../core/common/scripts/script-scope';
import { ProjectService } from '../../../core/services/project/project.service';
import { ScriptGeneratorService } from '../../../core/services/script/script-generator.service';
import { ScriptRunnerService } from '../../../core/services/script/script-runner.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { LogService } from '../../../core/services/logger/log.service';
import { DialogImportComponent } from '../../../shared/components/dialog-import/dialog-import.component';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-list-list',
    styleUrls: ['list-list.component.scss'],
    templateUrl: 'list-list.component.html',
})
export class ListListComponent implements OnInit {

    contextMenuPosition = { x: '0px', y: '0px' };
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[];
    commands: any;
    dataLoaded: boolean = false;
    existsImport = false;
    moduleSelected = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;

    constructor(private projectService: ProjectService, private dialog: MatDialog, private logService: LogService,
        private scriptRunnerService: ScriptRunnerService, private scriptGeneratorSercice: ScriptGeneratorService
    ) {
        this.projectService.moduleChanged.subscribe(() => {
            this.refreshModule();
        });

        this.projectService.projectLoaded.subscribe(() => {
            this.refreshModule();
        });
    }

    ngOnInit(): void {
        this.refreshModule();
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
     */
    private async createNewImportScript() {

        // create dialog
        const dialogRef = this.dialog.open(DialogComponent, {
            data: {
                scriptScope: ScriptScope.Import
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

    onContextMenuAction(command: any, action: string, row: any) {
        command.value.ProcessItem = row;
        command.value.Key = row.name;

        this.scriptRunnerService.Run(action, command.value);
    }

    async importData() {

        let obs = this.scriptRunnerService.onScriptFinished.subscribe((result) => {
            obs.unsubscribe();
            let data = JSON.parse(result)[this.projectService.selectedModule];
            // create dialog
            const dialogRef = this.dialog.open(DialogImportComponent, {
                data: Object.entries(data)
            });
        });

        this.scriptRunnerService.Run("Import", this.projectService.moduleImport);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    deleteItem(row: any, command: any) {
        if (confirm(`Are you sure to delete ${command.DisplayName}`)) {
            command.ProcessItem = row;
            this.scriptGeneratorSercice.delete(command, ScriptScope.Item);
        }
    }
    renameItem(row: any, command: any) {
        let name = null; // TODO GET NEW NAME
        command.ProcessItem = row;
        this.scriptGeneratorSercice.rename(name, command, ScriptScope.Item);
    }
    editItem(row: any, command: any) {
        command.ProcessItem = row;
        this.scriptGeneratorSercice.edit(command);
    }

    private async refreshModule() {

        // Assign the data to the data source for the table to render
        this.commands = this.projectService.moduleCommands;
        this.displayedColumns = this.projectService.moduleColumns;

        // datasource
        let data = this.projectService.moduleData;
        let hasData = data != null && Object.entries(data).length > 0;
        if (hasData) {
            this.dataSource = new MatTableDataSource(data);
            this.dataLoaded = data != null && data.length > 0;

            // filter pagination
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
        else {
            this.dataSource = null;
        }

        // bits
        this.dataLoaded = hasData;
        this.existsImport = this.projectService.moduleImport != null && data != null && Object.entries(data).length > 0;
        this.moduleSelected = this.projectService.selectedModule != null;
    }
}