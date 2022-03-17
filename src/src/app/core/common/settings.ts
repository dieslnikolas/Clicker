import { Injectable } from "@angular/core";
import { ElectronService } from "../services";

@Injectable({
    providedIn: 'root'
})
export class Settings {
    
    private appPath = this.electronService.remote.app.getAppPath();
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
        "Tables": [],
        "Views": [],
        "Procedures": [],
        "Functions": [],
        "Items": [],

        // Scripts
        "Scripts": {
            // global commands 
            "InitializeScript": [],
            "FileOperations": [],
            "SettingOperations": [],
            "Commands": [],
            // modules
            "Modules": {
                "Tables": [],
                "Views": [],
                "Procedures": [],
                "Functions": [],
            }
         },

         
    };

    get commands() {
        return this.settings.Scripts.Commands;
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