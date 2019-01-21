import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy,
    OnInit
} from '@angular/core';

import { BreadcrumbsService } from '@core/services';
import { Breadcrumb } from '@core/models';
import { Subscription } from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'app-breadcrumbs',
    templateUrl: 'breadcrumbs.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

    @HostBinding('class.breadcrumbs') _ = true;
    @HostBinding('class.breadcrumbs_white') toggle = false;

    @Input('white') set target(toggle: boolean) {
        this.toggle = toggle;
    }

    public breadcrumbs: Breadcrumb[];

    private sub: Subscription = new Subscription();

    constructor(
        private breadcrumbsService: BreadcrumbsService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.sub.add(this.breadcrumbsService.data$.subscribe((data: Breadcrumb[]) => {
            this.breadcrumbs = data;
            this.cd.detectChanges();
        }));
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    getOptions(...options: any[]): any {
        let returnItem = {};
        options.forEach(item => returnItem = Object.assign(returnItem, item));

        return returnItem;
    }
}
