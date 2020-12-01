import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import { Subscription } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { NewProjectComponent } from '../../dialogs/new-project/new-project.component';
import { OpenProjectComponent } from '../../dialogs/open-project/open-project.component';
import { Actions } from '@ngrx/effects';
import { IdeDeleteProjectAction, IdeSelectProjectAction } from 'src/app/store/actions/ide-actions';

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
  selectedProject: any;

  constructor(
    private store: Store<fromRoot.State>,
    public dialog: MatDialog,
    private actions$: Actions,
    private cdr : ChangeDetectorRef
  ) { }

  ngOnInit(): void {

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
    this.store.dispatch(new IdeSelectProjectAction(null))
  }

  deleteProject(){
    this.store.dispatch(new IdeDeleteProjectAction(this.selectedProject.name))
  }

}
