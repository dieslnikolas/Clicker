import { Sequelize } from 'sequelize';
import { Log } from '../log';
import { StatementType } from './statement-type.enum';

/**
 * Class allow to make mssql statement requests
 */
export class Db {

    /**
     * Connection with DB
     */
    private connection: any;

    /**
     * An SQL statement
     */
    private statement: string; 

    /**
     * SQL statement type
     */
    private statementType: StatementType;

    /**
     * If ID_Login is sent automaticaly
     */
    private isAutoAddLogin: boolean;


    /**
     * Main DB handler constructor
     * @param statement an SQL statement
     * @param statementType eg. procedure or raw sql (PROCEDURE is default)
     * @param isAutoAddLogin  if ID_Login is automaticaly added (TRUE is default)
     */
    constructor(statement: string, statementType: StatementType = StatementType.PROCEDURE, isAutoAddLogin: boolean = true) {

        // set variables
        this.statement = statement;
        this.statementType = statementType;
        this.isAutoAddLogin = isAutoAddLogin;

        // try to connect
        // this.connection = new Sequelize('FrameduckDevel', 'Frameduck', 'JKj1BBQWAkjYLdXT4zry');
    }

    /**
     * Execute statement
     */
    public Exec() {
        this.logStatement();

        // TODO: call statement

        this.closeConnection();
    }

    /**
     * Log statement
     */
    private logStatement() {
        
        if (this.statementType == StatementType.PROCEDURE) {
            // TODO: prepare input and output
        }
        
        Log.write(this.statement);
    }

    /**
     * Closes the connestion
     */
    private closeConnection() {
        this.connection.close();
    }
}
