import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  name: string,
  commandType: string
}

interface CommandType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'shared-command-dialog',
  templateUrl: './command-dialog.component.html',
  styleUrls: ['./command-dialog.component.scss']
})
export class CommandDialogComponent implements OnInit {

  public name: string;

  commandTypes: CommandType[] = [
    {value: 'ps1', viewValue: 'Powershell'},
    {value: 'py', viewValue: 'Python'},
    {value: 'other', viewValue: 'Other'}
  ];

  constructor(public dialogRef: MatDialogRef<CommandDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log('CommandDialogComponent INIT');
  }
}
