import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { emailValidator } from 'src/app/validators/email.validators';
import { AlertController, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {

  resetForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private alertController: AlertController, private loadingController: LoadingController, private router: Router) { }

  ngOnInit() {
    this.resetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, emailValidator]),
    })
  }

  async resetPass(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.userService.forgotPass(this.email.value).subscribe(
      async (res) => {
        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Password reset link has been sent to your email',
          buttons: ['OK'],
        });

        await alert.present();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      async(res) => {
        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Failed',
          message: 'Failed to send password reset link.',
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  get email(){
    return this.resetForm.get('email');
  }

}
