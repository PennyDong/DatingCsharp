import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail-list',
  standalone:true,
  templateUrl: './member-detail-list.component.html',
  styleUrls: ['./member-detail-list.component.css'],
  imports:[CommonModule,TabsModule,GalleryModule]
})
export class MemberDetailListComponent implements OnInit {

    member: Member | undefined;
    images: GalleryItem[] =[];

    constructor(private memberService:MembersService,private route:ActivatedRoute){}

    ngOnInit(): void {
      this.loadMember();
    }

    loadMember(){
      const username = this.route.snapshot.paramMap.get('username');
      if(!username)return;
      this.memberService.getMember(username).subscribe({
        next: member => {
          this.member = member,
          this.getImages()
        }
      })
    }

    getImages(){
      if(!this.member)return;
      for(const photo of this.member?.photos){
        this.images.push(new ImageItem({src: photo.url, thumb:photo.url}));
       
      }
    }
}
