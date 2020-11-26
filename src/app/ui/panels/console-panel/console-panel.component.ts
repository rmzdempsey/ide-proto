import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Application } from 'src/app/model/application';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import {CONSOLE_UPDATE_ACTION} from '../../../store/actions/console-action';

@Component({
  selector: 'app-console-panel',
  templateUrl: './console-panel.component.html',
  styleUrls: ['./console-panel.component.scss']
})
export class ConsolePanelComponent implements OnInit {

  @Input() app : Application;
  txt: string;
  consoleSubscription: Subscription;

  constructor(
    private actions$: Actions,
    private cdr : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.txt = ''

    this.consoleSubscription = this.actions$.pipe(
      ofType(CONSOLE_UPDATE_ACTION),
    ).subscribe(value=>{
      if( value['data']['name']==this.app.template.appName ){
        this.append(value['data']['line'])
        this.cdr.detectChanges()
      }
    });
  }

  append(line : string ){

    this.txt = this.txt + line
    
    // let txt = document.getElementById(appName);
    // txt['value'] = txt['value'] + line
    // txt.scrollTop = txt.scrollHeight;
  }

}
