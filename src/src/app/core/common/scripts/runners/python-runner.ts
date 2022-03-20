import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { ElectronService } from "../../../services/electron/electron.service";
import { Command } from "../command";
import { IScriptRunner } from "../script-runner.interface";

@Injectable({
    'providedIn': CoreModule
})
export class PythonRunner implements IScriptRunner {

    constructor(private electronService: ElectronService) { }

    Run(action: string, item: Command) {
        // // Import tkinter
        // const tk = await python('tkinter')
        // // All Python API access must be prefixed with await
        // const root = await tk.Tk()
        // // A function call with a $ suffix will treat the last argument as a kwarg dict
        // const a = await tk.Label$(root, { text: 'Hello World' })
        // await a.pack()
        // await root.mainloop()
        // python.exit() // M

        this.RunCommand("Python commnad", item);
    }
    RunCommand(command: string, item: Command) {
        throw new Error("Python runner not implemented.");
    }

}