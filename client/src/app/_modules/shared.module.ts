import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';



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
    }) 
  ],
  exports:[
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    NgxSpinnerModule

  ]
})
export class SharedModule { }
