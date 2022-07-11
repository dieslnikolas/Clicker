// import { Injectable } from "@angular/core";
// import { ScriptScope } from "../../common/scripts/script-scope";
// import { ScriptType } from "../../common/scripts/script-type";
// import { ScriptTypeHelper } from "../../common/scripts/script-type-helper";
// import { ProjectService } from "../project/project.service";
// import { APP_CONFIG } from "../../../../environments/environment";
// import { ElectronService } from "../electron/electron.service";
// import { ScriptRunnerService } from "./script-runner.service";
// import { Command } from "../../common/scripts/command";
// import { LogService } from "../logger/log.service";

// /**
//  * Genetares scripts based by some folder structure
//  */
// @Injectable({
//     providedIn: 'root'
// })
// export class ScriptGeneratorService {

//     /**
//      * ImportScriptName is preserved
//      */
//     ImportScriptName(type: ScriptType): string {
//         return `Import${this.projectService.selectedModule}`;
//     }

//     constructor(private logService: LogService, private electronService: ElectronService, private projectService: ProjectService, private scriptTypeHelper: ScriptTypeHelper, private scriptRunnerService: ScriptRunnerService) { }

//     /**
//      * Genetates physicaly script on the disk
//      * @param fileName Script name
//      * @param scope Script scope (global or item)
//      * @param type Script type (language)
//      */
//     public async generate(fileName: string, scope: ScriptScope, type: ScriptType, hasData: boolean): Promise<void> {

//         try {

//             if (scope == ScriptScope.Import)
//                 fileName = this.ImportScriptName(type);

//             // validation
//             await this.validate(fileName, scope, type);

//             // prepare file path
//             let path = scope != ScriptScope.Module ? await this.getPathAndFixName(fileName, scope, type) : fileName;

//             // add command to json
//             await this.projectService.addCommand(fileName, path, scope, hasData);

//             // MODULE
//             if (scope == ScriptScope.Module) {
//                 // open file in associated program
//                 await this.projectService.save(null);
//                 await this.projectService.load(null);
//             }

//             // OTHERS
//             else {

//                 // create file
//                 path = this.electronService.path.resolve(this.projectService.appPath, path);
//                 let content = await this.scriptRunnerService.ScriptTemplate(path);

//                 // FILE
//                 await this.writeFile(path, content);
//                 await this.projectService.save(null);
//                 await this.projectService.load(null);
//                 // open file in associated program
//                 this.openFile(path);
//             }
//         }
//         catch (error) {
//             this.logService.error(error);
//         }

//     }

//     /**
//      * Gets default script type
//      * @returns Default project script type
//      */
//     public get defaultType(): ScriptType {
//         return this.scriptTypeHelper.parse(ScriptType[APP_CONFIG.defaultScriptType
//         ]);
//     }

//     public get scriptTypes(): ScriptType[] {
//         return this.scriptTypeHelper.scriptTypes;
//     }

//     /**
//      * Validates input for new command/module creation
//      * @param name path to file
//      * @param scope global/item
//      * @param type 
//      * @returns 
//      */
//     public async validate(name: string, scope: ScriptScope, type: ScriptType): Promise<boolean> {

//         if ((name == null || name.length == 0) && scope != ScriptScope.Import)
//             throw new Error("Missing script name");

//         if (scope != ScriptScope.Import && name == this.ImportScriptName(type))
//             throw new Error("Preserved filename " + name + " use another name");

//         if (this.electronService.fs.existsSync(name))
//             throw new Error("file exists " + name);

//         return true;
//     }
//     /**
//      * Removes script from  json and disk
//      * @param command command
//      */
//     public async delete(command: Command, scope: ScriptScope): Promise<void> {

//         try {

//             // remove command from json
//             await this.projectService.deleteCommand(command, scope);

//             if (scope != ScriptScope.Module) {
//                 // remove file
//                 let path = this.electronService.path.resolve(this.projectService.appPath, command.Path);
//                 this.electronService.fs.rmSync(path, { recursive: true });
//                 await this.projectService.save(null);
//                 await this.projectService.load(null);
//             }
//             else {
//                 // reload project
//                 await this.projectService.save(null);
//                 await this.projectService.load(null);
//             }

