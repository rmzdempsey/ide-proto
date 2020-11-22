import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import {MatDialogRef} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { Template } from 'src/app/model/template';
import { Project } from 'src/app/model/project';
import {NewProjectAction,SelectProjectAction} from '../../../store/actions/project-actions'
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  templatesSubscription : Subscription;
  templates: Array<Template>;
  projectsSubscription : Subscription;
  saving: boolean;

  constructor(
    private configService : ConfigService,
    public dialogRef: MatDialogRef<NewProjectComponent>,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.saving = false;
    this.templates = [];
    this.fg = new FormGroup({
      projectName: new FormControl('',[Validators.required]),
      selectedTemplates: new FormArray([])
    });

    this.templatesSubscription = this.store.select(fromRoot.templates).subscribe(value=>{
      this.templates = value;
    }); 

    this.projectsSubscription = this.store.select(fromRoot.projects).subscribe(value=>{
      if( this.saving){
        let projects :Array<Project> = value;
        if( projects ){
          let newProject:Project = projects.find(p=>p.name==this.fg.get('projectName').value)
          if( newProject ){
            this.store.dispatch( new SelectProjectAction(newProject) );
            this.dialogRef.close();
          }
        }
        this.saving = false;
      }
    }); 

    

    
  }

  onCheckChange(event) {
    const formArray: FormArray = this.fg.get('selectedTemplates') as FormArray;
  
    if(event.checked){
      formArray.push(new FormControl(event.source.value));
    }
    else{
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.source.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ngOnDestroy(): void {
    if(this.templatesSubscription)
      this.templatesSubscription.unsubscribe();
    if(this.projectsSubscription)
      this.projectsSubscription.unsubscribe();
  }

  okClicked(){
    if(this.fg.valid){
      this.saving = true;

      this.configService.newProject(
        this.fg.get('projectName').value,
        this.fg.get('selectedTemplates').value
      )
      // this.store.dispatch( new NewProjectAction({
      //   name: this.fg.get('projectName').value,
      //   templates : this.fg.get('selectedProjects').value
      // }) )
    }
  }

  cancelClicked(){
    this.dialogRef.close()
  }
}
