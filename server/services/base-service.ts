import { ipcMain } from 'electron'
import * as path from 'path'
import { IService } from 'electron/common'

export class BaseService {

    private action: string;

    private get IpcPath {
        return path.join(this.constructor.name, this.action);
    }

    constructor(action: string) {
        this.action = action;
    }
}
