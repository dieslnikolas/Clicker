// import { writeAsync } from 'fs-jetpack';
import { environment } from 'src/environments/environment';

/**
 * Static class for loging
 */
export class Log {

    /**
     * Write message
     * Is used for example to log SQL statements
     * @param message output message
     */
    public static write(message: string, exception: any = null) {

        // add time
        message = Date.UTC.toString() + " " + message;

        // write message
        if (!environment.production) {

            // log error or standard message
            if (exception != null) {
                console.error(message);
            }
            else {
                console.debug(message);
            }
        }

        // write to file
        // writeAsync(environment.pathLog, message);
    }

    /**
     * Write message to both db and file
     * Is used mainly for errors
     * @param message output message
     */
    public static writeToDB(message: string) {
        // write to wile
        this.write(message);

        // TODO: write to db
    }

}
