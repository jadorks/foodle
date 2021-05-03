import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ActionSheetController, AlertController, LoadingController, Platform } from "@ionic/angular";
import { PostService, Post } from "../../services/post.service";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { Router, ActivatedRoute } from "@angular/router";
const { Camera } = Plugins;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  chosenImage: any = "";
  postForm: FormGroup;
  formData: FormData;
  post: any= {};
  id: any;

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private plt: Platform,
    private actionSheetController: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.formData = new FormData();
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
  }

  ngOnInit() {
    this.postForm = new FormGroup({
      'caption': new FormControl(null, [Validators.required]),
      'recipe': new FormControl(null, [Validators.required]),
    });
  }

  ionViewWillEnter(){
    this.postService.getPost(this.id).subscribe(
      result => {
        this.post = result;
        this.caption.setValue(this.post.caption);
        this.recipe.setValue(this.post.recipe);
      }
    )
  }

  async submitPost(){
    this.formData.append("caption", this.caption.value);
    this.formData.append("recipe", this.recipe.value);

    const loading = await this.loadingController.create();
    await loading.present();

    this.postService.updatePost(this.post.id, this.formData).subscribe(
      async (res) => {
        await loading.dismiss();
        
        const alert = await this.alertController.create({
          header: 'Recipe Edited',
          message: 'Your recipe has been edited',
          buttons: ['OK'],
        });

        await alert.present();
        this.clearForm();
        this.router.navigateByUrl("/tabs/profile");
      },
      async (res) => {
        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Failed',
          message: 'Failed to edit recipe',
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

  get caption(){
    return this.postForm.get('caption');
  }

  get recipe(){
    return this.postForm.get('recipe');
  }

  async clearForm(){
    this.postForm.reset();
  }


}
