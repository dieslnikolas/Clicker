export class ProjectModel {
    IsDeveloper: boolean = false;
    Path: string;
    Metadata: { [key: string]: any; };
    Scripts: { [key: string]: any; };
    ProcessItem: { [key: string]: any; };
    TempData: { [key: string]: any; };

    constructor() {

        // Metadata (settings basically)
        this["Metadata"] = {};
        this["Metadata"]["ProjectName"] = "MyApp";

        // Tempdata
        this["Metadata"] = {};

        // ProcessItem
        this["ProcessItem"] = {};

        // init script
        this["Scripts"] = {};
        this["Scripts"]["InitializeScript"] = { "Path": "Scripts/Core/Commands/Initialize-Script.ps1" };

        // commands
        this["Scripts"] = {};
        this["Scripts"]["Commands"] = {};

        // FileOperations
        this["Scripts"]["FileOperations"] = {
            "Open": {
                "DisplayName": "Open",
                "Path": "Scripts/Core/FileOperations/Open-File.ps1",
                "HasData": true
            },
            "Save": {
                "DisplayName": "Save",
                "Path": "Scripts/Core/FileOperations/Save-File.ps1",
                "HasData": false
            },
            "SaveAs": {
                "DisplayName": "Save as",
                "Path": "Scripts/Core/FileOperations/Save-As-File.ps1",
                "HasData": false
            }
        };

        // SettingOperations
        this["Scripts"]["SettingOperations"] = {
            "Settings": {
                "DisplayName": "Settings",
                "Path": "Scripts/Core/SettingOperations/Set-Settings.ps1",
                "HasData": true
            },
            "OpenFolder": {
                "DisplayName": "Open temp Folder",
                "Path": "Scripts/Core/SettingOperations/Open-Temp-Folder.ps1",
                "HasData": false
            }
        };

        // Modules
        this["Scripts"]["Modules"] = {  };
    }
}