import * as ProjectActions from '../actions/project-actions';
import { Project } from '../../model/project';

export interface State {
    selectedProjectIndex: number;
    projects: Array<Project>;
}

export const initialState: State = {
    selectedProjectIndex: -1,
    projects: [],
};

export function reducer(state: State = initialState, action: ProjectActions.Actions ) {
    switch(action.type){
        case ProjectActions.PROJECTS_LOAD_ACTION:
            return Object.assign({},state,{selectedProjectIndex:-1, projects: action.projects });
        case ProjectActions.PROJECT_CREATED_ACTION:
            let projects : Array<Project> = [];
            state.projects.forEach(p=>projects.push(p));
            projects.unshift(action.project)
            return Object.assign({},state,{selectedProjectIndex:0, projects: projects });
        case ProjectActions.PROJECT_DELETED_ACTION:
            if( state.selectedProjectIndex >= 0 ){
                let projects : Array<Project> = [];
                state.projects.forEach(p=>projects.push(p));
                projects.splice(state.selectedProjectIndex,1);
                return Object.assign({},state,{selectedProjectIndex:-1, projects: projects });
            }
            return state;
        case ProjectActions.PROJECT_SELECTED_ACTION:
            let idx = state.projects.indexOf(action.project);
            return Object.assign({},state,{selectedProjectIndex:idx });
        default: {
            return state;
        }
    }
}