import { ChildProcessWithoutNullStreams } from "node:child_process";
import { Command } from "./command";
import { ScriptType } from "./script-type";

export interface IScriptRunner {

    /**
     * Run script from file
     * @param scriptPath path to scripts
     * @param input 
     */
    Run(action: string, item: Command): ChildProcessWithoutNullStreams;

}