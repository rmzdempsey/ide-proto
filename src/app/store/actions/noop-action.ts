
import { Action } from '@ngrx/store';

export const NOOP_ACTION = '[DtpIde] No Op';


export class NoOpAction implements Action {

    readonly type = NOOP_ACTION
}

export type Actions = NoOpAction;