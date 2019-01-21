import { StartupService as GlobalStartupService, CurrencyService, ConfigService, AuthService, ApiService } from '@core/services';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { NgxPermissionsService } from 'ngx-permissions';
import { TranslateService } from '@ngx-translate/core';
import { MenuService } from './menu.service';
import { Menu } from '@core/models';

const startupMenu = makeStateKey('startupMenu');

@Injectable()
export class StartupService extends GlobalStartupService {

    constructor(
        protected currencyService: CurrencyService,
        protected configService: ConfigService,
        protected authService: AuthService,
        protected state: TransferState,
        protected permissionsService: NgxPermissionsService,
        protected translate: TranslateService,
        protected api: ApiService,
        private menuService: MenuService,
    ) {
        super(currencyService, configService, authService, state, permissionsService, translate, api);
    }

    loadMenu(): Promise<any> {
        const menus = this.state.get(startupMenu, null as any);
        if (menus) {
            this.menuService.setMenus(menus);
            return new Promise((resolve) => {
                resolve(menus);
            });
        } else {
            return this.menuService.load().toPromise().then((a: Menu[]) => {
                this.menuService.setMenus(a);
                this.state.set(startupMenu, a as any);
                return a;
            });
        }
    }
}
