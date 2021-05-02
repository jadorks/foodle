import { Component, OnInit } from '@angular/core';
import { User, UserService } from "../../services/user.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  users = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  public onSearchChange(e){
    
    let value = e.detail.value;

    this.userService.searchUser(value).subscribe(
      res => {
        this.users = res
      }
    )
  }

}
