/**
 * Represents one line of log
 */
export class Log {
    datetime: any;
    message: string;
    logSeverity: LogSeverity;
    log4jsOutput: string;
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