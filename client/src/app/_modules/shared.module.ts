import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';


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
    }) 
  ],
  exports:[
    BsDropdownModule,
    ToastrModule,
    TabsModule
  ]
})
export class SharedModule { }
