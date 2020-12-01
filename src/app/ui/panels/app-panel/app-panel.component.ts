import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Template } from 'src/app/model/template';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import { IdeBranchChangedAction } from '../../../store/actions/ide-actions'
import { IdeRunLocalAction } from 'src/app/store/actions/ide-actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-panel',
  templateUrl: './app-panel.component.html',
  styleUrls: ['./app-panel.component.scss']
})
export class AppPanelComponent implements OnInit, OnDestroy {

  @Input() template : Template;
  runLocal : boolean;
  fg: FormGroup;
  running: boolean;

  runningLocalAppsSubscription : Subscription;
  runningSubscription : Subscription;
  branchesSubscription: Subscription;
  selectedBranchSubscription: Subscription;
  branches: Array<string>;
  selectedBranch: string;

  constructor(
    private store: Store<fromRoot.State>,
  ) { }

  ngOnInit(): void {

    this.branches = [];

    this.runningLocalAppsSubscription = this.store.select(fromRoot.runLocalApps).subscribe(value=>{
      this.runLocal = value.indexOf(this.template.appName) != -1;
    })
    this.runningSubscription = this.store.select(fromRoot.running).subscribe(value=>{
      this.running = value
    })
    this.branchesSubscription = this.store.select(fromRoot.branches,this.template.appName).subscribe(value=>{
      if(value){
        this.branches = value;
      }
    })
    this.selectedBranchSubscription = this.store.select(fromRoot.selectedBranch,this.template.appName).subscribe(value=>{
      this.selectedBranch = value;
    })

    this.fg = new FormGroup({})
    if(this.template.appType=='springboot'){
      this.fg.addControl('server',new FormControl({value:this.template.remoteUrl,disabled:true}));
      this.fg.addControl('port',new FormControl({value:this.template.port,disabled:true}));
      this.fg.addControl('debugPort',new FormControl({value:this.template.debugPort,disabled:true}));
      this.fg.addControl('debugWait',new FormControl(false));
      this.fg.addControl('selectedBranch',new FormControl(undefined));
    }
  }

  ngOnDestroy(){
    this.runningLocalAppsSubscription?.unsubscribe();
    this.runningSubscription?.unsubscribe();
    this.branchesSubscription?.unsubscribe();
    this.selectedBranchSubscription?.unsubscribe();
  }

  onRunLocalChange(evt){
    this.store.dispatch(new IdeRunLocalAction(this.template.appName,evt.source.checked))
  }

  onDebugWaitChange(evt){
    this.fg.get('debugWait').setValue(evt.source.checked)
  }

  branchChange(evt: MatSelectChange){
    this.store.dispatch( new IdeBranchChangedAction( this.template.appName, evt.value) )
  }
}
