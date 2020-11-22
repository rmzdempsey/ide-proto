
import { Action } from '@ngrx/store';
import { Template } from 'src/app/model/template';

export const LOAD_TEMPLATES = '[DtpIde] Load Templates';

export class LoadTemplatesAction implements Action {

    readonly type = LOAD_TEMPLATES;

    constructor( public templates: Array<Template>){}
}

export type Actions = LoadTemplatesAction;