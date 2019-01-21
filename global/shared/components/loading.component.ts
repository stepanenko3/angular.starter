import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-module-loading',
    templateUrl: 'loading.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
    @Input() isLoading = true;
    @Input() relative = false;
    @Input() height = 200;
    @Input() rounded = true;
    @Input() overflow = false;

    get classes(): any {
        return {
            'module-loading--relative': this.relative,
            'module-loading--show': this.isLoading,
            'module-loading--rounded': this.rounded,
            'module-loading--overflow': this.overflow,
        };
    }
}
