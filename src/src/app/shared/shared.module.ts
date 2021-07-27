// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { PageNotFoundComponent, TerminalComponent } from './components/';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { SearchComponent } from './components/search/search.component';
import { GlobalCommandsComponent } from './components/global-commands/global-commands.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CommandDialogComponent } from './components/command-dialog/command-dialog.component';

// Directives
import { WebviewDirective } from './directives/';

// FlexLayout
import { FlexLayoutModule } from '@angular/flex-layout';

// Terminal
import { NgTerminalComponent, NgTerminalModule } from 'ng-terminal';

// Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [

    // Components
    PageNotFoundComponent, 
    TerminalComponent,
    ContextMenuComponent,
    SearchComponent,
    GlobalCommandsComponent,
    NavigationComponent,
    CommandDialogComponent,
 
    // Directives
    WebviewDirective
  ],
  imports: [
    CommonModule, 
    TranslateModule, 
    FormsModule,
    ReactiveFormsModule,

    // Material 
    FlexLayoutModule,
    LayoutModule,
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
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule,

    NgTerminalModule
  ],
  exports: [
    CommonModule, 
    TranslateModule, 
    FormsModule,
    ReactiveFormsModule,

    // Material 
    FlexLayoutModule,
    LayoutModule,
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
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule, 
    
    // Components
    TerminalComponent,
    ContextMenuComponent,
    GlobalCommandsComponent,
    NavigationComponent,
    SearchComponent,
    CommandDialogComponent
  ],
  providers: [
    
  ]
})
export class SharedModule {}
