import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherUserPageRoutingModule } from './other-user-routing.module';

import { OtherUserPage } from './other-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtherUserPageRoutingModule
  ],
  declarations: [OtherUserPage]
})
export class OtherUserPageModule {}
