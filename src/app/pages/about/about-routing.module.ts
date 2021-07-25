import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AboutDetailComponent } from './detail/about-detail.component';

const routes: Routes = [
  {
    path: 'about/detail',
    component: AboutDetailComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule {}
