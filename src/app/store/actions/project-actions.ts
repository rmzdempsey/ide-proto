import { Action } from '@ngrx/store';
import { Project } from '../../model/project';
export const LOAD_APP_BRANCHES_ACTION = '[DtpIde] Load App Branches Action';
export const BRANCH_CHANGED_ACTION = '[DtpIde] Branch Changed Action';
export const BRANCH_CHANGED_SUCCESS_ACTION = '[DtpIde] Branch Changed Success Action';

export class LoadAppBranchesAction implements Action {

    readonly type = LOAD_APP_BRANCHES_ACTION

    constructor(public project: Project ){}
}

export class BranchChangedAction implements Action {

    readonly type = BRANCH_CHANGED_ACTION;

    constructor(public project: Project, public appName: string, public branchName: string ){}
}

export class BranchChangeSuccessAction implements Action {

    readonly type = BRANCH_CHANGED_SUCCESS_ACTION;

    constructor(public projectName: string, public appName: string, public branchName: string ){}
}

export type Actions = (
    LoadAppBranchesAction 
    | BranchChangedAction 
    | BranchChangeSuccessAction );