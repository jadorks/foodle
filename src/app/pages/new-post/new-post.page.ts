import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ActionSheetController, AlertController, LoadingController, Platform } from "@ionic/angular";
import { PostService, Post } from "../../services/post.service";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { Router } from "@angular/router";
const { Camera } = Plugins;

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {

  postForm: FormGroup;
  formData: FormData;

  constructor(    
    private postService: PostService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private plt: Platform,
    private actionSheetController: ActionSheetController,
    private router: Router
    ) { 
      this.formData = new FormData();
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };
    }

  ngOnInit() {
    this.postForm = new FormGroup({
      'caption': new FormControl(null, [Validators.required]),
      'recipe': new FormControl(null, [Validators.required]),
    });
  }

  get caption(){
    return this.postForm.get('caption');
  }

  get recipe(){
    return this.postForm.get('recipe');
  }

  async submitPost(){
    this.formData.append("caption", this.caption.value);
    this.formData.append("recipe", this.recipe.value);

    const loading = await this.loadingController.create();
    await loading.present();

    this.postService.createPost(this.formData).subscribe(
      async (res) => {
        await loading.dismiss();
        
        const alert = await this.alertController.create({
          header: 'New Post Created',
          message: 'Your post has been created',
          buttons: ['OK'],
        });

        await alert.present();
        this.router.navigateByUrl("/tabs/home");
      },
      async (res) => {
        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Failed',
          message: 'Failed to create post',
          buttons: ['OK'],
        });

        await alert.present();
      }

    )
  }

  async chooseOrTakePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      //source: CameraSource.Camera
    }).catch((error)=>{
      console.log(error)
    })
    // variable image should contain our base64 image
    if (image){
      // convert base64 image to blob
      let blob = this.b64toBlob(image.base64String)
      
      //Generate a fake filename
      let name =Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
      this.formData.append('image', blob, name+`.${image.format}`);
    }
  }

  public b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
 
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
