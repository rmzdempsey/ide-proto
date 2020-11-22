import { ActionReducerMap } from '@ngrx/store';
import * as fromLogin from './login-reducer';
import * as fromProject from './project-reducer';
import * as fromTemplate from './template-reducer';
import { createSelector } from '@ngrx/store';

export interface State {
    login : fromLogin.State;
    project : fromProject.State;
    template: fromTemplate.State;
}

export const reducers : ActionReducerMap<State> = {
    login : fromLogin.reducer,
    project : fromProject.reducer,
    template : fromTemplate.reducer,
}

export const loggedIn = (state:State)=> state.login.loggedIn;
export const loggedInStatus = createSelector((state:State)=> state.login,(l)=>{
    return { loggedIn: l.loggedIn, message: l.message }
})

export const selectedProject = (state:State)=> {
    let s = state.project;
    return s.selectedProjectIndex <0 ? null : s.projects[s.selectedProjectIndex];
}

export const projectCount = (state:State)=> state.project.projects.length
export const projects = (state:State)=> state.project.projects

export const templates = (state:State)=> state.template.templates