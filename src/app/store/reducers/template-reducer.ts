import { Template } from 'src/app/model/template';
import * as TemplateActions from '../actions/template-actions';

export interface State {
  templates: Array<Template>
}

export const initialState: State = {
    templates: []
};

export function reducer(state: State = initialState, action: TemplateActions.Actions ) {
    switch(action.type){
        case TemplateActions.LOAD_TEMPLATES:
            return Object.assign({},state,{templates:action.templates})
        default: {
            return state;
        }
    }
}