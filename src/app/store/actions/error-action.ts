
import { Action } from '@ngrx/store';

export const ERROR_ACTION = '[DtpIde] Error';
export const CLEAR_ERROR_ACTION = '[DtpIde] Clear Error';

export class ErrorAction implements Action {

    readonly type = ERROR_ACTION;

    constructor( public message:string  ){}
}

export class ClearErrorAction implements Action {

    readonly type = CLEAR_ERROR_ACTION;

    constructor(){}
}

export type Actions = ErrorAction | ClearErrorAction;