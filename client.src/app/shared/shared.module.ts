import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {LoadingComponent} from '@shared/components/loading.component';
import {EmptyComponent} from '@shared/components/empty.component';
import {SafePipe} from '@shared/pipes/safe.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        LazyLoadImageModule,
    ],
    declarations: [
        LoadingComponent,
        EmptyComponent,
        SafePipe,
    ],
    exports: [
        LazyLoadImageModule,
        LoadingComponent,
        EmptyComponent,
        SafePipe,
    ],
    providers: [
        SafePipe,
    ]
})
export class SharedModule { }
