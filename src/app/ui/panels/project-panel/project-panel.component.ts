import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import { Subscription } from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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

  cards: Array<any>;

  constructor(
    private store: Store<fromRoot.State>,
    ) { }

  ngOnInit(): void {

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
          this.selectedProject.apps.forEach(app => {
            this.cards.push(app);
          });
        }
      }
      ); 

  }

  ngOnDestroy(): void{
    this.loginSubscription?.unsubscribe();
    this.selectedProjectSubscription?.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

}
