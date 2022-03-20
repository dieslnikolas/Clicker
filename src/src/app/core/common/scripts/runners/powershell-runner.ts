import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { Command } from "../command";
import { IScriptRunner } from "../script-runner.interface";
import { ElectronService } from "../../../services/electron/electron.service";
import { ChildProcessWithoutNullStreams } from "node:child_process";

@Injectable({
    'providedIn': CoreModule
})
export class PowershellRunner implements IScriptRunner {

    constructor(private electronService: ElectronService) {
    }

    Run(action: string, item: Command) : ChildProcessWithoutNullStreams {
        return this.electronService.childProcess.spawn("pwsh", [item.Path]);
    }

}