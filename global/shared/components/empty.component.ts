import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-empty',
    templateUrl: 'empty.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyComponent {
    @Input() left = false;
    @Input() title = 'EMPTY.TITLE';
    @Input() text = 'EMPTY.TEXT';
}
