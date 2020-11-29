import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {LoginService} from '../../services/login.service';
import {ConfigService} from '../../services/config.service';
import { map, mergeMap, catchError } from 'rxjs/operators';
import {LOGIN_ACTION, LOGIN_RESULT, LoginResultAction} from '../actions/login-actions';
//import {LoadProjectsAction} from '../actions/project-actions'

@Injectable()
export class LoginEffects {

    login$ = createEffect(() => this.actions$.pipe(
        ofType(LOGIN_ACTION),
        mergeMap(action => this.loginService.login(action['username'],action['password'],action['domain'])
          .pipe(
            map(loginResult => new LoginResultAction(loginResult)),
            //catchError(() => EMPTY)
          ))
        )
    );

    // loginResultTemplates$ = createEffect(() => this.actions$.pipe(
    //     ofType(LOGIN_RESULT),
    //     mergeMap(action =>
    //         this.configService.getTemplates()
    //       .pipe(
    //         map(templates => new LoadTemplatesAction(templates)),
    //         //catchError(() => EMPTY)
    //       ))
    //     )
    // );

    // loginResultProjects$ = createEffect(() => this.actions$.pipe(
    //     ofType(LOGIN_RESULT),
    //     mergeMap(action =>
    //         this.configService.getProjects()
    //       // .pipe(
    //       //   map(projects => new LoadProjectsAction(projects)),
    //         //catchError(() => EMPTY)
    //       ))
    //     )
    // );
     
    constructor(
    private actions$: Actions,
    private loginService: LoginService,
    private configService: ConfigService
    ) {}
}