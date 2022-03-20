import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { ChildProcessWithoutNullStreams } from "node:child_process";
import { ElectronService } from "../../../services/electron/electron.service";
import { Command } from "../command";
import { IScriptRunner } from "../script-runner.interface";

@Injectable({
    'providedIn': CoreModule
})
export class PythonRunner implements IScriptRunner {

    constructor(private electronService: ElectronService) { }

    Run(action: string, item: Command): ChildProcessWithoutNullStreams{
        return this.electronService.childProcess.spawn("python3", [item.Path]);
    }

}