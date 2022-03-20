import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { Command } from "../command";
import { IScriptRunner } from "../script-runner.interface";
import { ElectronService } from "../../../services/electron/electron.service";

@Injectable({
    'providedIn': CoreModule
})
export class BashRunner implements IScriptRunner {

    private bash;

    constructor(private electronService: ElectronService) {
        this.bash = new this.electronService.bash.Bash({
            debug: true,
            executableOptions: {
                '-ExecutionPolicy': 'Bypass',
                '-NoProfile': true,
            },
        });
    }

    Run(action: string, item: Command) {
        console.log(action, item);

        // grab data json and send it to script 
        let command = `($dataJson | ConvertFrom-JsonExtend | ${item.Path})`;

        // run command
        this.RunCommand(command, item);
    }

    RunCommand(command: string, item: Command) {

        // create command
        const scriptCommand = this.electronService.bash.Bash.command`${command}`;

        // run powershell
        this.bash.invoke(scriptCommand).then((result) => {
            console.log(result);
        });
    }

}