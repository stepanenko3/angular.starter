import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { AuthService } from './services';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private snackBar: MatSnackBar;

    constructor(private auth: AuthService, inj: Injector) {
        setTimeout(() => (this.snackBar = inj.get(MatSnackBar)));
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(this.handleError));
    }

    public handleError = (error: Response) => {
        switch (error.status) {
            case 401:
                this.auth.logout();
                this.defaulError();
                break;

            case 429:
                if (error.headers.has('x-ratelimit-reset')) {
                    const time = new Date(
                        +error.headers.get('x-ratelimit-reset') * 1000
                    );
                    const seconds = time.getSeconds();
                    let minutes = time.getMinutes();
                    let hours = time.getHours();
                    if (seconds > 0) {
                        minutes++;
                    }
                    if (minutes === 60) {
                        hours++;
                        minutes = 0;
                    }

                    this.snackBar.open(
                        `Слишком много запоросов. Попробуйте в ${
                            hours < 10 ? '0' + hours : hours
                        }:${minutes < 10 ? '0' + minutes : minutes}`,
                        'Ок',
                        { duration: 5000 }
                    );
                } else {
                    this.defaulError();
                }
                break;

            default:
                this.defaulError();
        }

        return throwError(error);
    }

    defaulError() {
        this.snackBar.open(`Возникла ошибка, попробуйте позже`, null, { duration: 3000 });
    }
}
