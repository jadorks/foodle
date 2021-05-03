import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, from, Subject } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
const TOKEN_KEY = 'token'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  baseUrl: string = "https://foodlerest.herokuapp.com";
  token = '';

  constructor(private httpClient: HttpClient) { 
    this.loadToken();
  }

  async loadToken(){
    const token = await Storage.get({ key: TOKEN_KEY });
    if( token && token.value ){
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  public loginUser(email: string, password: string){
    let user = {
      "email": email,
      "password": password
    }
    return this.httpClient.post(this.baseUrl + '/users/login/', user).pipe(
      map((data: any) => data.key),
      switchMap(key => {
        return from(Storage.set({key: TOKEN_KEY, value: key}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  public registerUser(username: string, email: string, password: string, password2: string){
    let user = {
      "username": username,
      "email": email,
      "password1": password,
      "password2": password2
    };


    // return this.httpClient.post(this.baseUrl + '/users/register/', user).pipe(
    //   map((data: any) => data.key),
    //   switchMap(key => {
    //     return from(Storage.set({key: TOKEN_KEY, value: key}));
    //   }),
    //   tap(_ => {
    //     this.isAuthenticated.next(true);
    //   })
    // )

    return this.httpClient.post(this.baseUrl + '/users/register/', user).pipe(
      map((data: any) => {
        return data;
      })
    )

  }

  public logout(): Promise<void>{
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }


  public forgotPass(email: string){
    let user = {
      "email": email
    };

    return this.httpClient.post(this.baseUrl + '/password-reset/', user).pipe(
      map((data: any) => {
        return data;
      })
    )
    
  }


  public getCurrentUser(): Observable<any> {

    const httpOptions = {
      method: 'POST',
      headers: new HttpHeaders({
        Authorization: 'Token ' + this.token,
      }),
    };

    return this.httpClient.get(this.baseUrl + '/api/posts/user/', httpOptions).pipe(

      map((data: any) => {
        console.log(data[0]);
        return new User(data[0]);
      })
    )
  }

  public getOtherUser(id): Observable<any> {

    return this.httpClient.get(this.baseUrl + '/api/posts/users/' + id).pipe(

      map((data: any) => {
        return new User(data);
      })
    )
  }

  public searchUser(search): Observable<any> {

    return this.httpClient.get(this.baseUrl + '/api/posts/users/?search=' + search).pipe(
      map((data: any) => {
        return data.map((post) => {
          let old = post;
          old.date_posted = moment(new Date(Number(old.date_posted))).fromNow();
          return new Post(old);
        });
      })
    )
  }

  
}



export class User{
  id: any;
  email: any;
  username: any;
  posts: any;

  constructor( values: Object = {} ){
    Object.assign(this, values);
  }
}

export class Post{
  id: any;
  user: any;
  caption: any;
  recipe: any;
  image: any;
  date_posted: any;

  constructor( values: Object = {} ){
    Object.assign(this, values);
  }
}