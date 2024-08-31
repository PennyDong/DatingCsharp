import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/_models/member';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';

@Component({
  selector: 'app-member-detail-list',
  standalone:true,
  templateUrl: './member-detail-list.component.html',
  styleUrls: ['./member-detail-list.component.css'],
  imports:[CommonModule,TabsModule,GalleryModule,TimeagoModule,MemberMessagesComponent]
})
export class MemberDetailListComponent implements OnInit {
    @ViewChild('memberTabs', {static:true}) //設為true時，成員卡片會立即建構
    memberTabs?: TabsetComponent
    member: Member = {} as Member;
    images: GalleryItem[] =[];
    activeTab?: TabDirective;
    messages: Message[] = [];

    constructor(private memberService:MembersService,private route:ActivatedRoute
      ,private messageService: MessageService){}

    ngOnInit(): void {
      this.route.data.subscribe({
        next: data => this.member = data['member']
      })

      this.route.queryParams.subscribe({
        next: params =>{
          params['tab'] && this.selectTab(params['Tab'])
        }
      })

      this.getImages()
    }

    onTabActivated(data: TabDirective){
      this.activeTab = data;
      if(this.activeTab.heading === 'Messages'){
        this.loadMessages();
      }
    }

    loadMessages(){
      if(this.member){
        this.messageService.getMessageThread(this.member.userName).subscribe({
          next: messages => this.messages = messages
        })
      }
    }

    // loadMember(){
    //   const username = this.route.snapshot.paramMap.get('username');
    //   if(!username)return;
    //   this.memberService.getMember(username).subscribe({
    //     next: member => {
    //       this.member = member,
    //       this.getImages()
    //     }
    //   })
    // }

    getImages(){
      if(!this.member)return;
      for(const photo of this.member?.photos){
        this.images.push(new ImageItem({src: photo.url, thumb:photo.url}));
       
      }
    }

    selectTab(heading: string){
      if(this.memberTabs){
        this.memberTabs.tabs.find(x=>x.heading === heading)!.active = true;
      }
    }
}
