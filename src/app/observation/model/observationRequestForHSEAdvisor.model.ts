import { Action } from '../../actiontracker/model/action.model';
export class ObservationRequestForHSEAdvisor {

  ObservationId: number;
  FullName: string;
  UserId: number;
  UserType: String;
  ObservationTypeId: number;
  CreatedDate: Date;
  ObservationDate: Date;
  LocationName: string;
  Status: string;
  ObservationType: string;
  HazardTypes: number[];
  HazardTypeNames: string[];
  ActionCount: number;
  Action: Action[];
  NoOfActionsAdded: number;
}
