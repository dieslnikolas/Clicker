import { ChildProcessWithoutNullStreams } from "node:child_process";
import { Command } from "./command";

export interface IScriptRunner {

    /**
     * Run script from file
     * @param scriptPath path to scripts
     * @param item command
     */
    Run(action: string, item: Command): ChildProcessWithoutNullStreams;

    /**
     * Initialize action
     */
    Init(): ChildProcessWithoutNullStreams;

}