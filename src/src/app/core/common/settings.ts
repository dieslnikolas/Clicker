import { Injectable } from "@angular/core";
import { ElectronService } from "../services";

@Injectable({
    providedIn: 'root'
})
export class Settings {
    
    
    private __appPath : string;
    public get appPath() : string {
        if (this.__appPath == null)
            this.__appPath = this.electronService.remote.app.getAppPath();

        return this.__appPath;
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
        let commands = {...this.settings.Scripts};
        delete commands.Modules; // Item right-click events
        delete commands.InitializeScript; // PREDEFINED SCRIPT FOR INIT APP

        return commands;
    }

    /**
     * Returns all modules
     */
    get modules() {
        return this.settings.Scripts.Modules;
    }

     /**
     * Returns all commands for module
     */
      get modulesCommand() {
        let commands = {...this.settings.Scripts.Modules };
        delete commands.Tables["ImportTables"]; // PREDEFINED SCRIPT FOR IMPORINT DATA

        return commands.Tables;
    }

    get dataCollumns() {
        return ['DisplayName', 'Schema', 'Name'];
    }

    /**
     * Returns all data
     */
     get data() {

        let selectedModule = 0; // "Tables";

        // modules
        let modules = Object.entries({ ... this.modules }).map(item => item[0]);
        
        // data for module
        let data = Object.entries(this.settings[modules[selectedModule]]).map(item => item[1]);
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