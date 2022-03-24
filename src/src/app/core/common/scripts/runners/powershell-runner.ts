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

    private commnad: string = `pwsh`;

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

    async Run(action: string, item: Command): Promise<any> {
        
        // ADS CONTEXT IF ITS NESESARY
        let context = "";
        if (item.IsContext) {
            let path = await this.projectService.saveTmp();
            context = `Get-Content "${path}" | `
        }

        return this.electronService.childProcess.spawn(this.commnad, [`-Command`, `${this.projectService.initCommand.Path} && ${context}${item.Path}`], {
            cwd: this.projectService.appPath
        });

    }

    async CanRunOrHowTo(path: string): Promise<string> {
        // MIN powershell VERSION 7.2.1 >> dotnet tool install --global PowerShell
        return "";
    }
}