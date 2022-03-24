import { Injectable } from "@angular/core";
import { ScriptScope } from "../../common/scripts/script-scope";
import { ScriptType } from "../../common/scripts/script-type";
import { ScriptTypeHelper } from "../../common/scripts/script-type-helper";
import { ProjectService } from "../project/project.service";
import { APP_CONFIG } from "../../../../environments/environment";
import { ElectronService } from "../electron/electron.service";
import { ScriptRunnerService } from "./script-runner.service";

/**
 * Genetares scripts based by some folder structure
 */
@Injectable({
    providedIn: 'root'
})
export class ScriptGeneratorService {

    constructor(private electron: ElectronService, private projectService: ProjectService, private scriptTypeHelper: ScriptTypeHelper, private scriptRunnerService: ScriptRunnerService) { }

    /**
     * Genetates physicaly script on the disk
     * @param fileName Script name
     * @param scope Script scope (global or item)
     * @param type Script type (language)
     */
    public async generate(fileName: string, scope: ScriptScope, type: ScriptType, hasData: boolean) : Promise<void> {

        // validation
        await this.validate(fileName, scope, type);

        // prepare file path
        let path = await this.getPathAndFixName(fileName, scope, type);

        // add command to json
        this.projectService.addCommand(fileName, path, scope, hasData);

        // create file
        let content = await this.scriptRunnerService.ScriptTemplate(path);

        // open file in associated program

    }

    /**
     * Gets default script type
     * @returns Default project script type
     */
    public get defaultType(): ScriptType {
        return this.scriptTypeHelper.parse(ScriptType[APP_CONFIG.defaultScriptType]);
    }

    public get scriptTypes(): ScriptType[] {
        return this.scriptTypeHelper.scriptTypes;
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
            pathFixed += `/Scripts/Global/Commands/`;
        }

        // item // row // import
        else if (scope == ScriptScope.Item || scope == ScriptScope.Import) {
            pathFixed += `/Scripts/${this.projectService.selectedModule}/`;
        }

        // unsuported
        else {
            throw new Error(`Unsuported scope ` + scope);
        }

        let file = this.electron.path.parse(fileName);

        // NAME
        fileName += scope == ScriptScope.Import ? 

            // import script - name is ignored
            `Import${this.projectService.selectedModule}.${type.toString()}` 

            // regular row script
            : `${file.name.replace("-", "_")}.${type.toString()}`;

        // finaly connect whole path 
        pathFixed = `${pathFixed}/${fileName}`;

        return pathFixed;
    }

    /**
     * 
     * @param name path to file
     * @param scope global/item
     * @param type 
     * @returns 
     */
    public async validate(name: string, scope: ScriptScope, type: ScriptType): Promise<boolean> {

        if (name == null || name.length == 0)
            throw new Error("Missing script name");

        if (this.electron.fs.existsSync(name))
            throw new Error("file exists " + name);

        return true;
    }
}
