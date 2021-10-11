import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from './services';
import { ScriptGenerator } from './script-generator/script-generator';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ElectronService,
    ScriptGenerator
  ]
})
export class CoreModule { }
