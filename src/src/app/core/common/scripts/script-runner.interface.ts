import { Command } from "./command";
import { ScriptType } from "./script-type";

export interface IScriptRunner {

    /**
     * Run script from file
     * @param scriptPath path to scripts
     * @param input 
     */
    Run(action: string, item: Command): any;

    /**
     * Runs command
     * @param command string command
     * @param input input
     */
    RunCommand(command: string, item: Command, scriptType: ScriptType): any;

}