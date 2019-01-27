import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Token } from '../models';

@Injectable()
export class ApiService {
    public host = '/api/v1/';
    public logout$ = new EventEmitter();

    constructor(
        private httpClient: HttpClient,
        private snackBar: MatSnackBar,
    ) {
        // if (window.location.hostname !== 'localhost') {
        //     this.host = 'https://' + window.location.hostname + '/api/v1/';
        // }
    }

    private getToken(): Token {
        // const token: Token = JSON.parse(localStorage.getItem('token'));
        // return token;

        return null;
    }

    getUrl(url: string): string {
        return this.host + url;
    }

    public createHeader(): HttpHeaders {
        const headers = new HttpHeaders();
        const token = this.getToken();

        headers.append('Content-Type', 'application/json;charset=utf-8');
        headers.append('X-CSRF-TOKEN', 'X-Requested-With');

        if (!!token) {
            headers.append('Authorization', `Bearer ${token.access_token}`);
            headers.append('Accept', 'application/json');
        }

        return headers;
    }

    getDataAsync<T>(url: string): Observable<T> {
        return this.httpClient.get<T>(this.host + url).pipe(
            map(data => {
                console.log('get:result', url, data);

                return data;
            }),
            catchError(this.handleError)
        );
    }

    postDataAsync<T, D>(url: string, object: D): Observable<T> {
        const headers = this.createHeader();
        return this.httpClient.post<T>(this.host + url, object, { headers: headers }).pipe(
            map(data => {
                return data;
            }),
            catchError(this.handleError)
        );
    }

    putDataAsync<T, D>(url: string, object: D): Observable<T> {
        const headers = this.createHeader();
        return this.httpClient.put<T>(this.host + url, object, { headers: headers }).pipe(
            map(data => {
                console.log('put:result', url, data);

                return data;
            }),
            catchError(this.handleError)
        );
    }

    deleteDataAsync<T, D>(url: string, object: D): Observable<T> {
        const headers = this.createHeader();
        return this.httpClient.delete(this.host + url, { headers: headers }).pipe(
            map(data => {
                console.log('delete:result', url, data);

                return data;
            }),
            catchError(this.handleError)
        );
    }


    public post(url: string, data): Observable<any> {
        const headers = this.createHeader();
        return this.httpClient.post(this.host + url, data, { headers: headers }).pipe(
            map(res => {
                return res;
            }),
            catchError(this.handleError)
        );
    }


    public postWithoutAuth(url: string, data): Observable<any> {
        return this.httpClient.post(this.host + url, data).pipe(
            map(res => {
                return res;
            }),
            catchError(this.handleError)
        );
    }

    public get(url: string, params = {}, options = {}): Observable<any> {
        const headers = this.createHeader();
        const rUrl = options['nonApi'] ? url : this.host + url;
        return this.httpClient.get(rUrl, Object.assign({ headers: headers }, params)).pipe(
            map(data => {
                return data;
            }),
            catchError(this.handleError)
        );
    }

    public request(request): Observable<any> {
        return this.httpClient.request(request);
    }

    public delete(url: string): Observable<any> {
        const headers = this.createHeader();
        return this.httpClient.delete(this.host + url, { headers: headers }).pipe(
            map(data => {
                return data;
            }),
            catchError(this.handleError)
        );
    }

    public put(url: string, data): Observable<any> {
        const headers = this.createHeader();
        return this.httpClient.put(this.host + url, data, { headers: headers }).pipe(
            map(res => {
                return res;
            }),
            catchError(this.handleError)
        );
    }

    public download(url: string): Observable<Blob> {
        console.log(this.host + url);
        return this.httpClient.get<Blob>(this.host + url, {
            responseType: 'blob' as 'json'
        });
    }




    private handleError = (error: HttpErrorResponse) => {

        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            if (error.status === 404) {
                console.warn('[404] not found');
            } else {
                console.warn('[' + error.status + '] status');
            }
        }

        if (error.status === 401) {
            this.logout$.emit();
        }

        if (error.status === 429) {
            if (error.headers.has('x-ratelimit-reset')) {
                const time = new Date(+error.headers.get('x-ratelimit-reset') * 1000);
                const seconds = time.getSeconds();
                let minutes = time.getMinutes();
                let hours = time.getHours();
                if (seconds > 0) { minutes++; }
                if (minutes === 60) {
                    hours++;
                    minutes = 0;
                }

                this.snackBar.open(
                    `Слишком много запоросов. Попробуйте в ${
                    (hours < 10) ? '0' + hours : hours
                    }:${
                    (minutes < 10) ? '0' + minutes : minutes
                    }`
                    , 'Ок', { duration: 5000 });
            }
        }

        return of(null);
    }
}
