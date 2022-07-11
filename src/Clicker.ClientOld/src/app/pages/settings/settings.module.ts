import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsEditComponent } from './edit/settings-edit.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SettingsEditComponent],
  imports: [CommonModule, SharedModule, SettingsRoutingModule]
})
export class SettingsModule {}
