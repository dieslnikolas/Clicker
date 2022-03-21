import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { ChildProcessWithoutNullStreams } from "node:child_process";
import { ElectronService } from "../../../services/electron/electron.service";
import { ProjectService } from "../../../services/project/project.service";
import { Command } from "../command";
import { IScriptRunner } from "../script-runner.interface";

@Injectable({
    'providedIn': CoreModule
})
export class PythonRunner implements IScriptRunner {

    constructor(private electronService: ElectronService, private projectService: ProjectService) {}

    Init(): ChildProcessWithoutNullStreams {
        return this.Run("Initialize", this.projectService.initCommand);
    }
    
    Run(action: string, item: Command): ChildProcessWithoutNullStreams{
        return this.electronService.childProcess.spawn("python3", [item.Path], {
            cwd: this.projectService.appPath
          });
    }

}