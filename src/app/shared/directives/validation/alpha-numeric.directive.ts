import { Directive, ElementRef, HostListener } from '@angular/core';

import { BaseService } from '../../services/base.service';

@Directive({
  selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {
  // Restricts user to alpha numeric
  private regex: RegExp = new RegExp(/^[ A-Za-z0-9]*$/g);
  // private regex: RegExp = new RegExp(/^[ A-Za-z0-9-,:!@&()"']*$/g);

  constructor(private el: ElementRef
    , private baseService: BaseService) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // call validate funtion and check validation based on regex
    this.baseService.checkValidText(event, this.regex, this.el);
  }
}
