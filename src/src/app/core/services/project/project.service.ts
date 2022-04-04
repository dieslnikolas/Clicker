import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { APP_CONFIG } from "../../../../environments/environment";
import { Command } from "../../common/scripts/command";
import { ScriptScope } from "../../common/scripts/script-scope";
import { ElectronService } from "../electron/electron.service";
import { LogService } from "../logger/log.service";
import { ScriptRunnerService } from "../script/script-runner.service";
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
    public projectLoading: Subject<string> = new Subject<string>();

    /**
     * Usable for knowing that proj file is loaded
     */
    public projectLoaded: Subject<void> = new Subject<void>();

    public appPath: string;
    private appPathFull: string;

    private _selectedModule: string;

    /**
     * Settings of the app
     */
    public get settings(): { [key: string]: any; } {
        return this._projectModel["Metadata"];
    }
    public set settings(v: { [key: string]: any; }) {
        this._projectModel.Metadata = v;
    }

    /**
     * Current module
     */
    public get selectedModule(): string {
        return this._selectedModule;
    }
    public set selectedModule(v: string) {
        this._selectedModule = v;
        this.logService.success(`Current module "${v}"`);
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

    public get isUnsaved(): boolean {
        return this.appPathFull == null;
    }

    public get projectNameFull(): string {
        if (this.isUnsaved)
            return `Clicker`;
        return `Clicker - ${this.appPathFull}`;
    }

    public get projectName(): string {
        if (this.isUnsaved)
            return null;
        return this.electronService.path.parse(this.appPathFull).name;
    }

    /**
     * Sets item from module
     * @param item Processed item
     */
    public setProcessedItem(item: Command) {
        this.projectModel.ProcessItem = { [item?.Key]: item?.ProcessItem };
    }

    /**
     * Clears the pricess item 
     */
    public processedItemClear() {
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

        if (this.selectedModule == null)
            return null;

        let commands = this.getProjectCopy({ ...this._projectModel.Scripts.Modules });

        // PREDEFINED SCRIPT FOR IMPORTING DATA
        // delete commands[this.selectedModule]["Import" + this.selectedModule];
        return commands[this.selectedModule];
    }

    /**
     * Returns command for import
     */
    get moduleImport() {
        if (this.selectedModule == null) return null;

        // PREDEFINED SCRIPT FOR IMPORT DATA
        return this._projectModel.Scripts.Modules[this.selectedModule][`Import${this.selectedModule}`];
    }

    get moduleColumns() {

        try {
            // brutal check :facepalm:
            if (this.moduleData == null) return null;
            return Object.keys(Object.entries(this.moduleData)[0][1]);
        }
        catch (err) {
            // NO DATA
            this.logService.error(err);
        }

        return [];
    }

    /**
     * Returns all data
     */
    get moduleData() {
        // data for module
        if (this.selectedModule == null) return null;
        if (Object.entries(this.projectModel[this.selectedModule]).length == 0) return null;

        let data = Object.entries(this.projectModel[this.selectedModule]).map(item => item[1]);
        return data;
    }

    constructor(private logService: LogService, private electronService: ElectronService, private dialog: MatDialog) {
    }

    /**
     * Load settings from file (project file)
     */
    public async load(path: string, forceOpenNew: boolean = false): Promise<Boolean> {

        try {
            this.projectLoading.next(null);

            // use default path
            if (path == null)
                path = this.appPathFull;

            // if path is still null, then it is not saved at all
            if (path == null || forceOpenNew) {
                let dialogResul = await this.electronService.remote.dialog.showOpenDialog(
                    {
                        filters: [
                            { name: 'Powergene', extensions: ['pwgen'] },
                            { name: 'Clicker', extensions: ['clicker'] },
                            { name: 'All Files', extensions: ['*'] }
                        ]
                    });

                path = dialogResul.filePaths[0] ?? this.appPathFull;
            }

            this.projectLoading.next(path);
            let rawdata = this.electronService.fs.readFileSync(path, `utf-8`).trim();
            this._projectModel = JSON.parse(rawdata);

            // change root folder of the all paths (it will be relative to project)
            if (rawdata != null) {
                this.appPath = this.electronService.path.parse(path).dir;
                this.appPathFull = path;
                localStorage.setItem("last_project", this.appPathFull);
            }

            this.logService.success('Project loaded');
            let firstModule = Object.keys(this.modules).sort()[0];
            this.selectedModule = firstModule;
            this.projectLoaded.next();

            return true;
        }
        catch (error) {
            this.logService.write(error);

            // something went
            this._projectModel = new ProjectModel();
            this.projectLoaded.next();

            return false;
        }
    }

    /**
     * Save settings to openned file
     */
    public async save(path: string, forceSaveAs: boolean = false): Promise<void> {

        let isUnsaved = this.isUnsaved; // preload, because it will be changed in the end

        // if save without path use project path
        if (path == null)
            path = this.appPathFull;

        // if path is still null, then it is not saved at all
        if (path == null || forceSaveAs) {
            path = this.electronService.remote.dialog.showSaveDialogSync(
                {
                    filters: [
                        { name: 'Powergene', extensions: ['pwgen'] },
                        { name: 'Clicker', extensions: ['clicker'] },
                        { name: 'All Files', extensions: ['*'] }
                    ]
                });
        }

        // main data
        // project name from file
        if (this.projectModel.Metadata["ProjectName"] == null || this.projectModel.Metadata["ProjectName"].length == 0) {
            this.projectModel.Metadata["ProjectName"] = this.electronService.path.parse(path).name;
        }

        // file path
        this.appPathFull = path;
        localStorage.setItem("last_project", this.appPathFull);
        this.appPath = this.electronService.path.parse(path).dir;

        let fromFolder =
            APP_CONFIG.production ?
                // devel
                this.electronService.path.resolve(this.electronService.remote.app.getAppPath(), "assets/scripts_default")
                // prduction
                : this.electronService.path.resolve(this.electronService.remote.app.getAppPath(), "src/assets/scripts_default");

        let toFolder = this.electronService.path.resolve(this.appPath, "Scripts");
        this.logService.warn(`From:${fromFolder} -> To:${toFolder}`);

        // creating DIR
        let file = this.electronService.path.parse(path);
        await this.electronService.fs.promises.mkdir(file.dir,
            {
                recursive: true
            }).catch((err) => this.logService.error(err));

        // copy init files
        try {

            // save project file
            await this.electronService.fs.writeFileSync(path, JSON.stringify(this.projectModel))

            if (isUnsaved)
                this.electronService.fs.copyFileSync(fromFolder, toFolder);

            this.logService.success('Project saved!');
        }
        catch (error) {
            this.logService.warn(`${error}`);
        }


    }

    /**
     * Creates json file
     * @returns Save tmp json (ready to use in scripts)
     */
    public async saveTmp(): Promise<string> {
        let path = this.electronService.path.resolve(this.electronService.remote.app.getPath('temp'), 'Clicker', "tmp.json");
        this.logService.warn(`Saving temp file: ${path}`);

        // creating DIR
        let file = this.electronService.path.parse(path);
        await this.electronService.fs.promises.mkdir(file.dir,
            {
                recursive: true
            }).catch((err) => this.logService.write(err));

        this.electronService.fs.writeFileSync(path, JSON.stringify(this.projectModel));

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

            // GLOBAL SCRIPTS
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

            // ROW//ITEM/TALBE
            case ScriptScope.Item:
            case ScriptScope.Import:

                this.projectModel.Scripts['Modules'][this.selectedModule] = {

                    ...this.projectModel.Scripts['Modules'][this.selectedModule],

                    [fileName]: {
                        "DisplayName": fileName,
                        "Path": path,
                        "HasData": hasData
                    },
                }
                break;

            // MODULES
            case ScriptScope.Module:

                // script section
                this.projectModel.Scripts['Modules'] = {

                    ...this.projectModel.Scripts['Modules'],
                    [fileName]: {},
                }

                // data section
                this._projectModel = {

                    ...this.projectModel,
                    [fileName]: {},
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

        if (scope == ScriptScope.Module) {
            // script section
            delete this.projectModel.Scripts['Modules'][command.Path];
            delete this._projectModel[command.Path];
        }
        else {
            let found = await this.getCommandParentInTree(command, scope);
            // this.logService.write(found.parrent[found.key]);
            delete found.parrent[found.key];
        }
    }

    /**
     * Rename command (path/action)
     * @param newName command script
     * @param command command script
     * @param scope scope 
     */
    public async renameCommand(newName: string, command: Command, scope: ScriptScope) {
        // let found = await this.getCommandParentInTree(scope);
        // this.logService.write("NOT IMPLEMENTED: " + found);
        // found[command.Key]["Path"] = found[command.Key]["Path"]
    }

    public async openSettings() {
        throw new Error("Depreceated method");

        let path = await this.saveTmp();
        this.openFile(path);
    }

    public async openTempFolder() {

        await this.saveTmp();
        let path = this.electronService.path.resolve(this.electronService.remote.app.getPath('temp'), 'Clicker');
        this.logService.warn(`Openning temp folder ${path}`);
        this.electronService.remote.shell.openPath(path);
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
            if (element[1]["Path"] === command.Path) {
                key = element[0];
                return;
            }
        });

        return { "parrent": parrent, "key": key };
    }

    /**
    * Opens file in associated program
    * @param path path to file
    */
    private async openFile(path: string) {
        this.logService.write('Openning file: ' + path);

        let task = this.electronService.isMac ?
            this.electronService.childProcess.exec(`open ${path}`)
            : this.electronService.childProcess.exec(`start ${path}`);

        ScriptRunnerService.handleTask(task, true, this.logService);

    }
}

