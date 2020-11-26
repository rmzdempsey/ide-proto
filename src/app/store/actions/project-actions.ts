import { Action } from '@ngrx/store';
import { Project } from '../../model/project';
import { Template } from '../../model/template';

export const PROJECTS_LOAD_ACTION = '[DtpIde] Projects Load';
export const PROJECT_SELECTED_ACTION = '[DtpIde] Project Selected';
export const NEW_PROJECT_ACTION = '[DtpIde] New Project';

export const NEW_PROJECT_ACTION_SUCCESS = '[DtpIde] New Project Success';
export const NEW_PROJECT_ACTION_FAILED = '[DtpIde] New Project Failed';
export const DELETE_PROJECT_ACTION = '[DtpIde] Project Deleted';
export const DELETE_PROJECT_SUCCESS_ACTION = '[DtpIde] Project Deleted Success';
export const DELETE_PROJECT_FAILURE_ACTION = '[DtpIde] Project Deleted Failed';

export const CLONE_APPS_ACTION = '[DtpIde] Clone Apps Action';
export const LOAD_APP_BRANCHES_ACTION = '[DtpIde] Load App Branches Action';

export class LoadProjectsAction implements Action {

    readonly type = PROJECTS_LOAD_ACTION;

    constructor( public projects: Array<Project> ){}
}

export class SelectProjectAction implements Action {

    readonly type = PROJECT_SELECTED_ACTION;

    constructor( public project: Project ){}
}

export class NewProjectAction implements Action {

    readonly type = NEW_PROJECT_ACTION;

    constructor( public projectName: string, public templates: Array<Template> ){}
}

export class NewProjectSuccessAction implements Action {
    readonly type = NEW_PROJECT_ACTION_SUCCESS;

    constructor( public project: Project ){}
}

export class NewProjectFailedAction implements Action {

    readonly type = NEW_PROJECT_ACTION_FAILED

    constructor( public reason: string ){}
}

export class DeleteProjectAction implements Action {

    readonly type = DELETE_PROJECT_ACTION;

    constructor(public projectName : string ){}
}

export class DeleteProjectSuccessAction implements Action {

    readonly type = DELETE_PROJECT_SUCCESS_ACTION;

    constructor(){}
}

export class DeleteProjectFailedAction implements Action {

    readonly type = DELETE_PROJECT_SUCCESS_ACTION;

    constructor(public reason: string ){}
}

export class CloneAppsAction implements Action {

    readonly type = CLONE_APPS_ACTION;

    constructor(public project: Project ){}
}

export class LoadAppBranchesAction implements Action {

    readonly type = LOAD_APP_BRANCHES_ACTION

    constructor(public project: Project ){}
}

export type Actions = LoadProjectsAction | SelectProjectAction | NewProjectAction | NewProjectSuccessAction | NewProjectFailedAction | DeleteProjectAction | DeleteProjectSuccessAction | DeleteProjectFailedAction | LoadAppBranchesAction;