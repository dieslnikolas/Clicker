import { Sequelize } from 'sequelize';
import { DbStatementType } from './statement-type.enum';

/**
 * Class allow to make mssql statement requests
 */
export class Db {

    /**
     * Connection with DB
     */
    private connection: Sequelize;

    /**
     * An SQL statement
     */
    private statement: string; 

    /**
     * If ID_Login is sent automaticaly
     */
    private isAutoAddLogin: boolean;

    /**
     * Main DB handler constructor
     * @param statement an SQL statement
     * @param dbStatementType eg. procedure or raw sql (PROCEDURE is default)
     * @param isAutoAddLogin  if ID_Login is automaticaly added (TRUE is default)
     */
    constructor(statement: string, dbStatementType: DbStatementType = DbStatementType.PROCEDURE, isAutoAddLogin: boolean = true) {

        // setup connection
        this.connection = new Sequelize('FrameduckDevel', 'Frameduck', 'JKj1BBQWAkjYLdXT4zry', {})
    }

    /**
     * Execute statement
     */
    public exec() {
        this.logStatement();

        // TODO: call statement

        this.closeConnection();
    }

    /**
     * Log statement
     */
    private logStatement() {
        throw new Error('Method not implemented.');
    }

    /**
     * Closes the connestion
     */
    private closeConnection() {
        this.connection.close();
    }
}
