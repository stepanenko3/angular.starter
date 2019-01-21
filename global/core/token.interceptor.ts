import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Token } from './models';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: Token = JSON.parse(localStorage.getItem('token'));
        const headers = { 'X-CSRF-TOKEN': 'X-Requested-With' };

        if (!!token) {
            headers['Authorization'] = `Bearer ${token.access_token}`;
            if (!request.headers.has('Accept')) {
                headers['Accept'] = 'application/json';
            }
        }

        request = request.clone({ setHeaders: headers });

        // const url = 'http://shop.local';
        // request = request.clone({
        //     url: url + request.url
        // });

        return next.handle(request);
    }
}