//             this.logService.success(`Command (${command.Key}) ${command.Path} has been deleted!`)
//         }
//         catch (error) {
//             this.logService.error(error);
//         }
//     }

//     /**
//      * Renames file on the disk and in json
//      * @param name new file name
//      * @param key action
//      * @param command command
//      */
//     public async rename(name: string, command: Command, scope: ScriptScope): Promise<void> {

//         try {
//             // file name
//             let path = this.electronService.path.parse(this.electronService.path.resolve(this.projectService.appPath, command.Path));
//             let oldPath = path.base;
//             let newPath = this.electronService.path.resolve(path.dir, name);

//             // rename json
//             await this.projectService.renameCommand(name, command, scope);

//             // rename file
//             await this.electronService.fs.rename(oldPath, newPath);
//             await this.projectService.save(null);
//             await this.projectService.load(null);

//             this.logService.success(`Command (${command.Key}) ${command.Path} has been renamed to "${name}"!`)
//         }
//         catch (error) {
//             this.logService.error(error);
//         }
//     }

//     /**
//      * Opens command file in OS associated app
//      * @param key action
//      * @param command command
//      */
//     public async edit(command: Command): Promise<void> {
//         try {

//             let path = this.electronService.path.resolve(this.projectService.appPath, command.Path);
//             this.openFile(path);
//         }
//         catch (error) {
//             this.logService.error(error);
//         }
//     }

//     /**
//      * Generate full file path
//      * @param fileName Script Name
//      * @param scope Script scope
//      * @param type Script type
//      */
//     private async getPathAndFixName(fileName: string, scope: ScriptScope, type: ScriptType): Promise<string> {

//         let pathFixed = "";

//         // SCOPE
//         // global
//         if (scope == ScriptScope.Global) {
//             pathFixed += `Scripts/Global/Commands`;
//         }
//         // item // row // import
//         else if (scope == ScriptScope.Item || scope == ScriptScope.Import) {
//             pathFixed += `Scripts/${this.projectService.selectedModule}`;
//         }
//         // unsuported
//         else {
//             throw new Error(`Unsuported scope ` + scope);
//         }

//         let file = this.electronService.path.parse(fileName)
//         let fileNameFixed = `${file.name.replace("-", "_").replace(/\s/g, '')}.${type.toString()}`

//         // finaly connect whole path 
//         pathFixed = `${pathFixed}/${fileNameFixed}`;

//         return pathFixed;
//     }

//     /**
//      * Creates script file on disk
//      * @param filePath path to file
//      * @param data content
//      * @param callback callback after finished
//      */
//     private async writeFile(filePath, data) {
//         try {
//             let file = this.electronService.path.parse(filePath);

//             // creating DIR
//             await this.electronService.fs.promises.mkdir(file.dir,
//                 {
//                     recursive: true
//                 }).catch((err) => this.logService.write(err));

//             // GENERATING FILE
//             this.logService.write("Generating file: " + filePath)
//             this.electronService.fs.writeFileSync(filePath, data);
//         } catch (err) {
//             throw new Error(err);
//         }
//     }

//     /**
//      * Opens file in associated program
//      * @param path path to file
//      */
//     private async openFile(path: string) {
//         try {
//             this.logService.write('Openning file: ' + path);

//             let task = this.electronService.isMac ?
//                 this.electronService.childProcess.exec(`open ${path}`)
//                 : this.electronService.childProcess.exec(`start ${path}`);

//             task.stdout.on("data", data => {
//                 this.logService.write(`stdout: ${data}`);
//             });

//             task.stderr.on("data", data => {
//                 this.logService.write(`stderr: ${data}`);
//             });

//             task.on('error', (error) => {
//                 this.logService.write(`error: ${error.message}`);
//             });

//             task.on("close", code => {
//                 this.logService.write(`child process exited with code ${code}`);
//             });
//         }
//         catch (error) {
//             this.logService.error(error);
//         }
//     }
// }