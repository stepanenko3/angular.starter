import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgProgressModule } from '@ngx-progressbar/core';

import localeUk from '@angular/common/locales/uk';
import localeRu from '@angular/common/locales/ru';
import localeEn from '@angular/common/locales/en';

import 'hammerjs';

import { SharedModule } from './shared';
import { CoreModule } from './core';

import { AppComponent } from './app.component';

import { ErrorInterceptor } from '@core/error.interceptor';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routing';

registerLocaleData(localeUk);
registerLocaleData(localeRu);
registerLocaleData(localeEn);

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'my-app' }),
        ServiceWorkerModule.register('/ngsw-worker.js', {
            enabled: environment.production
        }),
        BrowserTransferStateModule,
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,

        RouterModule.forRoot(appRoutes),
        SharedModule,
        CoreModule,

        MatSnackBarModule,

        NgProgressModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
