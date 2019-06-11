import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IFilter } from '../models/filter.model';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  public requestApi(type: string, filter?: IFilter): Observable<any> {
    return this.http.get(`${environment.backUrl}/${type}${this.filterUtils(filter)}`, {
      observe: 'response',
    }).pipe(map(res => res.body));
  }

  private filterUtils(filter: IFilter) {
    if (filter) {
      return `?name=${filter.name}&filter=${filter.filter}`;
    } else {
      return '';
    }
  }
}
