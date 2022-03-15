import { Injectable } from "@angular/core";
import { ScriptScope } from "./script-scope";
import { ScriptType } from "./script-type";
import { ElectronService } from "../services";
import { Settings } from "../common/settings";
import { APP_CONFIG } from "../../../environments/environment";

/**
 * Genetares scripts based by some folder structure
 */
@Injectable({
    providedIn: 'root'
})
export class ScriptGenerator {

    constructor(private electron: ElectronService, private settings: Settings) { }

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
    public defaultType() : ScriptType {
        return ScriptType[APP_CONFIG.defaultScriptType] as ScriptType;
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
