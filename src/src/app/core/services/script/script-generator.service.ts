import { Injectable } from "@angular/core";
import { ScriptScope } from "../../common/scripts/script-scope";
import { ScriptType } from "../../common/scripts/script-type";
import { ScriptTypeHelper } from "../../common/scripts/script-type-helper";
import { ProjectService } from "../project/project.service";
import { APP_CONFIG } from "../../../../environments/environment";
import { ElectronService } from "../electron/electron.service";
import { ScriptRunnerService } from "./script-runner.service";
import { Command } from "../../common/scripts/command";

/**
 * Genetares scripts based by some folder structure
 */
@Injectable({
    providedIn: 'root'
})
export class ScriptGeneratorService {

    constructor(private electronService: ElectronService, private projectService: ProjectService, private scriptTypeHelper: ScriptTypeHelper, private scriptRunnerService: ScriptRunnerService) { }

    /**
     * Genetates physicaly script on the disk
     * @param fileName Script name
     * @param scope Script scope (global or item)
     * @param type Script type (language)
     */
    public async generate(fileName: string, scope: ScriptScope, type: ScriptType, hasData: boolean): Promise<void> {
        // validation
        await this.validate(fileName, scope, type);

        // prepare file path
        let path = scope != ScriptScope.Module ? await this.getPathAndFixName(fileName, scope, type) : fileName;

        // add command to json
        await this.projectService.addCommand(fileName, path, scope, hasData);

        // MODULE
        if (scope == ScriptScope.Module) {
            // open file in associated program
            this.projectService.save(null).then(() => {
                this.projectService.load(null);
            })
        }

        // OTHERS
        else {

            // create file
            path = this.electronService.path.resolve(this.projectService.appPath, path);
            let content = await this.scriptRunnerService.ScriptTemplate(path);

            // FILE
            await this.writeFile(path, content);
            await this.projectService.save(null);
            await this.projectService.load(null);
            // open file in associated program
            this.openFile(path);
        }

    }

    /**
     * Gets default script type
     * @returns Default project script type
     */
    public get defaultType(): ScriptType {
        return this.scriptTypeHelper.parse(ScriptType[APP_CONFIG.defaultScriptType
        ]);
    }

    public get scriptTypes(): ScriptType[] {
        return this.scriptTypeHelper.scriptTypes;
    }

    /**
     * Validates input for new command/module creation
     * @param name path to file
     * @param scope global/item
     * @param type 
     * @returns 
     */
    public async validate(name: string, scope: ScriptScope, type: ScriptType): Promise<boolean> {

        if (name == null || name.length == 0)
            throw new Error("Missing script name");

        if (this.electronService.fs.existsSync(name))
            throw new Error("file exists " + name);

        return true;
    }
    /**
     * Removes script from  json and disk
     * @param command command
     */
    public async delete(command: Command, scope: ScriptScope): Promise<void> {

        // remove command from json
        await this.projectService.deleteCommand(command, scope);

        if (scope != ScriptScope.Module) {
            // remove file
            let path = this.electronService.path.resolve(this.projectService.appPath, command.Path);
            this.electronService.fs.rmSync(path, { recursive: true });
            await this.projectService.save(null);
            await this.projectService.load(null);
        }
        else {
            // reload project
            await this.projectService.save(null);
            await this.projectService.load(null);
        }

    }

    /**
     * Renames file on the disk and in json
     * @param name new file name
     * @param key action
     * @param command command
     */
    public async rename(name: string, command: Command, scope: ScriptScope): Promise<void> {

        // file name
        let path = this.electronService.path.parse(this.electronService.path.resolve(this.projectService.appPath, command.Path));
        let oldPath = path.base;
        let newPath = this.electronService.path.resolve(path.dir, name);

        // rename json
        await this.projectService.renameCommand(name, command, scope);

        // rename file
        await this.electronService.fs.rename(oldPath, newPath);
        await this.projectService.save(null);
        await this.projectService.load(null);

    }

    /**
     * Opens command file in OS associated app
     * @param key action
     * @param command command
     */
    public async edit(command: Command): Promise<void> {
        let path = this.electronService.path.resolve(this.projectService.appPath, command.Path);
        this.openFile(path);
    }

    /**
     * Generate full file path
     * @param fileName Script Name
     * @param scope Script scope
     * @param type Script type
     */
    private async getPathAndFixName(fileName: string, scope: ScriptScope, type: ScriptType): Promise<string> {

        let pathFixed = "";

        // SCOPE
        // global
        if (scope == ScriptScope.Global) {
            pathFixed += `Scripts/Global/Commands`;
        }
        // item // row // import
        else if (scope == ScriptScope.Item || scope == ScriptScope.Import) {
            pathFixed += `Scripts/${this.projectService.selectedModule}`;
        }
        // unsuported
        else {
            throw new Error(`Unsuported scope ` + scope);
        }

        let file = this.electronService.path.parse(fileName);

        // NAME
        fileName = scope == ScriptScope.Import ?

            // import script - name is ignored
            `Import${this.projectService.selectedModule}.${type.toString()}`

            // regular row script
            : `${file.name.replace("-", "_").replace(/\s/g, '')}.${type.toString()}`;

        // finaly connect whole path 
        pathFixed = `${pathFixed}/${fileName}`;

        return pathFixed;
    }

    /**
     * Creates script file on disk
     * @param filePath path to file
     * @param data content
     * @param callback callback after finished
     */
    private async writeFile(filePath, data) {
        try {
            let file = this.electronService.path.parse(filePath);

            // creating DIR
            await this.electronService.fs.promises.mkdir(file.dir,
                {
                    recursive: true
                }).catch((err) => console.log(err));

            // GENERATING FILE
            console.log("Generating file: " + filePath)
            this.electronService.fs.writeFileSync(filePath, data);
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Opens file in associated program
     * @param path path to file
     */
    private async openFile(path: string) {
        console.log('Openning file: ' + path);

        let task = this.electronService.isMac ?
            this.electronService.childProcess.exec(`open ${path}`)
            : this.electronService.childProcess.exec(`start ${path}`);

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
    }
}