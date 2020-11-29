import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import {MatDialogRef} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { IdeSelectProjectAction } from 'src/app/store/actions/ide-actions';

@Component({
  selector: 'app-open-project',
  templateUrl: './open-project.component.html',
  styleUrls: ['./open-project.component.scss']
})
export class OpenProjectComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  projectsSubscription : Subscription;
  projects: Array<string>;

  constructor(
    public dialogRef: MatDialogRef<OpenProjectComponent>,
    private store: Store<fromRoot.State>
    ) { }

  ngOnInit(): void {
    this.projects = [];
    this.projectsSubscription = this.store.select(fromRoot.projectNames).subscribe(value=>{
      this.projects = value;
    }); 

    this.fg = new FormGroup({
      selectedProject: new FormControl('',[Validators.required]),
    });
  }

  ngOnDestroy(): void {
    if(this.projectsSubscription)
      this.projectsSubscription.unsubscribe();
  }

  okClicked(){
    if(this.fg.valid){
      this.dialogRef.close()
      let projectName : string = this.fg.get('selectedProject').value;
      this.store.dispatch( new IdeSelectProjectAction(projectName));
    }
  }

  cancelClicked(){
    this.dialogRef.close()
  }

}
