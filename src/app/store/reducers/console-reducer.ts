import * as ConsoleActions from '../actions/console-action';
import {ConsoleBuffer} from '../../model/console-buffer'

export interface State {
  consoles: Array<ConsoleBuffer>
}

export const initialState: State = {
    consoles: []
};

export function reducer(state: State = initialState, action: ConsoleActions.Actions ) {
    switch(action.type){
        case ConsoleActions.CREATE_CONSOLE:{
            let consoles : Array<ConsoleBuffer> = state.consoles.filter(c=>true);
            consoles.push({appName:action.name,buffer:''})
            return Object.assign({},state,{consoles:consoles})
        }
        case ConsoleActions.DESTROY_CONSOLE:{
            let consoles : Array<ConsoleBuffer> = state.consoles.filter(c=>c.appName!=action.name);
            return Object.assign({},state,{consoles:consoles})
        }
        case ConsoleActions.UPDATE_CONSOLE:{
            let consoles : Array<ConsoleBuffer> = state.consoles.filter(c=>c.appName!=action.name);
            let console = state.consoles.find(c=>c.appName==action.name)
            let newBuffer: string = console.buffer;
            if( newBuffer.length > 0 ){
                newBuffer = newBuffer + '\n';
            }
            newBuffer = newBuffer + action.data;
            let newConsole : ConsoleBuffer = Object.assign({},console,{buffer:newBuffer});
            consoles.push(newConsole);
            return Object.assign({},state,{consoles:consoles})
        }
        case ConsoleActions.CLEAR_CONSOLE:{
            let consoles : Array<ConsoleBuffer> = state.consoles.filter(c=>c.appName!=action.name);
            let console = state.consoles.find(c=>c.appName==action.name)
            let newConsole : ConsoleBuffer = Object.assign({},console,{buffer:''});
            consoles.push(newConsole);
            return Object.assign({},state,{consoles:consoles})
        }
        default: {
            return state;
        }
    }
}