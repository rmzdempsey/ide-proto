import { Injectable,NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {Project} from '../model/project';
import { Store } from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import * as ProjectActions from '../store/actions/project-actions';
import * as IdeActions from '../store/actions/ide-actions';
import {UpdateConsoleAction} from '../store/actions/ide-actions';

const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  projectsSubject = new BehaviorSubject<Project[]>([]);

  constructor(
    private store: Store<fromRoot.State>,
    private zone: NgZone,
  ) { 

    electron.ipcRenderer.on('getProjectsResponse', (event, projects) => {
      this.projectsSubject.next(projects);
    });

    electron.ipcRenderer.on('createProjectResponse', (event, project) => {
      this.zone.run(()=>{
        this.store.dispatch(new IdeActions.IdeNewProjectSuccessAction(project));
      })
    });

    electron.ipcRenderer.on('deleteProjectResponse', (event, projectName) => {
      this.store.dispatch(new IdeActions.IdeDeleteProjectSuccessAction(projectName));
      
    });

    electron.ipcRenderer.on('updateConsoleStdOut', (event, name, data) => {
      this.store.dispatch(new UpdateConsoleAction(name,data));
      
    });

    electron.ipcRenderer.on('updateConsoleStdErr', (event, name, data) => {
      this.store.dispatch(new UpdateConsoleAction(name,data));
    });

    electron.ipcRenderer.on('appBranchInfo', (event, project)=>{
      this.zone.run(()=>{
        this.store.dispatch(new ProjectActions.LoadAppBranchesAction(project));
      })
    });

    electron.ipcRenderer.on('initialiseIdeSuccess', (event, templates, projects )=>{
      this.zone.run(()=>{
        this.store.dispatch(new IdeActions.IdeInitSuccessAction(templates,projects));
      })
    });

    electron.ipcRenderer.on('branchChangedSuccess',(event, projectName, appName, branchName )=>{
      this.zone.run(()=>{
        this.store.dispatch(new ProjectActions.BranchChangeSuccessAction(projectName, appName, branchName ));
      })
    })
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

  changeBranch(project:Project, appName: string, branchName: string ){
    electron.ipcRenderer.send('changeBranch', project.name, appName, branchName );
  }

  initialiseIde(){
    electron.ipcRenderer.send('initialiseIde');
  }
}
