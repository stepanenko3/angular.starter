import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { take } from 'rxjs/operators';
import { ApiService } from '@core/services';

@Injectable()
export class StaticPageService {

    constructor(private http: ApiService) { }

    getStaticPage(alt: string): Observable<any> {
        return this.http.get(`static-pages/${alt}`).pipe(take(1));
    }
}
