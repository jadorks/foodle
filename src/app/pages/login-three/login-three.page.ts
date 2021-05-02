import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/validators/email.validators';
import { passwordValidator } from 'src/app/validators/password.validator';
import { AlertController, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-login-three',
  templateUrl: './login-three.page.html',
  styleUrls: ['./login-three.page.scss'],
})
export class LoginThreePage implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private loadingController: LoadingController, private alertController: AlertController) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, emailValidator]],
      password: [null, [Validators.required]],
    });
  }

  signIn() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      console.log('invalid');
    }
  }

  async login(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.userService.loginUser(this.email.value, this.password.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      },
      async(res) => {
        await loading.dismiss();
        console.log(res)

        const alert = await this.alertController.create({
          header: 'Login Failed',
          message: res.error.non_field_errors,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }

}
