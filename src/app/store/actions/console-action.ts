
import { Action } from '@ngrx/store';

export const CONSOLE_UPDATE_ACTION = '[DtpIde] Console Update Action';

export class ConsoleUpdateAction implements Action {

    readonly type = CONSOLE_UPDATE_ACTION;

    constructor( public data:any  ){}
}

export type Actions = ConsoleUpdateAction;