import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {Template} from '../model/template';
import {Project} from '../model/project';
import { Store } from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import * as TemplateActions from '../store/actions/template-actions';
import * as ProjectActions from '../store/actions/project-actions';
import {ConsoleUpdateAction} from '../store/actions/console-action';

const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  templatesSubject = new BehaviorSubject<Template[]>([]);
  projectsSubject = new BehaviorSubject<Project[]>([]);

  constructor(
    private store: Store<fromRoot.State>,
    
  ) { 

    electron.ipcRenderer.on('getTemplatesResponse', (event, templates) => {
      this.templatesSubject.next(templates);
    });

    electron.ipcRenderer.on('getProjectsResponse', (event, projects) => {
      this.projectsSubject.next(projects);
    });

    electron.ipcRenderer.on('createProjectResponse', (event, project) => {
      this.store.dispatch(new ProjectActions.NewProjectSuccessAction(project));
      
    });

    electron.ipcRenderer.on('createProjectErrorResponse', (event, reason) => {
      this.store.dispatch(new ProjectActions.NewProjectFailedAction(reason));
      
    });

    electron.ipcRenderer.on('deleteProjectResponse', (event, projectName) => {
      this.store.dispatch(new ProjectActions.DeleteProjectSuccessAction());
      
    });

    electron.ipcRenderer.on('deleteProjectErrorResponse', (event, projectName, reason) => {
      this.store.dispatch(new ProjectActions.DeleteProjectFailedAction(reason));
      
    });

    electron.ipcRenderer.on('updateConsoleStdOut', (event, name, data) => {
      this.store.dispatch(new ConsoleUpdateAction({name:name,line:data}));
      
    });

    electron.ipcRenderer.on('updateConsoleStdErr', (event, name, data) => {
      this.store.dispatch(new ConsoleUpdateAction({name:name,line:data}));
    });

    electron.ipcRenderer.on('appBranchInfo', (event, appName, branches, currentBranch)=>{
      this.store.dispatch(new ProjectActions.LoadAppBranchesAction(appName,branches,currentBranch));
    });

    this.templatesSubject.subscribe((value) => {
      let templates : Array<Template> = value;
      this.store.dispatch(new TemplateActions.LoadTemplatesAction(templates));
    });

    this.projectsSubject.subscribe((value) => {
      let projects : Array<Project> = value;
      this.store.dispatch(new ProjectActions.LoadProjectsAction(projects));
    });

  }

  getTemplates() : Observable<Template[]>{
    this.getTemplatesFromElectron();
    return this.templatesSubject;
  }

  getTemplatesFromElectron(){
    electron.ipcRenderer.send('getTemplates');
  }

  getProjects() : Observable<Project[]>{
    this.getProjectsFromElectron();
    return this.projectsSubject;
  }

  getProjectsFromElectron(){
    electron.ipcRenderer.send('getProjects');
  }


  newProject(projectName:string, templates:any){
    electron.ipcRenderer.send('createProject', projectName, templates );
  }

  deleteProject(projectName:string){
    electron.ipcRenderer.send('deleteProject', projectName );
  }

  cloneApps(project:Project){
    electron.ipcRenderer.send('cloneApps', project );
  }
}
