import { ChildProcessWithoutNullStreams } from "node:child_process";
import { Command } from "./command";

export interface IScriptRunner {

    /**
     * Run script from file
     * @param scriptPath path to scripts
     * @param item command
     */
    Run(action: string, item: Command): Promise<ChildProcessWithoutNullStreams>;

    /**
     * init script template
     */
    ScriptTemplate(path: string): Promise<string>;

    /**
     * Check if script is runnable on this machine
     * @param path path to file
     */
    CanRunOrHowTo(path: string): Promise<string>;
}