import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {ConfigService} from '../../services/config.service';
import { tap} from 'rxjs/operators';
import {DELETE_PROJECT_ACTION} from '../actions/project-actions';


@Injectable()
export class DeleteProjectEffects {

    deleteProject$ = createEffect(() => 
        this.actions$.pipe(
            ofType(DELETE_PROJECT_ACTION),
            tap(action=>this.configService.deleteProject(action['projectName']))
        ),
        {dispatch:false}
    );
     
    constructor(
    private actions$: Actions,
    private configService: ConfigService
    ) {}
}