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

    constructor(private electronService: ElectronService, private projectService: ProjectService) { }

     async ScriptTemplate(path: string): Promise<string> {
        return `
// file sits in ${path}
// data are accessible via:
//
//    param (
//        [Parameter(ValueFromPipeline = $true)]$data = $null
//    )
//    echo $data
        `;
    }

    CanRunOrHowTo(path: string): Promise<string> {
        // is python3 is installed
        return null;
    }

    async Run(action: string, item: Command): Promise<ChildProcessWithoutNullStreams> {
        return this.electronService.childProcess.spawn("python3", [item.Path], {
            cwd: this.projectService.appPath
        });
    }

}