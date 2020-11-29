import * as ProjectActions from '../actions/project-actions';
import { Project } from '../../model/project';
import { Application } from 'src/app/model/application';

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
        case ProjectActions.BRANCH_CHANGED_SUCCESS_ACTION:{
            
            let targetP = state.projects.find(p=>p.name==action.projectName);
            let idxP = state.projects.indexOf(targetP);
            let targetApp = targetP.apps.find(a=>a.template.appName==action.appName);
            let idxA = targetP.apps.indexOf(targetApp);

            let projects : Array<Project> = [];
            state.projects.forEach(p=>projects.push(p));

            let apps : Array<Application> = [];
            targetP.apps.forEach(a=>apps.push(a));

            let newA = Object.assign({},targetApp,{currentBranch:action.branchName})
            apps.splice(idxA,1,newA)
            let newP = Object.assign({},targetP,{apps:apps})
            projects.splice(idxP,1,newP)

            return Object.assign({},state,{projects:projects});
         }
        default: {
            return state;
        }
    }
}