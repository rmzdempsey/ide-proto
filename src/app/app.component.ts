import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { LoginPanelComponent } from './ui/dialogs/login-panel/login-panel.component';
import { Store } from '@ngrx/store';
import {IdeInitAction} from './store/actions/ide-actions'
import * as fromRoot from './store/reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(
    public dialog: MatDialog,
    private store: Store<fromRoot.State>
  ){}

  ngOnInit(): void {
    this.dialog.open(LoginPanelComponent, {
      width: '400px',
      disableClose:true
    });

    this.store.dispatch(new IdeInitAction() );
  }
}
