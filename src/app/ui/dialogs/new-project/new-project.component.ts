import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import {MatDialogRef} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { Template } from 'src/app/model/template';
import { IdeNewProjectAction } from 'src/app/store/actions/ide-actions';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  templatesSubscription : Subscription;
  projectNamesSubscription : Subscription;
  
  templates: Array<Template>;
  projectNames: Array<string>;
  errorMessage: string = " ";

  constructor(
    public dialogRef: MatDialogRef<NewProjectComponent>,
    private store: Store<fromRoot.State>,
  ) { }

  ngOnInit(): void {
    this.templates = [];
    this.projectNames = [];

    this.fg = new FormGroup({
      projectName: new FormControl('',[Validators.required]),
      selectedTemplates: new FormArray([],Validators.required)
    });

    this.templatesSubscription = this.store.select(fromRoot.templates).subscribe(value=>{
      this.templates = value
    })

    this.projectNamesSubscription = this.store.select(fromRoot.projectNames).subscribe(value=>{
      this.projectNames = value;
    }); 
  }

  onCheckChange(event) {
    const formArray: FormArray = this.fg.get('selectedTemplates') as FormArray;

    this.clearErrorMessage();
  
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
    this.templatesSubscription?.unsubscribe()
    this.projectNamesSubscription?.unsubscribe()
  }

  disableOk():boolean{
    if( this.fg.valid ){
      let projectName : string = this.fg.get('projectName').value;
      if( projectName.trim().length > 0 ){
        if( this.projectNames.indexOf(projectName.trim())==-1){
          return false;
        }
      }
    }
    return true;
  }

  okClicked(){
    this.clearErrorMessage();
    if(this.fg.valid){
      let action : IdeNewProjectAction = new IdeNewProjectAction(
        this.fg.get('projectName').value, 
        this.fg.get('selectedTemplates').value
      );
      this.store.dispatch( action )
      this.dialogRef.close()
    }
  }

  nameChanged(evt){
    this.clearErrorMessage();
  }

  cancelClicked(){
    this.dialogRef.close()
  }

  clearErrorMessage(){
    this.errorMessage = "";
    return this.errorMessage;
  }
}
