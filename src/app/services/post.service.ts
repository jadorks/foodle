import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from "./user.service";
import { Plugins } from "@capacitor/core";
import * as moment from 'moment';

const { Storage } = Plugins;
const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  token = '';
  baseURL = "https://foodlerest.herokuapp.com/api/posts";


  constructor(private http: HttpClient, private userService: UserService) { 
  }


  public createPost(formData){
    const httpOptions = {
      method: 'POST',
      headers: new HttpHeaders({
        Authorization: 'Token ' + this.userService.token,
      }),
    };

    return this.http.post(this.baseURL + '/create/', formData, httpOptions).pipe(
      map((data: any) => console.log(data))
    );


  }

  public getAllPosts(): Observable<any> {
    return this.http.get(this.baseURL).pipe(
      map((data: any) => {
        return data.map((post) => {
          let old = post;
          old.date_posted = moment(new Date(Number(old.date_posted))).fromNow();
          return new Post(old);
        });
      })
    )
  }

  public getPost(id: any): Observable<any> {
    return this.http.get(this.baseURL + '/view/' + id + '/').pipe(
      map((data: any) => {
        return new Post(data);
      }) 
    )
  }

  public updatePost(id: any, formData): Observable<any> {
    const httpOptions = {
      method: 'POST',
      headers: new HttpHeaders({
        Authorization: 'Token ' + this.userService.token,
      }),
    };

    return this.http.put(this.baseURL + '/update/' + id + '/', formData, httpOptions).pipe(
      map((data): any => {
        return data;
      })
    )
  }

  public deletePost(id:any): Observable<any> {

    return this.http.delete(this.baseURL + '/delete/' + id + '/').pipe(
      map((data): any => {
        return data;
      })
    )
  }

  public LikePost(id: any, action: any): Observable<any>{

    let interaction = new FormData();

    interaction.append('id', id);
    interaction.append('action', action);

    const httpOptions = {
      method: 'POST',
      headers: new HttpHeaders({
        Authorization: 'Token ' + this.token,
      }),
    };


    return this.http.post(this.baseURL + '/action/', interaction, httpOptions).pipe(
      map((data:any) => {
        return data;
      })
    )
  }

  public currentUserPosts(){
    console.log(this.userService.token);
    const httpOptions = {
      method: 'POST',
      headers: new HttpHeaders({
        Authorization: 'Token ' + this.userService.token,
      }),
    };

    return this.http.get(this.baseURL + '/users/posts/', httpOptions).pipe(
      map((data: any) => {
        return data.map((post) => {
          let old = post;
          old.date_posted = moment(new Date(Number(old.date_posted))).fromNow();
          return new Post(old);
        });
      })
    )
  }

  public otherUserPosts(id){

    return this.http.get(this.baseURL + '/users/posts/' + id + '/').pipe(
      map((data:any) => {
        return data.map((post) => {
          let old = post;
          old.date_posted = moment(new Date(Number(old.date_posted))).fromNow();
          return new Post(old);
        })
      })
    )
  }


  public findPost(search){
    return this.http.get(this.baseURL + '/?search=' + search).pipe(
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
