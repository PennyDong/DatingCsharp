import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs";
import { PaginatedResult } from "../_models/pagination";


export function getPaginatedResult<T>(url:string ,params: HttpParams, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;
    return http.get<T>(url, { observe: 'response', params }).pipe(
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

  export function getPaginationHeaders(pageNumber: number,pageSize: number){
    let params = new HttpParams();

    params = params.append('pageNumber',pageNumber);
    params = params.append('pageSize',pageSize);

    return params
  }