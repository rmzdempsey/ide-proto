import * as IdeActions from '../actions/ide-actions';
import { Template } from '../../model/template';
import { Project2 } from '../../model/project';
import { ConsoleBuffer } from 'src/app/model/console-buffer';
import { BranchDetails } from 'src/app/model/branch-details';

export interface State {
  templates : Array<Template>;
  projects: Array<Project2>;
  selectedProject: string;
  running: boolean;
  runLocally : Array<string>;
  waitForDebug: Array<string>;
  consoles: Array<ConsoleBuffer>;
  branches: any;
  selectedBranch: any;
}

export const initialState: State = {
    templates: [],
    projects: [],
    selectedProject: null,
    running: false,
    runLocally : [],
    waitForDebug : [],
    consoles: [],
    branches: {},
    selectedBranch: {},
};

export function reducer(state: State = initialState, action: IdeActions.Actions ) {
    switch(action.type){
        case IdeActions.INIT_SUCCESS_ACTION:
            return Object.assign({},state,{templates:action.templates, projects : action.projects});
        case IdeActions.IDE_SELECT_PROJECT_ACTION:
            if( action.projectName ){
                let templates = getTemplatesForProject(state,action.projectName)
                return Object.assign({},state,{
                    selectedProject : action.projectName,
                    consoles: templates.map(t=>{ return {appName:t.appName,buffer:'ide buffer for ' + t.appName}})
                });
            }
            else{
                return Object.assign({},state,{
                    selectedProject : null,
                    running: false,
                    runLocally: [],
                    waitForDebug: [],
                    consoles: [],
                    branches:{},
                    selectedBranch:{},
                });
            }
        case IdeActions.IDE_NEW_PROJECT_SUCCESS_ACTION:
            let projects  = state.projects.filter(p=>true);
            projects.push(action.project);
            return Object.assign({},state,{
                projects : projects, 
                selectedProject: action.project.name, 
                running: false,
                runLocally: [],
                waitForDebug: [],
                consoles: action.project.templateNames.map(tn=>{ return {appName:tn,buffer:''}})
            });
        case IdeActions.IDE_DELETE_PROJECT_SUCCESS_ACTION:
            return Object.assign({},state,{
                projects:state.projects.filter(p=>p.name!=action.projectName), 
                selectedProject:null, consoles:[], branches: {},selectedBranch:{},
            });
        case IdeActions.UPDATE_CONSOLE:{
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
        case IdeActions.CLEAR_CONSOLE:{
            let consoles : Array<ConsoleBuffer> = state.consoles.filter(c=>c.appName!=action.name);
            let console = state.consoles.find(c=>c.appName==action.name)
            let newConsole : ConsoleBuffer = Object.assign({},console,{buffer:''});
            consoles.push(newConsole);
            return Object.assign({},state,{consoles:consoles})
        }
        case IdeActions.IDE_RUN_LOCAL_ACTION:{
            let apps = state.runLocally.filter(a=>a!=action.appName)
            if(action.runLocal) apps.push(action.appName)
            return Object.assign({},state,{ runLocally: apps });
        }
        case IdeActions.IDE_START_ACTION:
            return Object.assign({},state,{running:true})
        case IdeActions.IDE_STOP_ACTION:
            return Object.assign({},state,{running:false})
        case IdeActions.IDE_GET_BRANCHES_SUCCESS_ACTION:{
            let branches = Object.assign({},state.branches);
            branches[action.appName] = action.branches;
            return Object.assign({},state,{branches:branches});
        }
        case IdeActions.IDE_BRANCH_SELECTED_ACTION:{
            let selectedBranches = Object.assign({},state.selectedBranch);
            selectedBranches[action.appName] = action.branch;
            return Object.assign({},state,{selectedBranch:selectedBranches})
        }
        default: {
            return state;
        }
    }
}

function getTemplatesForProject(state:State, projectName: string){
    let templateNames = state.projects.find(p=>p.name==projectName).templateNames;
    return state.templates.filter(t=>templateNames.indexOf(t.appName)!=-1);
}