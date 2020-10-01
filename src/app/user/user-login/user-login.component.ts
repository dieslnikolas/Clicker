import { Component, OnInit } from '@angular/core';
import { Db } from 'src/utils/common/db/db';
import { DbStatementType } from 'src/utils/common/db/statement-type.enum';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  public result: string = 'Not connected';

  constructor() { }

  /**
   * It will test DB connection
   */
  public onTestDB() {

    try {
      var db = new Db("select * from sys.tables", DbStatementType.SQL, true);
      db.exec();
      this.result = 'Connected!';
    }
    catch {
      this.result = 'Error';
    }


  }

  ngOnInit(): void {
  }

}
