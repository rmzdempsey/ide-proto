import { Action } from '@ngrx/store';
import { Project } from '../../model/project';

export const PROJECTS_LOAD_ACTION = '[DtpIde] Projects Load';
export const PROJECT_SELECTED_ACTION = '[DtpIde] Project Selected';
export const PROJECT_CREATED_ACTION = '[DtpIde] Project Created';
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

    readonly type = PROJECT_CREATED_ACTION;

    constructor( public project: Project ){}
}

export class DeleteProjectAction implements Action {

    readonly type = PROJECT_DELETED_ACTION;

    constructor(){}
}

export type Actions = LoadProjectsAction | SelectProjectAction | NewProjectAction | DeleteProjectAction;