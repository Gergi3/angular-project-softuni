import { Component } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { UserModel } from '../+store/models';
import { Router } from '@angular/router';
import { IUserLoginInfo } from 'src/app/core/interfaces/user';
import { BehaviorSubject, first } from 'rxjs';
import { emailValidators, passwordValidators } from 'src/app/core/validators/reactive-validators';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private loginFailure$$ = new BehaviorSubject<string | null>(null);

  loginFailure$ = this.loginFailure$$.asObservable();
  isLoggingIn$ = this.userModel.isLoggingIn$;

  loginForm = this.fb.group({
    email: ['', emailValidators],
    password: ['', passwordValidators]
  })

  constructor(
    private fb: FormBuilder,
    private userModel: UserModel,
    private router: Router,
    private errorHelper: ErrorHelper
  ) { }

  loginHandler() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    const userInfo: IUserLoginInfo = {
      email: email!,
      password: password!
    }
    this.userModel.loginUser(userInfo);

    this.userModel.loginUserSuccess$.pipe(first())
      .subscribe(() => this.router.navigate(['/']));

    this.userModel.loginUserFailure$.pipe(first())
      .subscribe(({ error }) => this.loginFailure$$.next(this.errorHelper.getApiError(error)));
  }

  cancelHandler() {
    this.router.navigate(['/']);
  }
}
