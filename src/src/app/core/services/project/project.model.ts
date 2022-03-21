export class ProjectModel  {
    IsDeveloper: boolean = false;
    Path: string;
    Metadata: { [key: string]: any; };
    Scripts: { [key: string]: any; };
    ProcessItem: { [key: string]: any; };
    TempData: { [key: string]: any; };

    constructor() {
        this.Metadata["ProjectName"] = "MyApp";
        this.Scripts["InitializeScript"] = { "Path": "Scripts/Core/Commands/Initialize-Script.ps1" }
    }
}