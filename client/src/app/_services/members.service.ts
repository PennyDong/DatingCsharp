import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  //後端入口
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

//連接後端接口 (api/users)
  getMembers(){
    return this.http.get<Member[]>(this.baseUrl + 'users');//,this.getHttpOptions()
  }
//連接後端接口 (api/users/username)
  getMember(username: string){
    return this.http.get<Member>(this.baseUrl+'users/'+username);//,this.getHttpOptions()
  }


//取得username 和 token
  // getHttpOptions(){
  //   const userString = localStorage.getItem('user');
  //   if(!userString) return;

  //   const user = JSON.parse(userString);
  //   return{
  //     headers:new HttpHeaders({
  //       Authorization: 'Bearer '+user.token
  //     })
  //   }
  // }
}
