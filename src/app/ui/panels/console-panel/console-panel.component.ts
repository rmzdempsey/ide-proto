import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Application } from 'src/app/model/application';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';

@Component({
  selector: 'app-console-panel',
  templateUrl: './console-panel.component.html',
  styleUrls: ['./console-panel.component.scss']
})
export class ConsolePanelComponent implements OnInit, OnDestroy {

  @Input() app : Application;
  txt: string;
  consoleSubscription: Subscription;
  
  constructor(
    private store: Store<fromRoot.State>,
  ) { }

  ngOnInit(): void {
    this.txt = ''

    this.consoleSubscription = this.store.select(fromRoot.consoles,this.app.template.appName).subscribe(value=>{
      if(value){
        this.txt = value;
      }
    }); 
  }

  ngOnDestroy(){
    this.consoleSubscription?.unsubscribe();
  }

}
