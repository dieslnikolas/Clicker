import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent, TerminalComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';


// Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ReactiveFormsModule } from '@angular/forms';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { SearchComponent } from './components/search/search.component';
import { GlobalCommandsComponent } from './components/global-commands/global-commands.component';
import { NavigationComponent } from './components/navigation/navigation.component';

@NgModule({
  declarations: [

    // Components
    PageNotFoundComponent, 
    TerminalComponent,
    ContextMenuComponent,
    SearchComponent,
    GlobalCommandsComponent,
    NavigationComponent,

    // Directives
    WebviewDirective
  ],
  imports: [
    CommonModule, 
    TranslateModule, 
    FormsModule,

    // Material 
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,

  ],
  exports: [
    TranslateModule,
    WebviewDirective, 
    FormsModule,

    // MAterial
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
  
    // Components
    TerminalComponent,
    ContextMenuComponent,
    GlobalCommandsComponent,
    NavigationComponent,
    SearchComponent
  ]
})
export class SharedModule {}
