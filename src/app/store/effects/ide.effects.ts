import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {ConfigService} from '../../services/config.service';
import { tap } from 'rxjs/operators';
import { IDE_NEW_PROJECT_ACTION, INIT_ACTION, IDE_DELETE_PROJECT_ACTION } from '../actions/ide-actions';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';

@Injectable()
export class IdeEffects {

  initialiseIde$ = createEffect(() => this.actions$.pipe(
      ofType(INIT_ACTION),
      tap(()=>this.configService.initialiseIde())
    ),
    {dispatch:false}
  );

  newProject$ = createEffect(() => this.actions$.pipe(
      ofType(IDE_NEW_PROJECT_ACTION),
      tap((action)=>{
        this.configService.newProject(action['projectName'],action['templates']);
      })
    ),
    {dispatch:false}
  );

  deleteProject$ = createEffect(() => this.actions$.pipe(
      ofType(IDE_DELETE_PROJECT_ACTION),
      tap((action)=>{
        this.configService.deleteProject(action['projectName']);
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