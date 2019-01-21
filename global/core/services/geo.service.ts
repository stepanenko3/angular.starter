import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable()
export class GeoService {

    public countries$: Observable<any> = this.http.get('app/countries')
        .pipe(shareReplay(1), take(1));

    constructor(private http: ApiService) { }

    getCities(countryID: number, query?: string): Observable<any> {
        return this.http.get('app/cities', {
            params: {
                countryID: '' + countryID,
                query: query || ''
            }
        }).pipe(take(1));
    }
}
