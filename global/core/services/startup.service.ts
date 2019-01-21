import { Injectable } from '@angular/core';
import { CurrencyService } from './currency.service';
import { ConfigService } from './config.service';
// import { MenuService } from './menu.service';
import { AuthService } from './auth.service';
// import {PreloaderService} from "./preloader.service";
import { Currency, Menu, Permission, Token } from '../models';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { NgxPermissionsService } from 'ngx-permissions';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from './api.service';
import { take } from 'rxjs/operators';

const startupUser = makeStateKey('startupUser');
const startupConfig = makeStateKey('startupConfig');
const startupCurrency = makeStateKey('startupCurrency');
const startupMenu = makeStateKey('startupMenu');
const startupLanguage = makeStateKey('startupLanguage');

@Injectable()
export class StartupService {

    protected storage = localStorage;

    constructor(
        protected currencyService: CurrencyService,
        protected configService: ConfigService,
        protected authService: AuthService,
        protected state: TransferState,
        protected permissionsService: NgxPermissionsService,
        protected translate: TranslateService,
        protected api: ApiService,
    ) { }

    loadUser(): Promise<any> {
        const user = this.state.get(startupUser, null as any);
        if (user) {
            this.authService.set(user);
            return new Promise((resolve) => {
                resolve(user);
            });
        } else {
            const token = <Token>JSON.parse(this.storage.getItem('token'));

            if (token) {
                return this.authService.loadUser().toPromise()
                    .then((data) => {
                        if (
                            JSON.stringify(token.user) === JSON.stringify(data['user']) &&
                            JSON.stringify(token.providers) === JSON.stringify(data['providers']) &&
                            JSON.stringify(token.favorites) === JSON.stringify(data['favorites']) &&
                            JSON.stringify(token.perms) === JSON.stringify(data['perms']) &&
                            JSON.stringify(token.roles) === JSON.stringify(data['roles'])
                        ) { return; }

                        this.authService.set(Object.assign(token, data));
                        this.state.set(startupUser, token as any);

                        return data;
                    }).catch(() => {
                        this.storage.setItem('token', null);
                        this.authService.set(null);
                        return null;
                    });
            } else {
                this.authService.set(null);
                return new Promise((resolve) => {
                    resolve(null);
                });
            }
        }
    }

    loadConfig(): Promise<any> {
        console.log('os: ' + this.configService.osKey);

        const config = this.state.get(startupConfig, null as any);
        if (config) {
            this.configService.setConfig(config);
            return new Promise((resolve) => {
                resolve(config);
            });
        } else {
            return this.configService.load().toPromise().then((a: Object) => {
                this.configService.setConfig(a);
                this.state.set(startupConfig, a as any);
                return a;
            });
        }
    }

    loadCurrencies(): Promise<any> {
        const currencies = this.state.get(startupCurrency, null as any);
        if (currencies) {
            this.currencyService.currencies = currencies;
            this.currencyService.setCurrent('' + this.storage.getItem('currency'));
            return new Promise((resolve) => {
                resolve(currencies);
            });
        } else {
            return this.currencyService.load().toPromise().then((a: Currency[]) => {
                this.currencyService.currencies = a;
                this.currencyService.setCurrent('' + this.storage.getItem('currency'));
                this.state.set(startupCurrency, a as any);

                return a;
            });
        }
    }

    // loadMenu(): Promise<any> {
    //     const menus = this.state.get(startupMenu, null as any);
    //     if (menus) {
    //         this.menuService.setMenus(menus);
    //         return new Promise((resolve) => {
    //             resolve(menus);
    //         });
    //     } else {
    //         return this.menuService.load().toPromise().then((a: Menu[]) => {
    //             this.menuService.setMenus(a);
    //             this.state.set(startupMenu, a as any);
    //             return a;
    //         });
    //     }
    // }

    loadLanguages(): Promise<any> {
        const languages = this.state.get(startupLanguage, null as any);
        if (languages) {
            this.translate.addLangs(languages);
            this.setLang();

            return new Promise((resolve) => {
                resolve(languages);
            });
        } else {
            return this.api.get('app/languages')
                .pipe(take(1))
                .toPromise()
                .then((ll: any[]) => {
                    this.translate.addLangs(ll);
                    this.state.set(startupLanguage, ll as any);
                    this.setLang();

                    return ll;
                });
        }
    }

    private setLang() {
        this.translate.setDefaultLang(
            this.translate.getBrowserLang() || this.translate.getBrowserCultureLang() || 'ru'
        );

        this.translate.use(
            this.storage.getItem('language') || this.translate.getBrowserLang() ||
            this.translate.getBrowserCultureLang() || 'ru'
        );
    }

    error(): void {
        // this.preloaderService.error();
    }
}
