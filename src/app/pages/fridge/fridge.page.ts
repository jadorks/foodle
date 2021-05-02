import { Component, OnInit } from '@angular/core';
import { Post, PostService } from "../../services/post.service";

@Component({
  selector: 'app-fridge',
  templateUrl: './fridge.page.html',
  styleUrls: ['./fridge.page.scss'],
})
export class FridgePage implements OnInit {

  posts = []

  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  public onSearchChange(e){
    let value = e.detail.value;

    this.postService.findPost(value).subscribe(
      res => {
        this.posts = res;
      }
    )
  }

}
