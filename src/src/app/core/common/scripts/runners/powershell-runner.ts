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
export class PowershellRunner implements IScriptRunner {

    constructor(private electronService: ElectronService, private projectService: ProjectService) { }

    Init(): ChildProcessWithoutNullStreams {
        return this.electronService.childProcess.spawn("pwsh", [`${this.projectService.initCommand.Path}`], {
            cwd: this.projectService.appPath
        });
    }

    Run(action: string, item: Command): any {

        // if (item.IsContext) {

            this.projectService.saveTmp();
            let path = this.electronService.path.resolve(this.projectService.appPath, "tmp.json");

            return this.electronService.childProcess.spawn(`pwsh`, [`-Command`, `${this.projectService.initCommand.Path} && Get-Content "${path}" | ConvertFrom-JsonExtend | ${item.Path}`], {
                cwd: this.projectService.appPath
            });
    }

}