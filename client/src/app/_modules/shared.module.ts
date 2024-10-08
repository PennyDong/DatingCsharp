import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimeagoModule } from "ngx-timeago";
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    //第三方套件 toastr
    ToastrModule.forRoot({
      //改變提示框位置
      positionClass:'toast-bottom-right'
    }),
    //過場動畫
    NgxSpinnerModule.forRoot({
      type:'ball-scale-multiple'
    }),
    //上傳套件
    FileUploadModule
    //日期選擇器
    ,BsDatepickerModule.forRoot()
    //分頁模組
    ,PaginationModule
    ,ButtonsModule.forRoot()
    //顯示用戶幾分鐘前上線
    ,TimeagoModule.forRoot()
  ],
  exports:[
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    NgxSpinnerModule,
    FileUploadModule,
    BsDatepickerModule,
    PaginationModule,
    ButtonsModule,
    TimeagoModule
  ]
})
export class SharedModule { }
