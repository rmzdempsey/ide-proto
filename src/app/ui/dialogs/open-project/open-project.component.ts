import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import {MatDialogRef} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Project } from 'src/app/model/project';
import {SelectProjectAction} from '../../../store/actions/project-actions'
import { ConfigService } from 'src/app/services/config.service';
import { CreateConsoleAction } from 'src/app/store/actions/console-action';

@Component({
  selector: 'app-open-project',
  templateUrl: './open-project.component.html',
  styleUrls: ['./open-project.component.scss']
})
export class OpenProjectComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  projectsSubscription : Subscription;
  projects: Array<Project>;

  constructor(
    private configService : ConfigService,
    public dialogRef: MatDialogRef<OpenProjectComponent>,
    private store: Store<fromRoot.State>
    ) { }

  ngOnInit(): void {
    this.projects = [];
    this.projectsSubscription = this.store.select(fromRoot.projects).subscribe(value=>{
      this.projects = value;
    }); 

    this.fg = new FormGroup({
      selectedProject: new FormControl('',[Validators.required]),
    });

    this.configService.getProjects();
  }

  ngOnDestroy(): void {
    if(this.projectsSubscription)
      this.projectsSubscription.unsubscribe();
  }

  okClicked(){
    if(this.fg.valid){
      this.dialogRef.close()
      let project : Project = this.fg.get('selectedProject').value;
      this.store.dispatch( new SelectProjectAction(project) )
      project.apps.forEach(a=>{
        this.store.dispatch(new CreateConsoleAction(a.template.appName))
      })
    }
  }

  cancelClicked(){
    this.dialogRef.close()
  }

}
