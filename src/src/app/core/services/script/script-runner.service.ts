import { Injectable } from "@angular/core";
import { PowershellRunner } from "../../common/scripts/runners/powershell-runner";
import { PythonRunner } from "../../common/scripts/runners/python-runner";
import { IScriptRunner } from "../../common/scripts/script-runner.interface"
import { ScriptType } from "../../common/scripts/script-type";
import { ScriptTypeHelper } from "../../common/scripts/script-type-helper";
import { ElectronService } from "../electron/electron.service";
import { Command } from "../../common/scripts/command"
import { ProjectService } from "../project/project.service";
import { BashRunner } from "../../common/scripts/runners/bash-runner";
import { ChildProcessWithoutNullStreams } from "node:child_process";

@Injectable({
    providedIn: 'root'
})
export class ScriptRunnerService implements IScriptRunner {

    constructor(private scriptTypeHelper: ScriptTypeHelper, private electronService: ElectronService, private projectService: ProjectService,
        private powershellRunner: PowershellRunner, 
        private pythonRunner: PythonRunner,
        private bashRunner: BashRunner) {}

    Run(action: string, item: Command): ChildProcessWithoutNullStreams {

        // tune path to file (relative from project folder)
        item.Path = this.electronService.path.resolve(this.projectService.appPath, item.Path);

        if (!this.electronService.fs.existsSync(item.Path))
            throw new Error("File doesn't exists: " + item.Path);

        let runner = this.getCurrentRunner(item.Path);
        let task = runner.Run(action, item);

        task.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });
        
        task.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });
        
        task.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });
        
        task.on("close", code => {
            console.log(`child process exited with code ${code}`);
        });

        return task;
    }

    /**
     * Initialize
     * @returns Initialize data
     */
    Init(): ChildProcessWithoutNullStreams {
        let item = this.projectService.initCommand;
        item.Path = this.electronService.path.resolve(this.projectService.appPath, item.Path);

        if (!this.electronService.fs.existsSync(item.Path))
            throw new Error("File doesn't exists: " + item.Path);

        this.projectService.processedItemClear();
        if (item.IsContext) {
            this.projectService.setProcessedItem(item);
        }

        let runner = this.getCurrentRunner(item.Path);
        let task = runner.Init();

        task.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });
        
        task.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });
        
        task.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });
        
        task.on("close", code => {
            console.log(`child process exited with code ${code}`);
        });

        return task;
    }

    private getCurrentRunner(scriptPath: string): IScriptRunner {

        // script type
        let type: ScriptType = this.scriptTypeHelper.GetScriptTypeByName(scriptPath);

        if (type == ScriptType.Powershell)
            return this.powershellRunner;
        if (type == ScriptType.Python)
            return this.pythonRunner;
        if (type == ScriptType.Bash)
            return this.bashRunner;
    }
}