import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutDetailComponent } from './detail/about-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { AboutRoutingModule } from './about-routing.module';

@NgModule({
  declarations: [AboutDetailComponent],
  imports: [CommonModule, SharedModule, AboutRoutingModule]
})
export class AboutModule {}
