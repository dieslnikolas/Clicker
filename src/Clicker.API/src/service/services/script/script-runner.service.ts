// import { Injectable } from "@angular/core";
// import { PowershellRunner } from "../../common/scripts/runners/powershell-runner";
// import { PythonRunner } from "../../common/scripts/runners/python-runner";
// import { IScriptRunner } from "../../common/scripts/script-runner.interface"
// import { ScriptType } from "../../common/scripts/script-type";
// import { ScriptTypeHelper } from "../../common/scripts/script-type-helper";
// import { ElectronService } from "../electron/electron.service";
// import { Command } from "../../common/scripts/command"
// import { ProjectService } from "../project/project.service";
// import { BashRunner } from "../../common/scripts/runners/bash-runner";
// import { ChildProcessWithoutNullStreams } from "node:child_process";
// import { MatSnackBar } from "@angular/material/snack-bar";
// import { LogService } from "../logger/log.service";
// import { CommonRunner } from "../../common/scripts/runners/common-runner";
// import { Subject } from "rxjs";
// import  * as iconvlite from 'iconv-lite'

// @Injectable({
//     providedIn: 'root'
// })
// export class ScriptRunnerService implements IScriptRunner {

//     /**
//      * Determine which runner to use
//      * @param scriptPath path to script
//      * @returns actual runner
//      */
//     private getCurrentRunner(scriptPath: string): IScriptRunner {

//         // script type
//         let type: ScriptType = this.scriptTypeHelper.GetScriptTypeByName(scriptPath);

//         if (type == ScriptType.Powershell)
//             return this.powershellRunner;
//         if (type == ScriptType.Python)
//             return this.pythonRunner;
//         if (type == ScriptType.Bash)
//             return this.bashRunner;
//     }

//     constructor(private logService: LogService, private scriptTypeHelper: ScriptTypeHelper, private _snackBar: MatSnackBar, private electronService: ElectronService, private projectService: ProjectService,
//         private powershellRunner: PowershellRunner,
//         private pythonRunner: PythonRunner,
//         private bashRunner: BashRunner,
//         private commonRunner: CommonRunner) { }


//     /**
//      * Create child process and run command
//      * @param action Action name, not mandatory
//      * @param item Command item, reads path from it
//      * @returns returns promise with finished command
//      */
//     public async Run(action: string, item: Command, supressSnack: boolean = false): Promise<ChildProcessWithoutNullStreams> {

//         try {
//             this.projectService.processedItemClear();
//             this.projectService.setProcessedItem(item);

//             let isRunnableCommand = await this.CanRunOrHowTo(item.Path);
//             if (isRunnableCommand != null) {
//                 return;
//             }

//             // tune path to file (relative from project folder)
//             let pathResolved = this.electronService.path.resolve(this.projectService.appPath, item.Path);

//             if (!this.electronService.fs.existsSync(pathResolved))
//                 throw new Error("File doesn't exists: " + pathResolved);

//             let runner = this.getCurrentRunner(pathResolved);
//             let task = await runner.Run(action, item);
//             ScriptRunnerService.handleTask(item, task, supressSnack, this.logService);
//             return task;
//         }
//         catch (error) {
//             this.logService.error(error);
//             return null;
//         }
//     }

//     async RunCMD(command: string): Promise<ChildProcessWithoutNullStreams> {
//         try {
//             let runner = this.commonRunner;
//             let commandObj = new Command();

//             commandObj.Path = command;
//             commandObj.HasData = true;

//             let task = await runner.Run(command);
//             ScriptRunnerService.handleTask(commandObj, task, true, this.logService);
//             return task;
//         }
//         catch (error) {
//             this.logService.error(error);
//             return null;
//         }
//     }

//     /**
//      * Initialize (some global collection of functions or scripts)
//      * @returns Initialize data
//      */
//     async Init(): Promise<ChildProcessWithoutNullStreams> {

//         // try to find command
//         let item = this.projectService.initCommand;

//         // if there is no init (typicialy on empty proj)
//         if (item == null)
//             return null;

//         // run init script
//         return await this.Run("Initialize", item, true);
//     }

//     /**
//      * Creates template for a script
//      * @param path path to file suppose to be (for runner check)
//      * @returns return script template
//      */
//     async ScriptTemplate(path: string): Promise<string> {
//         let runner = await this.getCurrentRunner(path);
//         let content = await runner.ScriptTemplate(path);
//         return content;
//     }

//     /**
//      * You DONT need to run this command (it runs automaticalyly before await run(..))
//      * @param path path to file
//      * @returns if script is runnable NULL if not then command how to install
//      */
//     async CanRunOrHowTo(path: string): Promise<string> {
//         let runner = this.getCurrentRunner(path);
//         return runner.CanRunOrHowTo(path);
//     }


//     /**
//      * Sends snack bar message
//      * @param message Message to snack bar info
//      */
//     private async openSnackBar(message: string) {
//         this._snackBar.open(message, 'Dismiss', {
//             duration: 3000
//         });
//     }

//     /**
//      * Result of the command
//      * @param task task from child_processs
//      * @param suppressSnack if show snack
//      */
//     public static handleTask(command: Command, task: ChildProcessWithoutNullStreams, suppressSnack: boolean, logService: LogService) {
        
//         // Start task
//         logService.success(`Running command: ${command.Path} (Key: ${command.Key ?? "NO_KEY" })`)
//         // logService.success(task.spawnargs.join(""))
        
//         task.stdout.on("data", data => {
//             // if (!suppressSnack)
//             //     this.openSnackBar("OK");

//             // DATA
//             logService.write(`${data}`);
//         });

//         task.stderr.on("data", data => {
//             // if (!suppressSnack)
//             //     this.openSnackBar("Error");

//             logService.error(`${data}`);
//         });

//         task.on('error', (error) => {
//             // if (!suppressSnack)
//             //     this.openSnackBar("Error");

//             logService.error(`${error.message}`);
//         });

//         task.on("close", code => {

//             if (code == 0 && !suppressSnack)
//                 logService.success(`child process exited with code ${code}`);

//             else if (!suppressSnack)
//                 logService.error(`Some error's occured`);
            
//         });
//     }

//     private iconvDecode(str = '') {

//         // const encoding = 'cp936';
//         // const binaryEncoding = 'binary';

//         // return iconv.decode(Buffer.from(str, binaryEncoding), encoding);
//     }
// }