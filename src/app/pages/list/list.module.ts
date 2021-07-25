import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule} from './list-routing.module';

import { ListListComponent } from './list/list-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ListListComponent],
  imports: [CommonModule, SharedModule, ListRoutingModule]
})
export class ListModule {}
