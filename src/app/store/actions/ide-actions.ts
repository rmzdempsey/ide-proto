import { Action } from '@ngrx/store';
import {Project2} from '../../model/project';
import {Template} from '../../model/template';

export const INIT_ACTION = '[DtpIde] Init';
export const INIT_SUCCESS_ACTION = '[DtpIde] Init Success';
export const IDE_SELECT_PROJECT_ACTION = '[DtpIde] Ide Select Project';
export const IDE_NEW_PROJECT_ACTION = '[DtpIde] Ide New Project';
export const IDE_NEW_PROJECT_SUCCESS_ACTION = '[DtpIde] Ide New Project Success';
export const IDE_DELETE_PROJECT_ACTION = '[DtpIde] Ide Delete Project';
export const IDE_DELETE_PROJECT_SUCCESS_ACTION = '[DtpIde] Ide Delete Project Success';
export const UPDATE_CONSOLE = '[DtpIde] Update Console Action';
export const CLEAR_CONSOLE = '[DtpIde] Clear Console Action';
export const IDE_RUN_LOCAL_ACTION = '[DtpIde] Ide Run Local Action';
export const IDE_START_ACTION = '[DtpIde] Ide Start Action';
export const IDE_STOP_ACTION = '[DtpIde] Ide Stop Action';

export class IdeInitAction implements Action {
    readonly type = INIT_ACTION;
}

export class IdeInitSuccessAction implements Action {
    readonly type = INIT_SUCCESS_ACTION;
    constructor( public templates: Array<Template>, public projects : Array<Project2> ){}
}

export class IdeSelectProjectAction implements Action {
    readonly type = IDE_SELECT_PROJECT_ACTION;
    constructor( public projectName : string ){}
}

export class IdeNewProjectAction implements Action {
    readonly type = IDE_NEW_PROJECT_ACTION;
    constructor( public projectName: string, public templates : Array<Template> ){}
}

export class IdeNewProjectSuccessAction implements Action {
    readonly type = IDE_NEW_PROJECT_SUCCESS_ACTION;
    constructor( public project: Project2 ){}
}

export class IdeDeleteProjectAction implements Action {
    readonly type = IDE_DELETE_PROJECT_ACTION;
    constructor( public projectName: string ){}
}

export class IdeDeleteProjectSuccessAction implements Action {
    readonly type = IDE_DELETE_PROJECT_SUCCESS_ACTION;
    constructor( public projectName: string ){}
}

export class UpdateConsoleAction implements Action {
    readonly type = UPDATE_CONSOLE;
    constructor( public name: string, public data:string  ){}
}

export class ClearConsoleAction implements Action {
    readonly type = CLEAR_CONSOLE;
    constructor( public name: string){}
}

export class IdeRunLocalAction implements Action {
    readonly type = IDE_RUN_LOCAL_ACTION;
    constructor( public appName: string, public runLocal: boolean ){}
}

export class IdeStartAction implements Action {
    readonly type = IDE_START_ACTION;
}

export class IdeStopAction implements Action {
    readonly type = IDE_STOP_ACTION;
}


export type Actions = IdeInitAction
    | IdeInitSuccessAction
    | IdeSelectProjectAction
    | IdeNewProjectAction | IdeNewProjectSuccessAction
    | IdeDeleteProjectAction | IdeDeleteProjectSuccessAction
    | UpdateConsoleAction | ClearConsoleAction
    | IdeRunLocalAction
    | IdeStartAction | IdeStopAction
    ;