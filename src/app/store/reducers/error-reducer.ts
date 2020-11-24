import * as ErrorActions from '../actions/error-action';

export interface State {
  message: string
}

export const initialState: State = {
    message: null
};

export function reducer(state: State = initialState, action: ErrorActions.Actions ) {
    switch(action.type){
        case ErrorActions.CLEAR_ERROR_ACTION:
            return Object.assign({},state,{message:null})
        case ErrorActions.ERROR_ACTION:
            return Object.assign({},state,{message:action.message})
        default: {
            return state;
        }
    }
}