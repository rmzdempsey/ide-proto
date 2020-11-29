import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {FormsModule} from '@angular/forms';
import { ProjectPanelComponent } from './ui/panels/project-panel/project-panel.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {StoreModule} from '@ngrx/store';
import * as fromRoot from './store/reducers';
import { LoginPanelComponent } from './ui/dialogs/login-panel/login-panel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MainMenuComponent } from './ui/menus/main-menu/main-menu.component';
import {MatMenuModule} from '@angular/material/menu';
import { OpenProjectComponent } from './ui/dialogs/open-project/open-project.component';
import { NewProjectComponent } from './ui/dialogs/new-project/new-project.component';
import {MatExpansionModule} from '@angular/material/expansion'
import {MatCardModule} from '@angular/material/card'
import {DragDropModule} from '@angular/cdk/drag-drop';
import { EffectsModule } from '@ngrx/effects';
import { LoginEffects } from './store/effects/login.effects';
import { NewProjectEffects } from './store/effects/new-project-effects';
import { IdeEffects } from './store/effects/ide.effects';
import { AppPanelComponent } from './ui/panels/app-panel/app-panel.component';
import { ConsolePanelComponent } from './ui/panels/console-panel/console-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    NewProjectComponent,
    ProjectPanelComponent,
    LoginPanelComponent,
    MainMenuComponent,
    OpenProjectComponent,
    AppPanelComponent,
    ConsolePanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatExpansionModule,
    MatCardModule,
    DragDropModule,
    StoreModule.forRoot(fromRoot.reducers),
    EffectsModule.forRoot([LoginEffects,NewProjectEffects, IdeEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
