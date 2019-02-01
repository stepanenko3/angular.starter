import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import {AvatarModule} from "ngx-avatar";
import { SharedModule } from '../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as Component from './components';
import * as Service from './services';

import {ApiService} from '@core/services/api.service';
import {MetaService} from '@core/services/meta.service';
import {PreloaderService} from '@core/services/preloader.service';
import {ScrollService} from '@core/services/scroll.service';
import {ScrollToService} from '@core/services/scrollTo.service';

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
        Component.HeaderComponent,

        Component.NotFoundComponent,
    ],
    exports: [
        Component.HeaderComponent,

        Component.NotFoundComponent,
    ],
    providers: [
        ApiService,
        MetaService,
        PreloaderService,
        ScrollService,
        ScrollToService,

        Service.HeaderService,
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
