
import { Action } from '@ngrx/store';
import { LoginResult } from 'src/app/model/loginResult';

export const LOGIN_ACTION = '[DtpIde] Login';

export class LoginAction implements Action {

    readonly type = LOGIN_ACTION;

    constructor( public username:string, public password: string, public domain: string  ){}
}

export const LOGIN_RESULT = '[DtpIde] Login Result';

export class LoginResultAction implements Action {

    readonly type = LOGIN_RESULT;

    constructor( public result: LoginResult  ){}
}

export type Actions = LoginAction | LoginResultAction;