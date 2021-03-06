import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators'; 

import { AuthRespone, Usuario } from '../interface/auth.interface';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrl; 
  private _usuario!: Usuario; 
  constructor(private http: HttpClient) { }
  get usuario(){
    return {...this._usuario}; 
  }

  login(email: string, password:string) {
    const url = `${this.baseUrl}/auth`; 
    const body = {email,password}
    return this.http.post<AuthRespone>(url,body)
      .pipe(
        tap(resp=>{
          console.log(resp); 
          if(resp.ok){
            localStorage.setItem('token', resp.token!); 
            this._usuario={
              name:resp.name!,
              uid:resp.uid!
            }
          }
        }),
        map(resp => resp.ok),
        catchError(error =>of(error.error.msg))
      ); 
  }

  validarToken(){
    const url = `${this.baseUrl}/auth/renew`; 
    const headers = new HttpHeaders().set(
      'x-token', localStorage.getItem('token') || ''
    ); 
    return this.http.get(url, {headers}); 
  }
}
