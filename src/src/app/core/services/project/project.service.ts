import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { ElectronService } from "../electron/electron.service";

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


    private _settings: any;
    /**
     * Settings getter
     */
    public get settings(): any {
        if (this._settings == null) {

            // DEFAULT
            return {

                "Path": null,
                "ProcessItem": "",
                "IsDeveloper": false,
                "Metadata": {
                    "ProjectName": null,
                    "Solution": null,
                    "AppNamespace": null,
                    "DataServiceNamespace": null,
                    "DataLayerNamespace": null,
                    "ConnectionString": null,
                    "Path": null,
                    "UseGenerated": false
                },

                // Temp data (for scripts)
                "TempData": null,

                // Loaded data
                // "Tables": {},
                // "Views": {},
                // "Procedures": {},
                // "Functions": {},

                // Scripts
                "Scripts": {
                    // global commands 
                    "InitializeScript": {},
                    "FileOperations": {},
                    "SettingOperations": {},
                    "Commands": {},
                    // modules
                    "Modules": {
                        // "Tables": {},
                        // "Views": {},
                        // "Procedures": {},
                        // "Functions": {},
                    }
                },
            };
        }
        return this._settings;
    }

    public set settings(v: any) {
        this._settings = v;
    }

    /**
     * Return all global commands
     */
    get commands() {
        // deleting modules
        let commands = { ...this.settings.Scripts };
        // delete commands.Modules; // Item right-click events
        // delete commands.InitializeScript; // PREDEFINED SCRIPT FOR INIT APP

        return commands;
    }

    /**
     * Returns all modules
     */
    get modules() {
        return this.settings.Scripts.Modules;
    }

    get modulesCount() {
        return Object.keys(this.modules).length;
    }

    /**
    * Returns all commands for module
    */
    get moduleCommands() {
        let commands = { ...this.settings.Scripts.Modules };
        // PREDEFINED SCRIPT FOR IMPORTING DATA
        // delete commands[this.selectedModule]["Import" + this.selectedModule]; 
        return commands[this.selectedModule];
    }

    get moduleImport() {
        let commands = { ...this.settings.Scripts.Modules };
        console.log(commands);
        // PREDEFINED SCRIPT FOR IMPORT DATA
        return commands[this.selectedModule]["Import" + this.selectedModule];
    }

    get moduleColumns() {
        return ['DisplayName', 'Schema', 'Name'];
    }

    /**
     * Returns all data
     */
    get moduleData() {
        // data for module
        let data = Object.entries(this.settings[this.selectedModule]).map(item => item[1]);
        return data;
    }

    constructor(private electronService: ElectronService) {
    }

    /**
     * Load settings from file (project file)
     */
    public async load(path: string): Promise<Boolean> {

        try {
            let rawdata = this.electronService.fs.readFileSync(path, `utf-8`).trim();
            this.settings = JSON.parse(rawdata);

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

        if (this.settings.ProjectName == null || this.settings.ProjectName.length == 0) {
            this.settings.ProjectName = this.electronService.path.parse(path).name;
        }

        await this.electronService.fs.writeFileSync(path, JSON.stringify(this.settings))
    }
}