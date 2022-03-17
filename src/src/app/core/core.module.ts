import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from './services';
import { ScriptGenerator } from './script-generator/script-generator';
import { Settings } from './common/settings';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ElectronService,
    ScriptGenerator,
    Settings
  ],
  providers:[
    ElectronService,
    ScriptGenerator,
    Settings
  ]
})
export class CoreModule { }
