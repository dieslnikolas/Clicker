import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Sub-Routes
import { ListRoutingModule } from './pages/list/list-routing.module';
import { AboutRoutingModule } from './pages/about/about-routing.module';
import { SettingsRoutingModule } from './pages/settings/settings-routing.module';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

// Default route
const routes: Routes = [
  {
    path: '',
    redirectTo: 'list/list',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    ListRoutingModule,
    AboutRoutingModule,
    SettingsRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
