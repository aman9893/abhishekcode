import { Component, OnInit, Input } from '@angular/core';

import { ConstantsService } from '../../services/constants.service';
import { BaseService } from './../../services/base.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  @Input() routesFlag;
  @Input() reportRoutes;
  isExpand: any = false;
  expandSubMenu: boolean = false;
  loggedInUserJSON: any;
  isHSEAdvisor: boolean = false;

  constructor(private baseService: BaseService) { }

  ngOnInit() {
    // check role - if it's HSEAdvisor then display reports side nav
    const loggedInUser = this.baseService.getItemFromSession(ConstantsService.commonConstants.loggedInUser);
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    if (this.loggedInUserJSON.UserRoles.length > 0) {
      const roles = this.loggedInUserJSON.UserRoles.find((item) => item.RoleName === ConstantsService.Roles.HSEAdvisor);
      if (roles !== undefined && roles.RoleName === ConstantsService.Roles.HSEAdvisor) {
        this.isHSEAdvisor = true;
      }
    }
  }

  /**
   * Funtion for toggle common side bars side navigation
   */
  toggleSideBar(toggelValue) {
    if (toggelValue === ConstantsService.commonConstants.opensideBar) {
      this.isExpand = true;
    } else {
      this.isExpand = false;
    }
  }

  /**
   * Funtion for toggle sub menu of navigation
   */
  toggleSubMenu(toggelSubmenuValue) {
    if (toggelSubmenuValue === ConstantsService.commonConstants.opensubmenu) {
      this.expandSubMenu = true;
    } else {
      this.expandSubMenu = false;
    }
  }
}
