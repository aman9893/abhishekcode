import { Component, OnInit } from '@angular/core';

import { Adal4Service } from 'adal-angular4/adal4.service';
import { Adal4HTTPService } from 'adal-angular4/adal4-http.service';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private baseService: BaseService
    , private adal4Service: Adal4Service) { }

  ngOnInit() {
    if (this.adal4Service && this.adal4Service.userInfo && this.adal4Service.userInfo.authenticated) {
      this.baseService.showRootLoader = false;
    }
  }

}
