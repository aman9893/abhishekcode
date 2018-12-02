import { Directive, ElementRef, HostListener } from '@angular/core';

import { BaseService } from '../../services/base.service';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {
  // Restricts user to input only numbers
  private regex: RegExp = new RegExp(/^(0|[1-9][0-9]*)$$/g);

  constructor(private el: ElementRef
    , private baseService: BaseService) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // call validate funtion and check validation based on regex
    this.baseService.checkValidText(event, this.regex, this.el);
  }
}
