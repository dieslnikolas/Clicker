export enum ScriptType {
    Python = "py",
    Powershell = "ps1"
}

export namespace ScriptType {

    /**
     * Converts enum to value
     * @param scriptType Enum script type
     * @returns returns value of the enum
     */
    export function toString(scriptType: ScriptType): string {
        return ScriptType[scriptType];
    }

    /**
     * Converts enum type to its name
     * @param scriptType script type enum
     * @returns returs name of the enum
     */
    export function parse(scriptType: string): ScriptType {
        return ScriptType[scriptType];
    }

    /**
     * Converts enum to array
     */
    export function toArray(): ScriptType[] {
        
        let arr = [];

        for(var scriptType in ScriptType) {
            
            if (scriptType != "toString" && scriptType != "parse" && scriptType != "toArray")
                arr.push(scriptType);
        };

        return arr;

    }
}
