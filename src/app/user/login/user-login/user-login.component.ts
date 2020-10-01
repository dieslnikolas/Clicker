import { Component, OnInit } from '@angular/core';
import { Db } from 'src/utils/common/db/db';
import { StatementType } from 'src/utils/common/db/statement-type.enum';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  public testDB: string = 'Not connected';

  constructor() { 
  }

  onTestDB() {
    var db = new Db('select * from sys.tables', StatementType.SQL, true);
    this.testDB = 'Connected';
  }

  ngOnInit(): void {
  }

}
