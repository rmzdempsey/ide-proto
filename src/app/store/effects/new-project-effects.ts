import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {ConfigService} from '../../services/config.service';
import { tap } from 'rxjs/operators';
import {NEW_PROJECT_ACTION,CLONE_APPS_ACTION, NEW_PROJECT_ACTION_SUCCESS} from '../actions/project-actions';


@Injectable()
export class NewProjectEffects {

    newProject$ = createEffect(() => 
        this.actions$.pipe(
            ofType(NEW_PROJECT_ACTION),
            tap(action=>this.configService.newProject(action['projectName'],action['templates']))
        ),
        {dispatch: false}
    );

    cloneApps$ = createEffect(() => 
        this.actions$.pipe(
            ofType(NEW_PROJECT_ACTION_SUCCESS),
            tap(action=>this.configService.cloneApps(action['project']))
        ),
        {dispatch:false}
    );
     
    constructor(
    private actions$: Actions,
    private configService: ConfigService
    ) {}
}