import * as ProjectActions from '../actions/project-actions';
import { Project } from '../../model/project';

export interface State {
    selectedProjectIndex: number;
    projects: Array<Project>;
    status: boolean;
    errorMessage: string;
}

export const initialState: State = {
    selectedProjectIndex: -1,
    projects: [],
    status: undefined,
    errorMessage: undefined,
};

export function reducer(state: State = initialState, action: ProjectActions.Actions ) {
    switch(action.type){
        case ProjectActions.PROJECTS_LOAD_ACTION:
            return Object.assign({},state,{selectedProjectIndex:-1, projects: action.projects });
        case ProjectActions.NEW_PROJECT_ACTION:
            return Object.assign({},state);
        case ProjectActions.NEW_PROJECT_ACTION_SUCCESS:
            let projects : Array<Project> = [];
            state.projects.forEach(p=>projects.push(p));
            projects.unshift(action.project)
            return Object.assign({},state,{selectedProjectIndex:0, projects: projects });
        case ProjectActions.DELETE_PROJECT_SUCCESS_ACTION:
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
        case ProjectActions.LOAD_APP_BRANCHES_ACTION:
            let projectsWithBranches : Array<Project> = [];
            state.projects.forEach(p=>projectsWithBranches.push(p));
            projectsWithBranches[state.selectedProjectIndex] = action.project;
            return Object.assign({},state,{projects:projectsWithBranches});
        case ProjectActions.BRANCH_CHANGED_SUCCESS_ACTION:
            return state;
        default: {
            return state;
        }
    }
}