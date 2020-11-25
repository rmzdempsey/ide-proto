import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {ConfigService} from '../../services/config.service';
import { map} from 'rxjs/operators';
import {NEW_PROJECT_ACTION,CLONE_APPS_ACTION} from '../actions/project-actions';
import {NoOpAction} from '../actions/noop-action';


@Injectable()
export class NewProjectEffects {

    newProject$ = createEffect(() => this.actions$.pipe(
        ofType(NEW_PROJECT_ACTION),
        map(action=>{
            this.configService.newProject(action['projectName'],action['templates']);
            return new NoOpAction();
        })
        )
    );

    cloneApps$ = createEffect(() => this.actions$.pipe(
        ofType(CLONE_APPS_ACTION),
        map(action=>{
            this.configService.cloneApps(action['project']);
            return new NoOpAction();
        })
        )
    );
     
    constructor(
    private actions$: Actions,
    private configService: ConfigService
    ) {}
}