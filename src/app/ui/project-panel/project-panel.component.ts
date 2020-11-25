import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/reducers';
import { Subscription } from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {CONSOLE_UPDATE_ACTION} from '../../store/actions/console-action';
import {CloneAppsAction} from '../../store/actions/project-actions';
import { Actions, ofType } from '@ngrx/effects';

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

  consoleSubscription: Subscription;

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: Actions,
    private cdr : ChangeDetectorRef
    ) { }

  ngOnInit(): void {

    this.consoleSubscription = this.actions$.pipe(
      ofType(CONSOLE_UPDATE_ACTION),
    ).subscribe(value=>{
      this.appendToConsole(value['data']['name'],value['data']['line'])
      this.cdr.detectChanges()
    });

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
            
            this.cards.push({fg:new FormGroup({}),template:app.template});
          });
          this.cards.forEach(c => {
            
            if(c.template.appType=='springboot'){
              c.fg.addControl('runLocal',new FormControl(false));
              c.fg.addControl('server',new FormControl({value:c.template.remoteUrl,disabled:true}));
              c.fg.addControl('port',new FormControl({value:c.template.port,disabled:true}));
              c.fg.addControl('debugPort',new FormControl({value:c.template.debugPort,disabled:true}));
              c.fg.addControl('debugWait',new FormControl(false));
            }
            
          });
          this.store.dispatch(new CloneAppsAction(this.selectedProject))
        }
      }
      ); 

      
  }

  ngOnDestroy(): void{
    this.loginSubscription?.unsubscribe();
    this.selectedProjectSubscription?.unsubscribe();
    this.consoleSubscription?.unsubscribe();
  }

  onRunLocalChange(evt,fg){
    fg.get('runLocal').value = evt.source.checked
  }

  onDebugWaitChange(evt,fg){
    fg.get('debugWait').value = evt.source.checked
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

  appendToConsole(appName: string, line : string ){
    
    let txt = document.getElementById(appName);
    txt['value'] = txt['value'] + line
    txt.scrollTop = txt.scrollHeight;
  }

}
