import { Injectable } from '@angular/core';

// Services
import { SSH } from "../common/ssh";
import { Log } from "../common/log";

@Injectable()
export class BaseService {

    protected _ssh: SSH;
    protected _log: Log;

    constructor(ssh: SSH, log: Log) {
        this._ssh = ssh;
        this._log = log;
    }
    
}
