using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.ValueGeneration;

namespace API.Helpers
{
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser,MemberDto>()
                .ForMember(dest 
                => dest.PhotoUrl,
                 opt => opt.MapFrom(src => src.photos.FirstOrDefault(x =>x.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalcuateAge()));
            CreateMap<Photo,PhotoDto>();
            CreateMap<MemberUpdateDto,AppUser>();
            CreateMap<RegisterDto,AppUser>();

            CreateMap<Message,MessageDto>()
                .ForMember( d => d.SenderPhotoUrl, o => o.MapFrom( s => s.Sender.photos
                    .FirstOrDefault( x => x.IsMain).Url))
                .ForMember( d => d.RecipientPhotoUrl, o => o.MapFrom( s => s.Recipient.photos
                    .FirstOrDefault( x => x.IsMain).Url));
        }
    }
}