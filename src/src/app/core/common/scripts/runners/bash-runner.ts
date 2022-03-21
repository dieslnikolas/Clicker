import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { Command } from "../command";
import { IScriptRunner } from "../script-runner.interface";
import { ElectronService } from "../../../services/electron/electron.service";
import { ChildProcessWithoutNullStreams } from "node:child_process";
import { ProjectService } from "../../../services/project/project.service";

@Injectable({
    'providedIn': CoreModule
})
export class BashRunner implements IScriptRunner {

    constructor(private electronService: ElectronService, private projectService: ProjectService) {}

    Init(): ChildProcessWithoutNullStreams {
        return this.Run("Initialize", this.projectService.initCommand);
    }

    Run(action: string, item: Command) : ChildProcessWithoutNullStreams {
        
        // Windows fix
        let path = item.Path.replace("C:", "/mnt/c").replace(/\\/g,"/");
        
        return this.electronService.childProcess.spawn("bash", [`-c`, `"${path}"`], {
            cwd: this.projectService.appPath
          });
    }
}