import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { textChangeRangeIsUnchanged } from "typescript/lib/tsserverlibrary";
import { Command } from "../../common/scripts/command";
import { ScriptScope } from "../../common/scripts/script-scope";
import { ScriptType } from "../../common/scripts/script-type";
import { ElectronService } from "../electron/electron.service";
import { ProjectModel } from "./project.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    moduleChanged: Subject<string> = new Subject<string>();

    public appPath: string;
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
     * Load settings from file (project file)
     */
    public async load(path: string): Promise<Boolean> {

        try {
            let rawdata = this.electronService.fs.readFileSync(path, `utf-8`).trim();
            this._projectModel = JSON.parse(rawdata);

            // change root folder of the all paths (it will be relative to project)
            if (rawdata != null)
                this.appPath = this.electronService.path.parse(path).dir;

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

        if (this.projectModel.Metadata["ProjectName"] == null || this.projectModel.Metadata["ProjectName"].length == 0) {
            this.projectModel.Metadata["ProjectName"] = this.electronService.path.parse(path).name;
        }

        await this.electronService.fs.writeFileSync(path, JSON.stringify(this.projectModel));
    }

    public async saveTmp(): Promise<string> {
        let path = this.electronService.path.resolve(this.appPath, "tmp.json");
        await this.electronService.fs.writeFileSync(path, JSON.stringify(this.projectModel));

        return path;
    }

    public addCommand(fileName: string, path: string, scope: ScriptScope, hasData: boolean) {

        switch (scope) {
            case ScriptScope.Global:
                this.projectModel.Scripts['Commands'] = {
                    
                    ...this.projectModel.Scripts['Commands'], 

                    [fileName] : {
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
                    
                    ...this.projectModel.Scripts['Modules'], 

                    [fileName] : {
                        "DisplayName": fileName,
                        "Path": path,
                        "HasData": hasData
                    },
                }
                break;
        }

        console.log(this.projectModel.Scripts);
        console.log(this.projectModel);
    }
}

