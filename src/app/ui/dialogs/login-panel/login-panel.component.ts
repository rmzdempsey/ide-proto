import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as LoginActions from '../../../store/actions/login-actions';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import {MatDialogRef} from '@angular/material/dialog';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss']
})
export class LoginPanelComponent implements OnInit, OnDestroy {

  fg: FormGroup;

  domains: Array<string> = ['INTRANET', 'CLIENT'];
  loginSubscription : Subscription;
  loggingIn: boolean;
  loginError : string = ' ';

  constructor(
    public dialogRef: MatDialogRef<LoginPanelComponent>,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.loginSubscription = this.store.select(fromRoot.loggedInStatus).subscribe(value=>{
      if( value.loggedIn != undefined ){
        this.loggingIn = false;
        if(value.loggedIn){
          this.dialogRef.close()
        }
        else{
          this.loginError = value.message;
        }
      }
    }); 

    this.fg = new FormGroup({
      username: new FormControl('',[Validators.required,Validators.minLength(8)]),
      password: new FormControl('',[Validators.required,Validators.minLength(8)]),
      domain: new FormControl('INTRANET'),
    });
  }

  ngOnDestroy(){
    this.loginSubscription?.unsubscribe();
  }

  loginClicked(){
      this.loginError = " ";
      this.loggingIn = true;
      this.store.dispatch(
        new LoginActions.LoginAction( this.get('username'), this.get('password'), this.get('domain'))
      );
  }

  disableLogin():boolean{
    return this.loggingIn || !(this.fg && this.fg.valid);
  }

  get(fieldName:string): string{
    return this.fg.get(fieldName).value;
  }

}
