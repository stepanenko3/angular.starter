import { Subject, Observable, BehaviorSubject, throwError } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

import { Token, User, Permission, Role } from '../models';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';

import { NgxPermissionsService } from 'ngx-permissions';


@Injectable()
export class AuthService {

    constructor(
        private http: ApiService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private permissionsService: NgxPermissionsService,
    ) {
        // localStorage.removeItem('token');
        this._token = JSON.parse(localStorage.getItem('token'));
        this.tokenSubject = new BehaviorSubject(this._token);

        this.set(this._token);

        this._auth = !!this._token;
        this.subjectAuth = new BehaviorSubject<boolean>(this._auth);
    }

    get authSocialInProgress$(): Observable<boolean> {
        return this.authSocialInProgressSubject.asObservable();
    }

    get user(): User {
        return (this._auth) ? this._token.user : null;
    }

    get roles(): Role[] {
        return (this._auth) ? this._token.roles : null;
    }

    get perms(): Permission[] {
        return (this._auth) ? this._token.perms : null;
    }

    get auth(): boolean {
        return this._auth;
    }

    get auth$(): Observable<boolean> {
        return this.subjectAuth.asObservable();
    }

    get token(): Token {
        return this._token;
    }

    get token$(): Observable<Token> {
        return this.tokenSubject.asObservable();
    }

    get modal$(): Observable<boolean> {
        return this.subjectModalState.asObservable();
    }

    get reloadVerifiedStatus$(): Observable<any> {
        return this.http.get('user/verified').pipe(take(1));
    }

    get resendEmail$(): Observable<any> {
        return this.http.post('user/verified', null).pipe(take(1));
    }
    private _token: Token;
    private tokenSubject: BehaviorSubject<Token>;

    private _auth: boolean;
    private subjectAuth: BehaviorSubject<boolean>;

    private authSocialWindow: any;
    private authSocialTimer: any;
    private authSocialInProgressSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);

    private modalState = false;
    private subjectModalState = new BehaviorSubject<boolean>(this.modalState);
    public afterSend$ = new Subject<Token>();

    public beforeSend: Function = (data) => data;


    /**
     * Auth modal
     *
     */
    openModal() {
        if (this.auth) {
            return;
        }
        this.modalState = true;
        this.subjectModalState.next(this.modalState);
    }

    closeModal() {
        this.modalState = false;
        this.subjectModalState.next(this.modalState);
    }


    logout() {
        this.set(null);
    }

    register(user: User): Observable<Token> {
        return this.http.post('auth/register', this.beforeSend(user)).pipe(
            map((res: Token) => {
                if (res && res.access_token && res.user) {
                    this.set(res);
                } else {
                    throw throwError(res['message']);
                }
                return res;
            }),
            take(1)
        );
    }

    login(email: string, password: string): Observable<Token> {
        const postData = this.beforeSend({
            email: email,
            password: password,
        });

        return this.http.post('auth/login', postData)
            .pipe(
                map((res: Token) => {
                    if (res && res.access_token && res.user) {
                        this.set(res);
                    } else {
                        throw throwError(res['message']);
                    }
                    return res;
                }),
                take(1)
            );
    }

    set(token: Token) {
        if (token) {
            localStorage.setItem('token', JSON.stringify(token));

            this._auth = true;
            this._token = token;

            const perms: string[] = [];
            if (token.perms) {
                for (const perm of token.perms) {
                    perms.push(perm.name);
                }
            }

            this.permissionsService.loadPermissions(perms);

        } else {
            localStorage.removeItem('token');

            this.permissionsService.flushPermissions();

            this._auth = false;
            this._token = null;
        }

        if (this.tokenSubject) {
            this.tokenSubject.next(token);
        } else {
            this.tokenSubject = new BehaviorSubject(this._token);
        }

        if (this.subjectAuth) {
            this.subjectAuth.next(this._auth);
        } else {
            this.subjectAuth = new BehaviorSubject<boolean>(this._auth);
        }

        this.afterSend$.next(token);
    }

    authWithProvider(provider: string = 'facebook') {
        if (isPlatformBrowser(this.platformId)) {
            // this.authSocialInProgressSubject.next(true);
            this.authSocialWindow = window.open(
                this.http.getUrl('auth/' + provider),
                '', 'width=500,height=500');

            // this.authSocialTimer = setInterval(() => {
            //     if (this.authSocialWindow.closed) {
            //         clearInterval(this.authSocialTimer);
            //         this.authSocialInProgressSubject.next(false);
            //         this.authSocialWindow = null;
            //     }
            // }, 1000);
        }
    }

    startAuthWithProvider() {
        this.authSocialInProgressSubject.next(true);
    }

    endAuthWithProvider() {
        this.authSocialInProgressSubject.next(false);
    }

    loginWithProvider(provider: string, code: string): Observable<any> {
        return this.http.post(`auth/${provider}`, { code: code }).pipe(take(1));
    }

    deleteProvider(provider: string): Observable<any> {
        return this.http.delete(`auth/${provider}`).pipe(take(1));
    }

    loadUser(): Observable<any> {
        return this.http.get('user').pipe(take(1));
    }

    setAvatar(image: File): Observable<any> {
        const formData = new FormData();
        formData.append('avatar', image);

        const req = new HttpRequest('POST', 'user/avatar', formData, {
            headers: this.http.createHeader(),
            reportProgress: true,
        });

        return this.http.request(req);
    }

    removeAvatar(): Observable<any> {
        return this.http.delete('user/avatar').pipe(take(1));
    }

    changePassword(old_password: string, password: string): Observable<any> {
        return this.http.post('user/password', {
            old_password: old_password,
            password: password
        }).pipe(take(1));

    }

    update(data): Observable<any> {
        return this.http.post('user', data).pipe(take(1));
    }

    changeEmail(email: string, password: string): Observable<any> {
        return this.http.post('user/email', {
            email: email,
            password: password
        }).pipe(take(1));
    }
}
