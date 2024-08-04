import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  //後端入口
  baseUrl = environment.apiUrl;

  members:Member[] =[];

  constructor(private http: HttpClient) { }

//連接後端接口 (api/users)
  getMembers(){
    //檢查服務中是否有已經儲存的用戶訊息
    if(this.members.length > 0) return of(this.members);

    
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members =>{
        //將查詢到的用戶訊息儲存起來
        this.members = members;
        return members;
      })
    );//,this.getHttpOptions()
  }
//連接後端接口 (api/users/username)
  getMember(username: string){
    //const member =this.members.find(x => x.userName)
    const member = this.members.find(x => x.userName === username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl+'users/'+username);//,this.getHttpOptions()
  }

  updateMember(member:Member){
    return this.http.put(this.baseUrl+'users',member).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member};
      })
    );
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

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' +photoId,{});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
