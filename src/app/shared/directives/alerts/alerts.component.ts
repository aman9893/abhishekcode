import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit, OnChanges {
  display = true;
  @Input() alertType;
  @Input() successDetails;
  @Input() errorDetails;
  @Input() confirmMessage;
  @Output() okClicked: EventEmitter<any>;
  @Output() yesClicked: EventEmitter<any>;
  @Output() noClicked: EventEmitter<any>;

  constructor() {
    this.okClicked = new EventEmitter();
    this.yesClicked = new EventEmitter();
    this.noClicked = new EventEmitter();
  }
  ngOnInit() {
  }

  ngOnChanges() {
    // set value after changing event call
    this.display = true;
  }

  /**
   * Function to call on ok click.
   */
  onOkClick() {
    this.display = false;
    this.okClicked.emit();
  }

  /**
   * Function to call on Yes click of confirmation box
   */
  onYesClick() {
    this.display = false;
    this.yesClicked.emit();
  }


  /**
   * Function to call on No click of confirmation box
   */
  onNoClick() {
    this.display = false;
    this.noClicked.emit();
  }
}
