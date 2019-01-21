import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { take } from 'rxjs/operators';
import { ApiService } from '@core/services';

@Injectable()
export class SearchService {

    constructor(private http: ApiService) {}

    search(query: string, queryCase: string = ''): Observable<any> {
        return this.http.post(`search${queryCase ? '/' + queryCase : ''}`, { query: query }).pipe(take(1));
    }

    quickLinks(query: string): Observable<any> {
        return this.http.post('search/quickLinks', { query: query }).pipe(take(1));
    }
}
