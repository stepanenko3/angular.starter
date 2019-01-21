import {
    Component, Input, Output, ChangeDetectionStrategy, EventEmitter, forwardRef, OnInit, SimpleChanges, OnChanges,
    ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';


export function createCounterRangeValidator(min, max, required) {
    return (c: FormControl) => {
        const err = {
            rangeError: {
                given: c.value,
                max: max,
                min: min,
                required: true
            }
        };

        return (c.value > +max || c.value < +min || (required && !c.value)) ? err : null;
    };
}

@Component({
    moduleId: module.id,
    selector: 'app-counter-input',
    templateUrl: 'counter-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CounterInputComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => CounterInputComponent), multi: true }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterInputComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {

    nextRate: number;
    disabled: boolean;

    @Input() count: number;
    @Input() min = 1;
    @Input() max = 1000;

    @Input() readOnly = false;
    @Input() required = false;

    @Output() countChange = new EventEmitter<number>(true);

    constructor(private changeDetectorRef: ChangeDetectorRef, ) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.min || changes.max) {
            this.validateFn = createCounterRangeValidator(this.min, this.max, this.required);

            if (!changes.count) {
                this.update(this.count);
            }
        }

        if (changes['count']) {
            this.update(this.count);
        }
    }

    ngOnInit() {

    }

    update(newCount: number, internalChange = true): void {
        if (!this.readOnly && !this.disabled && this.count !== newCount) {
            this.count = newCount;
            this.countChange.emit(this.count);
        }
        if (internalChange) {
            this.onChange(this.count);
        }
    }

    get value(): number {
        return this.count;
    }

    set value(count: number) {
        if (this.count !== count) {
            this.update(count);
        }
    }

    increment() {
        this.update((this.count + 1 > this.max) ? this.max : this.count + 1);
    }

    decrement() {
        this.update((this.count - 1 < this.min) ? this.min : this.count - 1);
    }

    /** This is the initial value set to the component */
    writeValue(value: number) {
        this.update(value, false);
        this.changeDetectorRef.detectChanges();
    }

    onChange = (value: any) => { };
    validateFn: any = () => { };

    registerOnChange(fn: (value: any) => any): void {
        this.onChange = fn;
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

    registerOnTouched(): void {
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }
}

