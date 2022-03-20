import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { Command } from "../command";
import { IScriptRunner } from "../script-runner.interface";
import { ElectronService } from "../../../services/electron/electron.service";

@Injectable({
    'providedIn': CoreModule
})
export class PowershellRunner implements IScriptRunner {

    private powershell;

    constructor(private electronService: ElectronService) {
        this.powershell = new this.electronService.powershell.PowerShell({
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

        // location
        // let directory = this.electronService.path.parse(item.Path).dir;
        // let scriptLocationCommand = this.electronService.powershell.PowerShell.command`Set-Location ${directory}`;

        // this.powershell.invoke(scriptLocationCommand).then((changeDirResult) => {

            // if (!changeDirResult.hadErrors) {
                // run powershell
                // let scriptCommand = this.electronService.powershell.PowerShell.command`${command}`;
                let scriptCommand = this.electronService.powershell.PowerShell.command`code .`;
                this.powershell.invoke(scriptCommand).then((result) => {
                    console.log(result);
                    console.log("Stderr", result.stderr.toString());
                    console.log(result.stdout.toString());
                });
        //     }
        // })
    }

}