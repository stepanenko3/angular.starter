import { HostBinding, Directive, Input } from '@angular/core';

@Directive({
    selector: '[appTabContent]'
})
export class TabContentDirective {
    @HostBinding('class.tab')
    private _contentClasses: boolean;

    @Input() public appTabContent: string;

    @HostBinding('class.active')
    public isActive: boolean;

    constructor() {
        this.isActive = false;

        this._contentClasses = true;
    }
}
