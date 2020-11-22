import { resultMemoize } from '@ngrx/store';
import * as LoginActions from '../actions/login-actions';

export interface State {
  loggedIn: boolean,
  username: string,
  password: string,
  domain: string,
  message: string
}

export const initialState: State = {
    loggedIn: undefined,
    username: null,
    password: null,
    domain: null,
    message: null
};

export function reducer(state: State = initialState, action: LoginActions.Actions ) {
    switch(action.type){
        case LoginActions.LOGIN_ACTION:
            let {username,password,domain}=action
            return Object.assign({},state,{username:username,password:password,domain:domain,message:null})
        case LoginActions.LOGIN_RESULT:
            return Object.assign({},state,{loggedIn:action.result.success,message:action.result.message})
        default: {
            return state;
        }
    }
}