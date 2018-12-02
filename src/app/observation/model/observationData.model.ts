import { FileAttachment } from './../../shared/models/file-attachment.model';
import { User } from './user.model';
import { ActionGet } from '../../actiontracker/model/actionGet';
import { ObservationCategoryModel } from '../../masterscreen/model/observation-category.model';

export class ObservationRequest {
  ObservationId: number;
  DisplayId: string;
  ObservationDate: Date;
  EmployeeName: string;
  RaisedBy: number;
  RaisedFor: number;
  ObservationTypes: number;
  LocationId: number;
  ExactLocation: String;
  WhatObserved: String;
  WhatYouDid: String;
  IsJobStopped: Boolean;
  WhatWeCouldDo: String;
  Feedback: String;
  NotListed: String;
  StatusId: number;
  ActorId: Boolean;
  CompanyId: number;
  HazardTypes: number[];
  ObservationTypeId: number;
  ObservationType: String;
  LocationName: String;
  CancellationReason: string;
  HazardType: number[];
  Status: string;
  CreatedDate: Date;
  WhatYouDidFiles: any[] = [];
  WhatWeCouldDoFiles: any[] = [];
  WhatObservedFiles: any[] = [];
  UpdatedDate: Date;
  ClosureReason: string;
  ClosureDate: Date;
  AcknowledgmentReason: string;
  AcknowledgmentDate: Date;
  CancellationDate: Date;
  DeletionReason: string;
  DeletionDate: Date;
  WhatYouDidFileURL: string;
  WhatWeCouldDoFileURL: string;
  WhatObservedFileURL: string;
  ObservationRaiseUser:  User;
  ObservationCategoryId: number;
  ObservationCategoryName: string;
}


export class ObservationRequsetsForDashboard {
  ObservationRequests: ObservationRequest;
  RaisedForFullName: string;
}

export class ViewRequestForObservation {
  ObservationRequests: ObservationRequest;
  HseAdviserUsersDetails: User;
  ActionRequests: ActionGet;
  ObservationCategoryDetails: ObservationCategoryModel;
}
