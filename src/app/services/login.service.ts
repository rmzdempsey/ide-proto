import { Injectable } from '@angular/core';
import { LoginResult } from '../model/loginResult';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  login(username:string, password: string, domain: string): Observable<LoginResult>{

    let request = of( {username:username,password:password,domain:domain});

    return request.pipe(
      delay(3000),
      map(r=>{
        if( Math.random()>0.2)
          return {success:true,token:'abc',message:null} as LoginResult
        else
          return {success:false,token:null,message:'Authentication Failed'} as LoginResult
      })
    )
  }
}
