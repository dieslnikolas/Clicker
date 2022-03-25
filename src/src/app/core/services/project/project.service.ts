import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { APP_CONFIG } from "../../../../environments/environment";
import { Command } from "../../common/scripts/command";
import { ScriptScope } from "../../common/scripts/script-scope";
import { ScriptType } from "../../common/scripts/script-type";
import { ElectronService } from "../electron/electron.service";
import { ProjectModel } from "./project.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    /**
     * Module selection changed (notify all modules who depends on selected module)
     */
    public moduleChanged: Subject<string> = new Subject<string>();

    /**
     * Usable for knowing that proj file is loaded
     */
    public projectLoaded: Subject<void> = new Subject<void>();

    public appPath: string;
    private appPathFull: string;

    private _selectedModule: string;

    /**
     * Current module
     */
    public get selectedModule(): string {
        return this._selectedModule;
    }
    public set selectedModule(v: string) {
        this._selectedModule = v;
        this.moduleChanged.next(this._selectedModule);
    }


    private _projectModel: ProjectModel;
    /**
     * Settings getter
     */
    public get projectModel(): ProjectModel {
        if (this._projectModel == null) {
            this._projectModel = new ProjectModel();
        }

        return this._projectModel;
    }

    setProcessedItem(item: Command) {
        this.projectModel.ProcessItem = item;
    }

    processedItemClear() {
        this._projectModel.ProcessItem = null
    }

    /**
     * Return all global commands
     */
    get commands() {
        // deleting modules
        let commands = this.getProjectCopy({ ...this.projectModel.Scripts });
        delete commands.Modules; // Item right-click events
        delete commands.InitializeScript; // PREDEFINED SCRIPT FOR INIT APP

        return commands;
    }

    get initCommand(): Command {
        return this.projectModel["Scripts"]["InitializeScript"];
    }

    /**
     * Returns all modules
     */
    get modules() {
        return this.getProjectCopy(this.projectModel.Scripts.Modules);
    }

    get modulesCount() {
        return Object.keys(this.modules).length;
    }

    /**
    * Returns all commands for module
    */
    get moduleCommands() {
        let commands = this.getProjectCopy({ ...this.projectModel.Scripts.Modules });

        // PREDEFINED SCRIPT FOR IMPORTING DATA
        delete commands[this.selectedModule]["Import" + this.selectedModule];

        return commands[this.selectedModule];
    }

    /**
     * Returns command for import
     */
    get moduleImport() {
        if (this.selectedModule == null) return null;

        let commands = this.getProjectCopy({ ...this.projectModel.Scripts.Modules });
        // PREDEFINED SCRIPT FOR IMPORT DATA
        return commands[this.selectedModule]["Import" + this.selectedModule];
    }

    get moduleColumns() {

        try {
            return Object.keys(Object.entries(this.projectModel[this.selectedModule])[0][1]);
        }
        catch (err) {
            // NO DATA
        }
        console.log();
        return [];
    }

    /**
     * Returns all data
     */
    get moduleData() {
        // data for module
        let data = Object.entries(this.projectModel[this.selectedModule]).map(item => item[1]);
        return data;
    }

    constructor(private electronService: ElectronService) {
    }

    /**
     * Load settings from file (project file)
     */
    public async load(path: string): Promise<Boolean> {

        try {
            if (path == null)
                path = this.appPathFull;

            let rawdata = this.electronService.fs.readFileSync(path, `utf-8`).trim();
            this._projectModel = JSON.parse(rawdata);

            // change root folder of the all paths (it will be relative to project)
            if (rawdata != null) {
                this.appPath = this.electronService.path.parse(path).dir;
                this.appPathFull = path;
            }

            console.log('Project loaded');
            this.projectLoaded.next();

            return true;
        }
        catch (error) {
            console.warn(error);
            return false;
        }
    }

    /**
     * Save settings to openned file
     */
    public async save(path: string): Promise<void> {

        if (path == null)
            path = this.appPathFull;

        if (this.projectModel.Metadata["ProjectName"] == null || this.projectModel.Metadata["ProjectName"].length == 0) {
            this.projectModel.Metadata["ProjectName"] = this.electronService.path.parse(path).name;
        }

        await this.electronService.fs.writeFileSync(path, JSON.stringify(this.projectModel));
        console.log('Project saved!');
    }

    /**
     * Creates json file
     * @returns Save tmp json (ready to use in scripts)
     */
    public async saveTmp(): Promise<string> {
        let path = this.electronService.path.resolve(this.appPath, "tmp.json");
        await this.electronService.fs.writeFileSync(path, JSON.stringify(this.projectModel));

        return path;
    }

    /**
     * Add command to project model
     * @param fileName file name
     * @param path path to file with filename
     * @param scope script scope or rather command type
     * @param hasData if script uses data (json from saveTmp() - it will by automatically added
     */
    public async addCommand(fileName: string, path: string, scope: ScriptScope, hasData: boolean) {

        switch (scope) {
            case ScriptScope.Global:
                this.projectModel.Scripts['Commands'] = {

                    ...this.projectModel.Scripts['Commands'],

                    [fileName]: {
                        "DisplayName": fileName,
                        "Path": path,
                        "HasData": hasData
                    },
                }
                break;

            case ScriptScope.Item:
            case ScriptScope.Import:

                // TODO correct path
                this.projectModel.Scripts['Modules'][this.selectedModule] = {

                    ...this.projectModel.Scripts['Modules'][this.selectedModule],

                    [fileName]: {
                        "DisplayName": fileName,
                        "Path": path,
                        "HasData": hasData
                    },
                }
                break;
        }
    }

    /**
     * Removes command from collection
     * @param command script key
     * @param scope scope (where to find command)
     */
    public async deleteCommand(command: Command, scope: ScriptScope) {
        let found = await this.getCommandParentInTree(command, scope);
        // console.log(found.parrent[found.key]);
        delete found.parrent[found.key];
    }

    /**
     * Rename command (path/action)
     * @param newName command script
     * @param command command script
     * @param scope scope 
     */
    public async renameCommand(newName: string, command: Command, scope: ScriptScope) {
        // let found = await this.getCommandParentInTree(scope);
        // console.log("NOT IMPLEMENTED: " + found);
        // found[command.Key]["Path"] = found[command.Key]["Path"]
    }

    /**
    * Creates copy 
    * @param objectToCopy object which will be copied
    * @returns copy of object
    */
    private getProjectCopy(objectToCopy: { [key: string]: any; }) {

        let copy: { [key: string]: any; } = ["delteme"];
        Object.assign(copy, objectToCopy);

        delete copy[0]; // deleteme

        return copy;
    }

    /**
     * Find property by value in project model
     * @param command its value
     * @param scope scope
     * @returns object where property matches value
     */
    private async getCommandParentInTree(command: Command, scope: ScriptScope) {

        let parrent = null;

        switch (scope) {

            // global
            case ScriptScope.Global:
                parrent = this.projectModel.Scripts.Commands;
                break;

            // row/item/table
            case ScriptScope.Item:
            case ScriptScope.Import:
                parrent = this.projectModel.Scripts["Modules"][this.selectedModule];
                break;

            // module
            case ScriptScope.Module:
                // parrent = this.projectModel[
                throw new Error("NOT IMPLEMENTED SOLVE IT YOURSELF B*TCH");
                break;
        }

        let key: string; 
        Object.entries(parrent).forEach(element => {
            console.log(element[1]["Path"]);
            if (element[1]["Path"] === command.Path)
                { 
                    key = element[0];
                    return;
                }
        });

        return { "parrent": parrent, "key" : key };
    }
}

