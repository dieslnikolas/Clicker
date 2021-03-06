import { Injectable } from "@angular/core";
import { CoreModule } from "@angular/flex-layout";
import { ElectronService } from "../../../services/electron/electron.service";
import { ProjectService } from "../../../services/project/project.service";
import { Command } from "../command";
import { IScriptRunner } from "../script-runner.interface";

@Injectable({
    'providedIn': CoreModule
})
export class PythonRunner implements IScriptRunner {

    constructor(private electronService: ElectronService, private projectService: ProjectService) { }

     async ScriptTemplate(path: string): Promise<string> {
        return `# file sits in ${path}
# data are accessible via:
#
#    sys.argv[1]
#

import json
import sys

data = sys.argv[1]
print(data)`;
    }

    CanRunOrHowTo(path: string): Promise<string> {
        // is python3 is installed
        return null;
    }

    async Run(action: string, item: Command): Promise<any> {

        // ADS CONTEXT IF ITS NESESARY
        let args = [item.Path];

        if (true || item.HasData || item.IsContext) {
            let path = await this.projectService.saveTmp();
            args.push(`${path} | python -m json.tool`);
        }


        return this.electronService.childProcess.spawn("python", args, {
            cwd: this.projectService.appPath
        });
    }

}