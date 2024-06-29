import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  //當export對象不是class時，使用inject()
  const accountService=inject(AccountService);
  const toastr = inject(ToastrService);

  return accountService.currentUser$.pipe(
    map(user=>{
      if(user)return true;
      else{
        toastr.error('you shall not pass!');
        return false;
      }
    })
  )
};
