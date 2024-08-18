import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  //後端入口
  baseUrl = environment.apiUrl;

  members:Member[] =[];
  memberCache = new Map();
  user: User | undefined;
  userParams: UserParams| undefined;


  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user=>{
        if(user){
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    if(this.user){
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

//連接後端接口 (api/users)
  getMembers(userParams:UserParams){
    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if(response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber,userParams.pageSize);
    
    params = params.append('minAge',userParams.minAge);
    params = params.append('maxAge',userParams.maxAge);
    params = params.append('gender',userParams.gender);
    params = params.append('orderBy',userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.baseUrl +'users',params).pipe(
      map(response =>{
        this.memberCache.set(Object.values(userParams).join('-'),response);
        return response;
      })
    )
  }

 

  
//連接後端接口 (api/users/username)
  getMember(username: string){
   const member = [...this.memberCache.values()]
      .reduce((arr,elem) => arr.concat(elem.result),[])
      .find((member: Member) => member.userName === username);

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

  private getPaginatedResult<T>(url:string ,params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        /*
        如果回應中包含 body，即伺服器回傳的實際資料，則將其賦值給 this.paginatedResult.result。
        this.paginatedResult 通常是一個包含 result 和 pagination 屬性的物件。
        */
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number,pageSize: number){
    let params = new HttpParams();

    params = params.append('pageNumber',pageNumber);
    params = params.append('pageSize',pageSize);

    return params
  }
}
