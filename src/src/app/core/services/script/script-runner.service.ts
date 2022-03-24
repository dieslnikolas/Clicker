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

    /**
     * Determine which runner to use
     * @param scriptPath path to script
     * @returns actual runner
     */
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

    constructor(private scriptTypeHelper: ScriptTypeHelper, private electronService: ElectronService, private projectService: ProjectService,
        private powershellRunner: PowershellRunner, 
        private pythonRunner: PythonRunner,
        private bashRunner: BashRunner) {}


    /**
     * Create child process and run command
     * @param action Action name, not mandatory
     * @param item Command item, reads path from it
     * @returns returns promise with finished command
     */
    public async Run(action: string, item: Command): Promise<ChildProcessWithoutNullStreams> {

        let isRunnableCommand = await this.CanRunOrHowTo(item.Path);
        if (isRunnableCommand != null) {
            return;
        }

        // tune path to file (relative from project folder)
        item.Path = this.electronService.path.resolve(this.projectService.appPath, item.Path);

        if (!this.electronService.fs.existsSync(item.Path))
            throw new Error("File doesn't exists: " + item.Path);

        let runner = this.getCurrentRunner(item.Path);
        let task = await runner.Run(action, item);

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
     * Initialize (some global collection of functions or scripts)
     * @returns Initialize data
     */
     async Init(): Promise<ChildProcessWithoutNullStreams> {

        let item = this.projectService.initCommand;
       return await this.Run("Initialize", item);
    }

    /**
     * Creates template for a script
     * @param path path to file suppose to be (for runner check)
     * @returns return script template
     */
    async ScriptTemplate(path: string) : Promise<string> {
        let runner = await this.getCurrentRunner(path);
        let content = await runner.ScriptTemplate(path);
        return content;
    }

    /**
     * You DONT need to run this command (it runs automaticalyly before await run(..))
     * @param path path to file
     * @returns if script is runnable NULL if not then command how to install
     */
    async CanRunOrHowTo(path: string): Promise<string> {
        let runner = this.getCurrentRunner(path);
        return runner.CanRunOrHowTo(path);
    }
}