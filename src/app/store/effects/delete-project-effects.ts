import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {ConfigService} from '../../services/config.service';
import { map} from 'rxjs/operators';
import {DELETE_PROJECT_ACTION, NEW_PROJECT_ACTION} from '../actions/project-actions';
import {NoOpAction} from '../actions/noop-action';


@Injectable()
export class DeleteProjectEffects {

    deleteProject$ = createEffect(() => this.actions$.pipe(
        ofType(DELETE_PROJECT_ACTION),
        map(action=>{
            this.configService.deleteProject(action['projectName']);
            return new NoOpAction();
        })
        )
    );
     
    constructor(
    private actions$: Actions,
    private configService: ConfigService
    ) {}
}