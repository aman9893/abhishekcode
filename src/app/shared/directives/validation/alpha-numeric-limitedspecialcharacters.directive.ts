import { Directive, ElementRef, HostListener } from '@angular/core';

import { BaseService } from '../../services/base.service';

@Directive({
  selector: '[appAlphaNumericLimitedspecialcharacters]'
})
export class AlphaNumericLimitedspecialcharactersDirective {
  // Restricts user to alpha numeric with limited special characters
  private regex: RegExp = new RegExp(/^[ A-Za-z0-9-,:!@&()"']*$/g);
  constructor(private el: ElementRef
    , private baseService: BaseService) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // call validate funtion and check validation based on regex
    this.baseService.checkValidText(event, this.regex, this.el);
  }
}
