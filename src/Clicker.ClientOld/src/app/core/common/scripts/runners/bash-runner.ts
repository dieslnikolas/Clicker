import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { Command } from "../command";
import { IScriptRunner } from "../script-runner.interface";
import { ElectronService } from "../../../services/electron/electron.service";
// import { ChildProcessWithoutNullStreams } from "node:child_process";
import { ProjectService } from "../../../services/project/project.service";

@Injectable({
    'providedIn': CoreModule
})
export class BashRunner implements IScriptRunner {

    constructor(private electronService: ElectronService, private projectService: ProjectService) { }

    async ScriptTemplate(path: string): Promise<string> {
        return `# file sits in ${path}
# data are accessible via:
#
#    param (
#        [Parameter(ValueFromPipeline = $true)]$data = $null
#    )
#    echo $data
        `
    }
    async CanRunOrHowTo(path: string): Promise<string> {
        // check if bash installed? WTF
        return null;
    }

    async Run(action: string, item: Command): Promise<any> {
    //Promise<ChildProcessWithoutNullStreams> {

        let path = item.Path;

        // Windows fix (WSL support)
        if (this.electronService.isWindows) {
            path = item.Path.replace("C:", "/mnt/c").replace(`///`, "/");
            
            return this.electronService.childProcess.spawn("bash", [`-c`, `"${path}"`], {
                cwd: this.projectService.appPath
            });
        }

        // UNIX
        else {
            return this.electronService.childProcess.spawn("bash", [`-c`, `"${path}"`], {
                cwd: this.projectService.appPath
            });
        }
    }
}