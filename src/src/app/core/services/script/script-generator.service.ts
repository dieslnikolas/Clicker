import { Injectable } from "@angular/core";
import { ScriptScope } from "../../common/scripts/script-scope";
import { ScriptType } from "../../common/scripts/script-type";
import { ScriptTypeHelper } from "../../common/scripts/script-type-helper";
import { ProjectService } from "../project/project.service";
import { APP_CONFIG } from "../../../../environments/environment";
import { ElectronService } from "../electron/electron.service";

/**
 * Genetares scripts based by some folder structure
 */
@Injectable({
    providedIn: 'root'
})
export class ScriptGeneratorService {

    constructor(private electron: ElectronService, private projectService: ProjectService, private scriptTypeHelper: ScriptTypeHelper) { }

    /**
     * Genetates physicaly script on the disk
     * @param name Script name
     * @param scope Script scope (global or item)
     * @param type Script type (language)
     */
    public generate(name: string, scope: ScriptScope, type: ScriptType) {
        let fixedName = this.fixName(name, scope, type);

        console.log("Generating file " + fixedName);
        console.log("Exists " + this.electron.fs.existsSync(fixedName));
    }

    /**
     * Gets default script type
     * @returns Default project script type
     */
    public get defaultType() : ScriptType {
        return ScriptType[APP_CONFIG.defaultScriptType] as ScriptType;
    }

    public get scriptTypes(): ScriptType[] {
        return this.scriptTypeHelper.scriptTypes;
    }

    /**
     * Generate full file path
     * @param name Script Name
     * @param scope Script scope
     * @param type Script type
     */
    private fixName(name: string, scope: ScriptScope, type: ScriptType): string {
        let path = "/";

        // SCOPE
        if (scope == ScriptScope.Global)
            path += "global/";
        else
            path += "item/"

        // NAME
        path += name.replace("-", "_");

        // EXTENSION
        path += "." + ScriptType[type];

        return path;
    }
}
