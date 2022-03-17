import { NgModule } from '@angular/core';

import { ListRoutingModule} from './list-routing.module';

import { ListListComponent } from './list/list-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [ListListComponent],
  imports: [CoreModule, SharedModule, ListRoutingModule]
})
export class ListModule {}
