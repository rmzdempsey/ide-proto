
import { Action } from '@ngrx/store';

export const CREATE_CONSOLE = '[DtpIde] Create Console Action';
export const DESTROY_CONSOLE = '[DtpIde] Destroy Console Action';
export const UPDATE_CONSOLE = '[DtpIde] Update Console Action';
export const CLEAR_CONSOLE = '[DtpIde] Clear Console Action';

export class CreateConsoleAction implements Action {

    readonly type = CREATE_CONSOLE;

    constructor( public name: string){}
}

export class DestroyConsoleAction implements Action {

    readonly type = DESTROY_CONSOLE;

    constructor( public name: string){}
}

export class UpdateConsoleAction implements Action {

    readonly type = UPDATE_CONSOLE;

    constructor( public name: string, public data:string  ){}
}

export class ClearConsoleAction implements Action {

    readonly type = CLEAR_CONSOLE;

    constructor( public name: string){}
}

export type Actions = CreateConsoleAction | DestroyConsoleAction | UpdateConsoleAction | ClearConsoleAction;