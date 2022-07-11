// In your pipe:
import { Pipe, PipeTransform } from '@angular/core';
import { ScriptType } from '../../core/common/scripts/script-type';

@Pipe({
    name: 'scriptTypeToString'
})
export class ScriptTypeToStringPipe implements PipeTransform {

    transform(value: ScriptType, ...args: any[]): any {
        switch (value) {
            case ScriptType.Bash:
                return "Bash";
            case ScriptType.Powershell:
                return "Powershell";
            case ScriptType.Python:
                return "Python";
        }
    }
}