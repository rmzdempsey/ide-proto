import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import { Subscription } from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { IdeStartAction, IdeStopAction } from 'src/app/store/actions/ide-actions';

@Component({
  selector: 'app-project-panel',
  templateUrl: './project-panel.component.html',
  styleUrls: ['./project-panel.component.scss']
})
export class ProjectPanelComponent implements OnInit, OnDestroy {

  isLoggedIn:boolean;
  selectedProject: any;
  loginSubscription : Subscription;
  selectedProjectSubscription : Subscription;
  isRunningSubscription : Subscription;
  runningLocalAppsSubscription : Subscription;
  isRunning: boolean;
  runLocalCount: number;

  cards: Array<any>;

  constructor(
    private store: Store<fromRoot.State>,
    ) { }

  ngOnInit(): void {

    this.runLocalCount = 0;

    this.loginSubscription = this.store.select(fromRoot.loggedIn).subscribe(value=>{
      if(value){
        this.isLoggedIn = true;
      }
      else{
        this.isLoggedIn=false;
      }
    }); 
    this.selectedProjectSubscription = this.store.select(fromRoot.selectedProject).subscribe(
      value=>{
        this.selectedProject = value;
        if(this.selectedProject){
          this.cards = [];
          this.selectedProject.templates.forEach(t => {
            this.cards.push(t);
          });
        }
      }
      ); 
    this.isRunningSubscription = this.store.select(fromRoot.running).subscribe(value=>{
      this.isRunning = value;
    })
    this.runningLocalAppsSubscription = this.store.select(fromRoot.runLocalApps).subscribe(value=>{
      this.runLocalCount = value.length;
    })
  }

  ngOnDestroy(): void{
    this.loginSubscription?.unsubscribe();
    this.selectedProjectSubscription?.unsubscribe();
    this.isRunningSubscription?.unsubscribe();
    this.runningLocalAppsSubscription?.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

  playClicked(){
    this.store.dispatch(new IdeStartAction())
  }

  stopClicked(){
    this.store.dispatch(new IdeStopAction())
  }

}
