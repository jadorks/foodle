import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: 
    [
      {
        path: 'home',
        children:
          [
            {
              path: '',
              loadChildren: () => import("../feed-two/feed-two.module").then( m => m.FeedTwoPageModule),
            }
          ]
      },
      {
        path: 'search',
        children:
          [
            {
              path: '',
              loadChildren: () => import("../search/search.module").then( m => m.SearchPageModule ),
            }
          ]
      },
      {
        path: 'new-post',
        children:
          [
            {
              path: '',
              loadChildren: () => import("../new-post/new-post.module").then( m => m.NewPostPageModule ),
            }
          ]
      },
      {
        path: 'fridge',
        children:
          [
            {
              path: '',
              loadChildren: () => import("../fridge/fridge.module").then( m => m.FridgePageModule),
            }
          ]
      },
      {
        path: 'profile',
        children:
          [
            {
              path: '',
              loadChildren: () => import("../profile-three/profile-three.module").then( m => m.ProfileThreePageModule),
            }
          ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
