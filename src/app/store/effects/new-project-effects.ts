import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {ConfigService} from '../../services/config.service';
import {Project} from '../../model/project';
import { tap } from 'rxjs/operators';
import { CreateConsoleAction} from '../actions/console-action';
import {NEW_PROJECT_ACTION, NEW_PROJECT_ACTION_SUCCESS} from '../actions/project-actions';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';

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
            tap(action=>{
                let project : Project = action['project']
                project.apps.forEach(a=>{
                    this.store.dispatch(  new CreateConsoleAction(a.template.appName) );
                })
                return action
            }),
            tap(action=>{
                this.configService.cloneApps(action['project'])
                return action
            })
        ),
        {dispatch:false}
    );
     
    constructor(
    private actions$: Actions,
    private configService: ConfigService,
    private store: Store<fromRoot.State>,
    ) {}
}