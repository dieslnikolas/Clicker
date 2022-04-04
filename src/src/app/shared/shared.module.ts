// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { SearchComponent } from './components/search/search.component';
import { GlobalCommandComponent } from './components/global-command/global-command.component';
import { ModuleComponent } from './components/module/module.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { FrameComponent } from './components/frame/frame.component';
import { FooterComponent } from './components/footer/footer.component';

// Directives
import { WebviewDirective } from './directives/webview/webview.directive';

// Pipes
import { BoolToYesNoPipe } from './pipes/bool-to-yes-no.pipe';
import { NgForFilterPipe } from './pipes/ng-for-filter.pipe';
import { ScriptTypeToStringPipe } from './pipes/script-type-to-string.pipe';

// FlexLayout
import { FlexLayoutModule } from '@angular/flex-layout';

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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [

    // Components
    PageNotFoundComponent, 
    TerminalComponent,
    ContextMenuComponent,
    SearchComponent,
    GlobalCommandComponent,
    ModuleComponent,
    DialogComponent,
    FrameComponent,
    FooterComponent,
 
    // Directives
    WebviewDirective,

    // Pipies
    BoolToYesNoPipe,
    NgForFilterPipe,
    ScriptTypeToStringPipe
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
    MatTabsModule,
    MatCheckboxModule,
    MatBadgeModule
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
    MatTabsModule,
    MatCheckboxModule,
    MatBadgeModule,
    
    // Components
    TerminalComponent,
    ContextMenuComponent,
    GlobalCommandComponent,
    ModuleComponent,
    SearchComponent,
    DialogComponent,
    FrameComponent,
    FooterComponent,

    // Pipes
    BoolToYesNoPipe,
    NgForFilterPipe,
    ScriptTypeToStringPipe
  ],
  providers: [
    
  ]
})
export class SharedModule {}
