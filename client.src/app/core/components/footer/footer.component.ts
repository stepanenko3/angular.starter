import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {

    }
}
