import { Component,OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any ={}

  //紀錄是否登入
  //loggedIn = false;
  //currentUser$ :Observable<User|null>= of(null);

  constructor(public accountService:AccountService
    ,private router:Router
    ,private toastr:ToastrService){}

  //網頁初始會時
  ngOnInit(): void {
    //取得當前用戶資訊
    //this.getCurrentUser();
    //this.currentUser$ = this.accountService.currentUsers$;
  }

  // getCurrentUser(){
  //   this.accountService.currentUsers$.subscribe({
  //     // !! 表示將用戶對象轉換成boolean，如果有用戶對象為true，沒有則false
  //     next:user=>this.loggedIn = !!user,
  //     error:error => console.log(error)
  //   })
  // }

  //登入
  login(){
    this.accountService.login(this.model).subscribe({
      next: response=>{
        //this.loggedIn =true;
        this.router.navigateByUrl('/members');
      },
      error:error=>this.toastr.error(error.error)
    })
  }

  //登出
  logout(){
    this.accountService.logout();
    //this.loggedIn = false;
    this.router.navigateByUrl('/');
  }
}
