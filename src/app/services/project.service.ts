import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projectsSubject = new BehaviorSubject<any>([]);

  constructor() { 
    electron.ipcRenderer.on('getProjectsResponse', (event, projects, selectedProject) => {
      this.projectsSubject.next({projects:projects,selectedProject:selectedProject});
    });
  }
  getProjects(){
    electron.ipcRenderer.send('getProjects');
  }

  newProject(projectName:string, templates:any){
    electron.ipcRenderer.send('createProject', projectName, templates );
  }

  deleteProject(projectName:string){
    electron.ipcRenderer.send('deleteProject', projectName );
  }

  manuallySelectedProject(project){
    electron.ipcRenderer.send('selectProject', project );
  }
}
