import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Settings } from '../../../core/common/settings';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-list-list',
  styleUrls: ['list-list.component.scss'],
  templateUrl: 'list-list.component.html',
})
export class ListListComponent implements AfterViewInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  commands: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  constructor(private settings: Settings) {
    this.commands = this.settings.modulesCommand;
    this.displayedColumns = this.settings.dataCollumns;
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.settings.data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  contextMenuPosition = { x: '0px', y: '0px' };

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
    console.log(action, item);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}