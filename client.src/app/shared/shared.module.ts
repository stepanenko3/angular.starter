import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import * as GlobalComponent from '@shared/components';
import * as GlobalDirective from '@shared/directives';
import * as GlobalPipe from '@shared/pipes';
import * as GlobalService from '@shared/services';

// import * as Component from './components';
// import * as Directive from './directives';
// import * as Validator from './validators';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { BarRatingModule } from 'ngx-bar-rating';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { DpDatePickerModule } from 'ng2-date-picker';
import { TranslateModule } from '@ngx-translate/core';
import { NouisliderModule } from 'ng2-nouislider';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AvatarModule } from '@shared/components/avatar';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        LazyLoadImageModule,
        TextMaskModule,
        FilterPipeModule,
        NgxPaginationModule,
        BarRatingModule,
        AvatarModule,
        FilterPipeModule,
        // ScrollbarModule,
        ImageCropperModule,
        TranslateModule,

        MatDatepickerModule,
        MatNativeDateModule,
        DpDatePickerModule,

        NouisliderModule,
    ],
    declarations: [
        GlobalComponent.BreadcrumbsComponent,
        GlobalComponent.CounterInputComponent,
        GlobalComponent.LoadingComponent,
        GlobalComponent.EmptyComponent,
        GlobalComponent.SearchInputComponent,
        GlobalComponent.Slide360Component,
        GlobalComponent.StickyComponent,
        GlobalComponent.TabsetComponent,
        GlobalComponent.RoundProgressComponent,
        GlobalComponent.ClapsComponent,
        GlobalComponent.IntlTelComponent,
        GlobalComponent.PullToRefreshComponent,

        GlobalComponent.CarouselComponent,
        GlobalComponent.CarouselArrowComponent,
        GlobalComponent.CarouselDotsComponent,
        GlobalComponent.CarouselItemComponent,


        GlobalDirective.AutofocusDirective,
        GlobalDirective.AutosizeDirective,
        GlobalDirective.ClickOutsideDirective,
        GlobalDirective.DropdownDirective,
        GlobalDirective.DropdownOpenDirective,
        GlobalDirective.DropdownNotClosableZoneDirective,
        GlobalDirective.StickyDirective,
        GlobalDirective.TabContentDirective,
        GlobalDirective.TabHeaderDirective,
        GlobalDirective.ZoomDirective,
        GlobalDirective.InViewportDirective,
        GlobalDirective.SwiperDirective,
        GlobalDirective.CarouselLazyLoadDirective,

        GlobalDirective.CCCvcFormatDirective,
        GlobalDirective.CCExpiryFormatDirective,
        GlobalDirective.CCNumberFormatDirective,

        GlobalPipe.HumanizePipe,
        GlobalPipe.RoundPipe,
        GlobalPipe.SafePipe,
        GlobalPipe.ICurrencyPipe,
        GlobalPipe.JoinPipe,
        GlobalPipe.ReversePipe,
        GlobalPipe.FindValuePipe,
        GlobalPipe.ValueByLangPipe,
        GlobalPipe.TranslitPipe,
    ],
    exports: [
        LazyLoadImageModule,
        TextMaskModule,
        FilterPipeModule,
        NgxPaginationModule,
        BarRatingModule,
        ShareButtonsModule,
        AvatarModule,
        FilterPipeModule,
        // ScrollbarModule,
        ImageCropperModule,
        NgxPermissionsModule,

        MatDatepickerModule,
        MatNativeDateModule,
        DpDatePickerModule,
        TranslateModule,

        NouisliderModule,

        GlobalComponent.BreadcrumbsComponent,
        GlobalComponent.CounterInputComponent,
        GlobalComponent.LoadingComponent,
        GlobalComponent.EmptyComponent,
        GlobalComponent.SearchInputComponent,
        GlobalComponent.Slide360Component,
        GlobalComponent.StickyComponent,
        GlobalComponent.TabsetComponent,
        GlobalComponent.RoundProgressComponent,
        GlobalComponent.ClapsComponent,
        GlobalComponent.IntlTelComponent,
        GlobalComponent.PullToRefreshComponent,

        GlobalComponent.CarouselComponent,
        GlobalComponent.CarouselItemComponent,

        GlobalDirective.AutofocusDirective,
        GlobalDirective.AutosizeDirective,
        GlobalDirective.ClickOutsideDirective,
        GlobalDirective.DropdownDirective,
        GlobalDirective.DropdownOpenDirective,
        GlobalDirective.DropdownNotClosableZoneDirective,
        GlobalDirective.StickyDirective,
        GlobalDirective.TabContentDirective,
        GlobalDirective.TabHeaderDirective,
        GlobalDirective.ZoomDirective,
        GlobalDirective.InViewportDirective,
        GlobalDirective.SwiperDirective,
        GlobalDirective.CarouselLazyLoadDirective,

        GlobalDirective.CCCvcFormatDirective,
        GlobalDirective.CCExpiryFormatDirective,
        GlobalDirective.CCNumberFormatDirective,

        GlobalPipe.HumanizePipe,
        GlobalPipe.RoundPipe,
        GlobalPipe.SafePipe,
        GlobalPipe.ICurrencyPipe,
        GlobalPipe.JoinPipe,
        GlobalPipe.ReversePipe,
        GlobalPipe.FindValuePipe,
        GlobalPipe.ValueByLangPipe,
        GlobalPipe.TranslitPipe,
    ],
    providers: [
        GlobalPipe.HumanizePipe,
        GlobalPipe.RoundPipe,
        GlobalPipe.SafePipe,
        GlobalPipe.ICurrencyPipe,
        GlobalPipe.JoinPipe,
        GlobalPipe.ReversePipe,
        GlobalPipe.FindValuePipe,
        GlobalPipe.ValueByLangPipe,
        GlobalPipe.TranslitPipe,

        GlobalService.RoundProgressService,
        GlobalService.RoundProgressEase,
        GlobalDirective.DropdownOpenDirective,
        GlobalService.RoundProgressConfig,
    ]
})
export class SharedModule { }
