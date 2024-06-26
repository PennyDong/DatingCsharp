import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = 'https://localhost:5001/api/';

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http : HttpClient) { }

  login(model:any){
    return this.http.post<User>(this.baseUrl +'account/login',model).pipe(
      map((response:User)=>{
        const user =response;
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          //傳遞值告訴接下來的動作(保持登入狀態)
          this.currentUserSource.next(user);
        }
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl+'account/register',model).pipe(
      map(user =>{
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }
       
      })
    )
  }



  //定義一個方法設定當前用戶
  setCurrentUser(user:User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    //註銷用戶資訊
    this.currentUserSource.next(null);
  }
}
