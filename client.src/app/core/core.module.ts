import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import {AvatarModule} from "ngx-avatar";
import { SharedModule } from '../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as Component from './components';
import * as Guard from './guards';
import * as Service from './services';

import * as GlobalDirective from '@core/directives';
import * as GlobalService from '@core/services';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        SharedModule,
        // AvatarModule,
        ReactiveFormsModule,
    ],
    declarations: [
        Component.FooterComponent,

        Component.CustomMouseComponent,

        Component.AuthModalComponent,
        Component.HeaderComponent,
        Component.HeaderCurrenciesComponent,
        Component.HeaderLanguagesComponent,
        Component.HeaderSearchComponent,

        Component.NotFoundComponent,

        GlobalDirective.ScrollToDirective,
    ],
    exports: [
        Component.FooterComponent,
        Component.HeaderComponent,
        Component.AuthModalComponent,
        Component.CustomMouseComponent,

        Component.NotFoundComponent,

        GlobalDirective.ScrollToDirective,
    ],
    providers: [
        Guard.AuthGuard,

        GlobalService.ApiService,
        GlobalService.AuthService,
        GlobalService.BreadcrumbsService,
        GlobalService.ColorsService,
        GlobalService.ConfigService,
        GlobalService.CurrencyService,
        GlobalService.MetaService,
        GlobalService.PreloaderService,
        GlobalService.ScrollService,
        GlobalService.ScrollToService,
        GlobalService.StartupService,
        GlobalService.GeoService,

        Service.MenuService,
        Service.SearchService,
        Service.StaticPageService,
        Service.HeaderService,
        Service.StartupService,
        Service.ProjectService,
    ]
})
export class CoreModule {
    constructor(
        @Optional() @SkipSelf() parentModule: CoreModule
    ) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
    }
}
