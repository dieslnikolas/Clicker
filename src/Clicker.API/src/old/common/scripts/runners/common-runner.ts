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
export class CommonRunner implements IScriptRunner {

    constructor(private electronService: ElectronService, private projectService: ProjectService) { }

    async ScriptTemplate(path: string): Promise<string> {
        throw new Error('Common runner cant create scripts!'); 
    }

    async CanRunOrHowTo(path: string): Promise<string> {
        return '';
    }

    async Run(command: string): Promise<ChildProcessWithoutNullStreams> {
        return this.electronService.childProcess.exec(command, {
            cwd: this.projectService.appPath
        });
    }
}