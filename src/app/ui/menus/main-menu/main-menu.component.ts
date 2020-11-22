import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import { Subscription } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { NewProjectComponent } from '../../dialogs/new-project/new-project.component';
import { OpenProjectComponent } from '../../dialogs/open-project/open-project.component';
import { SelectProjectAction, DeleteProjectAction } from '../../../store/actions/project-actions';

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

  constructor(
    private store: Store<fromRoot.State>,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.disableClose = true;
    this.selectedProjectSubscription = this.store.select(fromRoot.selectedProject).subscribe(
      value=>{
        this.disableClose = (value == null || value == undefined)
        this.disableDelete = this.disableClose;
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
    const dialogRef = this.dialog.open(NewProjectComponent, {
      width: '250px',
      disableClose:true,
      data: {}
    });
  }

  openProject(){
    const dialogRef = this.dialog.open(OpenProjectComponent, {
      width: '250px',
      disableClose:true,
      data: {}
    });
  }

  closeProject(){
    this.store.dispatch(new SelectProjectAction(null))
  }

  deleteProject(){
    this.store.dispatch(new DeleteProjectAction())
  }

}
