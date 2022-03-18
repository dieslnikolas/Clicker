import { Injectable } from "@angular/core";
import { ElectronService } from "../services";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Settings {

    moduleChanged: Subject<string> = new Subject<string>();

    private __appPath: string;
    public get appPath(): string {
        if (this.__appPath == null)
            this.__appPath = this.electronService.remote.app.getAppPath();

        return this.__appPath;
    }

    private _selectedModule: string;
    public get selectedModule(): string {
        return this._selectedModule;
    }
    public set selectedModule(v: string) {
        this._selectedModule = v;
        this.moduleChanged.next(this._selectedModule);
    }

    private settings: {

        // Settings
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
        "Tables": {},
        "Views": {},
        "Procedures": {},
        "Functions": {},

        // Scripts
        "Scripts": {
            // global commands 
            "InitializeScript": {},
            "FileOperations": {},
            "SettingOperations": {},
            "Commands": {},
            // modules
            "Modules": {
                "Tables": {},
                "Views": {},
                "Procedures": {},
                "Functions": {},
            }
        },
    };

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

    public async loadSettings(): Promise<void> {

        let file = this.electronService.path.resolve(this.appPath, 'IT2021Sale.pwgen');
        let rawdata = this.electronService.fs.readFileSync(file, `utf-8`).trim();
        this.settings = JSON.parse(rawdata);

        console.log(this.settings);
    }

    public async saveSettings(): Promise<void> {

        let file = this.electronService.path.resolve(this.appPath, 'IT2021Sale.pwgen');
        this.electronService.fs.writeFileSync(file, JSON.stringify(this.settings))
    }
}