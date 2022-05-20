/**
 * Represents one line of log
 */
export class Log {
    datetime: any;
    message: string;
    logSeverity: LogSeverity;
    log4jsOutput: string;

    /**
     * Log instance factory
     * @param message debug message
     * @param logSeverity error type
     * @returns object that represents one input to the console
     */
    public static Factory(message: any, logSeverity: LogSeverity): Log {
        let log = new Log();

        // SEVERITY ADN MESSAGE
        log.logSeverity = logSeverity;
        log.message = message
        
        // ERROR CALL STACK
        if (message.stack != null) {
            log.message = `
            
            \r\nSTACK: ${message.stack}`;
        }

        // date
        const d = new Date();
        const dd = [d.getHours(), d.getMinutes(), d.getSeconds()].map((a) => (a < 10 ? '0' + a : a));
        log.datetime = dd.join(':')

        log.log4jsOutput = `${log.datetime} - ${LogSeverity[log.logSeverity]}: ${log.message}`;

        return log;
    }
}

/**
 * How severe is log info
 */
export enum LogSeverity {
    DEBUG,
    WARN,
    ERROR,
    SUCCESS
}