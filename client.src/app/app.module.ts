import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import localeUk from '@angular/common/locales/uk';
import localeRu from '@angular/common/locales/ru';
import localeEn from '@angular/common/locales/en';

import 'hammerjs';

import { SharedModule } from './shared';
import { CoreModule } from './core';

import { AppComponent } from './app.component';

import { TokenInterceptor } from '@core/token.interceptor';
import { ErrorInterceptor } from '@core/error.interceptor';
import { StartupService } from './core/services';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routing';

registerLocaleData(localeUk);
registerLocaleData(localeRu);
registerLocaleData(localeEn);

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        ShareButtonsModule.withConfig({
            include: ['facebook', 'telegram', 'twitter', 'whatsapp', 'messenger', 'email'],
            exclude: [],
            theme: 'modern-dark',
            autoSetMeta: true,
        }),
        NgProgressModule,
        NgxPermissionsModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    providers: [
        // {
        //     provide: APP_INITIALIZER, useFactory: (startupService: StartupService) => {
        //         return () => Promise.resolve()
        //             .then(() => startupService.loadConfig())
        //             .then(() => startupService.loadUser())
        //             .then(() => startupService.loadCurrencies())
        //             .then(() => startupService.loadMenu())
        //             .catch(() => startupService.error());
        //     }, deps: [StartupService], multi: true
        // },
        // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
