import { Action } from '@ngrx/store';
import { Project } from '../../model/project';

export const PROJECTS_LOAD_ACTION = '[DtpIde] Projects Load';
export const PROJECT_SELECTED_ACTION = '[DtpIde] Project Selected';
export const NEW_PROJECT_ACTION = '[DtpIde] New Project';
export const NEW_PROJECT_ACTION_SUCCESS = '[DtpIde] New Project Success';
export const NEW_PROJECT_ACTION_FAILED = '[DtpIde] New Project Failed';
export const PROJECT_DELETED_ACTION = '[DtpIde] Project Deleted';

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

    constructor( public project: Project ){}
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

    readonly type = PROJECT_DELETED_ACTION;

    constructor(){}
}

export type Actions = LoadProjectsAction | SelectProjectAction | NewProjectAction | NewProjectSuccessAction | NewProjectFailedAction | DeleteProjectAction;