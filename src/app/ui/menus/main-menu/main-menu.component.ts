import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import { Subscription } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { NewProjectComponent } from '../../dialogs/new-project/new-project.component';
import { OpenProjectComponent } from '../../dialogs/open-project/open-project.component';
import { SelectProjectAction, DeleteProjectAction } from '../../../store/actions/project-actions';
import { Project } from 'src/app/model/project';
import { Actions, ofType } from '@ngrx/effects';
import { DELETE_PROJECT_FAILURE_ACTION, DELETE_PROJECT_SUCCESS_ACTION} from '../../../store/actions/project-actions'
import { DestroyConsoleAction } from 'src/app/store/actions/console-action';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {

  selectedProjectSubscription : Subscription;
  projectCountSubscription : Subscription;
  disableClose: boolean;
  disableOpen: boolean;
  disableDelete: boolean;
  selectedProject: Project;

  onSuccessSubscription: Subscription;
  onErrorSubscription: Subscription;

  constructor(
    private store: Store<fromRoot.State>,
    public dialog: MatDialog,
    private actions$: Actions,
    private cdr : ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.onSuccessSubscription = this.actions$.pipe(
      ofType(DELETE_PROJECT_SUCCESS_ACTION),
    ).subscribe(project=>{
      this.cdr.detectChanges()
    });

    this.onErrorSubscription = this.actions$.pipe(
      ofType(DELETE_PROJECT_FAILURE_ACTION),
    ).subscribe(message=>{
      this.cdr.detectChanges()
    });

    this.disableClose = true;
    this.selectedProjectSubscription = this.store.select(fromRoot.selectedProject).subscribe(
      value=>{
        this.disableClose = (value == null || value == undefined)
        this.disableDelete = this.disableClose;
        this.selectedProject = value;
      }
      ); 
    
    this.disableOpen = true;
    this.projectCountSubscription = this.store.select(fromRoot.projectCount).subscribe(
      value=>this.disableOpen = (value == null || value == undefined || value == 0 )
      ); 
  }

  ngOnDestroy(): void{
    if(this.selectedProjectSubscription)
      this.selectedProjectSubscription.unsubscribe();
    if(this.projectCountSubscription)
      this.projectCountSubscription.unsubscribe();
  }

  newProject(){
    this.dialog.open(NewProjectComponent, {
      width: '400px',
      disableClose:true
    });
  }

  openProject(){
    this.dialog.open(OpenProjectComponent, {
      width: '250px',
      disableClose:true
    });
    
  }

  closeProject(){
    this.selectedProject.apps.forEach(a=>{
      this.store.dispatch(new DestroyConsoleAction(a.template.appName))
    })
    this.store.dispatch(new SelectProjectAction(null))
  }

  deleteProject(){
    this.selectedProject.apps.forEach(a=>{
      this.store.dispatch(new DestroyConsoleAction(a.template.appName))
    })
    this.store.dispatch(new DeleteProjectAction(this.selectedProject.name))
  }

}
