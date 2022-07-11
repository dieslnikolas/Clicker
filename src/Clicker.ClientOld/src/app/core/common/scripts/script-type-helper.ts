import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { ElectronService } from "../../services/electron/electron.service";
import { ScriptType } from "./script-type";


@Injectable({
    providedIn: CoreModule
})
export class ScriptTypeHelper {

    constructor(private electronService: ElectronService) {} 
    
    /**
     * Converts enum to value
     * @param scriptType Enum script type
     * @returns returns value of the enum
     */
    public toString(scriptType: ScriptType): string {
        return ScriptType[scriptType];
    }

    /**
     * Converts enum type to its name
     * @param scriptType script type enum
     * @returns returs name of the enum
     */
    public parse(scriptType: string): ScriptType {
        if (scriptType.indexOf(".") >= 0) 
            scriptType = scriptType.replace(".", "");

        let parsed = scriptType as ScriptType;

        return parsed;
    }

    /**
     * Converts enum to array
     */
    public get scriptTypes(): ScriptType[] {
        
        let arr = [];

        for(var scriptType in ScriptType) {
            
            if (scriptType != "toString" && scriptType != "parse" && scriptType != "toArray")
                arr.push(ScriptType[scriptType]);
        };

        return arr;

    }

    /**
     * Gets script type by extension
     * @param fileNameOrPath path to file 
     * @returns 
     */
    public GetScriptTypeByName(fileNameOrPath: string): ScriptType {
        let extension = this.electronService.path.parse(fileNameOrPath).ext;
        return this.parse(extension);
    }
}
