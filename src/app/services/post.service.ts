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
  baseURL = "http://127.0.0.1:8000/api/posts";


  constructor(private http: HttpClient, private userService: UserService) { 
    this.loadToken();
  }

  async loadToken(){
    const tk = await Storage.get({ key: TOKEN_KEY });
    if(tk && tk.value){
      this.token = tk.value;
    }
  }

  public createPost(formData){
    const httpOptions = {
      method: 'POST',
      headers: new HttpHeaders({
        Authorization: 'Token ' + this.token,
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
