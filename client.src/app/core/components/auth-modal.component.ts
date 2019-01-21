import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, OnDestroy, HostBinding
} from '@angular/core';

import { dropdownContent, modalAnimation } from '@core/animations';
import { AuthService, ScrollService } from '@core/services';
import { Subscription } from 'rxjs/index';
import { User } from '@core/models';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhoneValidators } from '@core/validators';
import { Utils } from '@core/utils';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Component({
    moduleId: module.id,
    selector: 'app-auth-modal',
    templateUrl: 'auth-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [modalAnimation, dropdownContent],
})
export class AuthModalComponent implements OnInit, OnDestroy {

    @HostBinding('class.modal') baseClass = true;
    @HostBinding('@modalAnimation') baseAnimation = true;

    @Input() closeButton = true;
    @Input() closeESC = true;

    public registerState = false;
    public inProgress = false;
    public inProgressSocial = false;

    public authForm: FormGroup;
    public regForm: FormGroup;

    private sub: Subscription = new Subscription();

    constructor(
        private cd: ChangeDetectorRef,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private translate: TranslateService,
        private scrollService: ScrollService,
    ) {
    }

    ngOnInit(): void {
        this.scrollService.disable();
        this.authForm = this.fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.email])],
            'password': ['', Validators.compose([Validators.required])],
        });

        this.regForm = this.fb.group({
            'first_name': ['', Validators.compose([Validators.required])],
            'last_name': ['', Validators.compose([Validators.required])],
            'phone': ['', Validators.compose([Validators.required, PhoneValidators.checkIfValidPhone])],
            'email': ['', Validators.compose([Validators.required, Validators.email])],
            'password': ['', Validators.compose([Validators.required])],
        });

        this.sub.add(this.authService.auth$.subscribe(authState => {
            if (authState) {
                this.onClose();
            }
        }));

        this.sub.add(this.authService.authSocialInProgress$.subscribe(inProgressSocial => {
            this.inProgressSocial = inProgressSocial;
            this.cd.detectChanges();
        }));
    }

    ngOnDestroy() {
        this.scrollService.enable();
        this.sub.unsubscribe();
    }

    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.closeESC) {
            this.onClose();
        }
    }

    onClose() {
        if (this.inProgressSocial || this.inProgress) {
            return;
        }
        this.authService.closeModal();
    }


    private login() {
        if (this.authForm.invalid) {
            Utils.validateAllFormFields(this.authForm);
            return;
        }

        this.inProgress = true;
        this.cd.detectChanges();

        const formValue = this.authForm.value;
        this.authService.login(formValue['email'], formValue['password'])
            .subscribe((res: any) => {
                if (res && !res.errors) {
                    this.translate.get('AUTH_MODAL.AUTH.SUCCESS', { full_name: res.user.first_name + ' ' + res.user.last_name })
                        .pipe(take(1))
                        .subscribe(r => this.snackBar.open(r, null, { duration: 3000 }));

                    this.inProgress = false;
                    this.onClose();
                } else {
                    for (const a in res.errors) {
                        if (!res.errors.hasOwnProperty(a) || !this.authForm.controls[a]) {
                            continue;
                        }
                        this.authForm.controls[a].setErrors(res.errors[a]);
                    }

                    this.inProgress = false;
                    this.cd.detectChanges();
                }
            }, () => {
                this.inProgress = false;
                this.cd.detectChanges();
            });
    }

    private register() {
        if (this.regForm.invalid) {
            Utils.validateAllFormFields(this.regForm);
            return;
        }

        this.inProgress = true;
        this.cd.detectChanges();

        this.authService.register(<User>this.regForm.value)
            .subscribe((res: any) => {

                if (res && !res.errors) {
                    this.translate.get('AUTH_MODAL.REGISTER.SUCCESS', {
                        full_name: res.user.first_name + ' ' + res.user.last_name, email: res.user.email
                    })
                        .pipe(take(1))
                        .subscribe(r => this.snackBar.open(r, null, { duration: 10000 }));

                    this.inProgress = false;
                    this.onClose();
                } else {
                    for (const a in res.errors) {
                        if (!res.errors.hasOwnProperty(a) || !this.authForm.controls[a]) {
                            continue;
                        }
                        this.authForm.controls[a].setErrors(res.errors[a]);
                    }

                    this.inProgress = false;
                    this.cd.detectChanges();
                }
            }, () => {
                this.inProgress = false;
                this.cd.detectChanges();
            });
    }

    authWithProvider(provider: string) {
        this.authService.authWithProvider(provider);
    }

    submit() {
        if (this.inProgress || this.inProgressSocial) {
            return;
        }

        if (this.registerState) {
            this.register();
        } else {
            this.login();
        }
    }
}
