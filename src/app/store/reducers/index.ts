import { ActionReducerMap } from '@ngrx/store';
import * as fromLogin from './login-reducer';
import * as fromProject from './project-reducer';
import * as fromError from './error-reducer';
import * as fromIde from './ide-reducer';
import { createSelector } from '@ngrx/store';

export interface State {
    login : fromLogin.State;
    project : fromProject.State;
    error: fromError.State;
    ide: fromIde.State;
}

export const reducers : ActionReducerMap<State> = {
    login : fromLogin.reducer,
    project : fromProject.reducer,
    error: fromError.reducer,
    ide: fromIde.reducer,
}

export const projectCount = (state:State)=> state.ide.projects.length
export const projectNames = (state:State)=> state.ide.projects.map(p=>p.name) 
export const templates = (state:State)=> state.ide.templates
export const running = (state:State)=> state.ide.running;
export const runLocalApps = (state:State)=> state.ide.runLocally;
export const consoles = (state:State, appName: string)=> state.ide.consoles.find(c=>c.appName==appName)?.buffer
export const branches = (state:State, appName: string)=> state.ide.branches[appName]
export const selectedBranch = (state:State, appName: string)=> state.ide.selectedBranch[appName]


export const selectedProject = (state:State)=> {
    if( state.ide.selectedProject ){
        return {
            name: state.ide.selectedProject,
            templates: state.ide.projects.find(p=>p.name==state.ide.selectedProject).templateNames.map(tn=>state.ide.templates.find(t=>t.appName==tn)), 
        }
    }
    else
        return null;
}

export const loggedIn = (state:State)=> state.login.loggedIn;
export const loggedInStatus = createSelector((state:State)=> state.login,(l)=>{
    return { loggedIn: l.loggedIn, message: l.message }
})

export const projects = (state:State)=> state.project.projects

export const errorMessage = (state:State)=> state.error.message





