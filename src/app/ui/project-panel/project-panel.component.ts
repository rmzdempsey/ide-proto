import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/reducers';
import { Subscription } from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Template} from '../../model/template';

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

  //fgs: Array<FormGroup>;
  cards: Array<any>;

  //openState: Array<boolean> = [];

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
        //this.openState = [];
        //this.fgs = [];
        if(this.selectedProject){
          this.cards = [];
          this.selectedProject.templates.forEach(t => {
            //this.openState.push(false);
            this.cards.push({fg:new FormGroup({}),template:t});
          });
          this.cards.forEach(c => {
            
            if(c.template.appType=='springboot'){
              c.fg.addControl('runLocal',new FormControl(false));
              c.fg.addControl('server',new FormControl({value:c.template.remoteUrl,disabled:true}));
              c.fg.addControl('port',new FormControl({value:c.template.port,disabled:true}));
              c.fg.addControl('debugPort',new FormControl({value:c.template.debugPort,disabled:true}));
              c.fg.addControl('debugWait',new FormControl(false));
            }
            // this.fgs.push(fg)
          });
        }
      }
      ); 

      
  }

  ngOnDestroy(): void{
    if( this.loginSubscription )
      this.loginSubscription.unsubscribe();
    if(this.selectedProjectSubscription)
      this.selectedProjectSubscription.unsubscribe();
  }

  // panelOpenStates(idx:number, b : boolean ){
  //   if( idx < this.openState.length) this.openState[idx]=b;
  // }

  // panelOpenStatesValue(idx:number):boolean{
  //   if( idx < this.openState.length) return this.openState[idx];
  //   return false;
  // }

  onRunLocalChange(evt,fg){
    fg.get('runLocal').value = evt.source.checked
  }

  onDebugWaitChange(evt,fg){
    fg.get('debugWait').value = evt.source.checked
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

}
