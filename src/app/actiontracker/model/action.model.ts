import { RiskRequestGet } from '../../risk/model/riskRequest.model';
import { ObservationRequest } from '../../observation/model/observationData.model';
import { Process } from './process.model';
import { Status } from './status.model';
import { User } from './user.model';
import { ActionHistory } from './actionHistory.model';

export class Action {
  SourceText: string;
  Source: number;
  SourceId: number;
  DisplayId: string;
  ActionId: number;
  ActionOwnerId: number;
  ActionPartyId: number;
  ActionVerifierId: number;
  ActionDetails: string;
  Priority: number;
  AssignedBy: string;
  CreatedBy: number;
  CreatedDate: Date;
  TargetDate: Date;
  StatusId: number;
  StatusText: string;
  Status: string;
  ActionAssignedOn: string;
  ActionDueDate: string;
  ActionPriority: string;
  ObservationSubmitDate: Date;
  ObservationData: ObservationRequest;
  PriorityName: string;
  ObservationType: string;
  UpdatedBy: number;
  Process: Process;
  VerificationDate: Date;
  RequestData: any;
  ActionVerifier: User;
  ActionParty: User;
  StatusModel: Status;
  ActionHistory: ActionHistory[];
  UpdatedDate: Date;
  UrlToRedirectByStatus: string;
  ActionOwner: User;
  Minutes: number;
  ZoneOffset: number;
  DueDateColour: string;
}

