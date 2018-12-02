import { User } from './../../shared/models/user.model';

export class ActionDetails {
    SourceText: string;
    Source: number;
    SourceId: number;
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
    ActionAssignedOn: string;
    ActionDueDate: string;
    ActionPriority: string;
    ObservationSubmitDate: string;
    Designation: string;
    displayActionListErrorMessages: any = {
        ActionDetails: false,
        ActionOwner: false,
        CorrectActionOwner: false,
        CorrectActionParty: false,
        CorrectActionVerifier: false,
        TargetDate: false,
        Priority: false
    };
    selectedActionOwner: User;
    selectedActionParty: User;
    selectedActionVerifier: User;
}

export class AssignActionPost {
    ActionId: number = 0;
    Action: string = '';
    ActionOwnerId: number = 0;
    Priority: number = 0;
    TargetDate: Date = new Date();
    ShowActionErrorMessage: boolean = false;
    ShowActionOwnerErrorMessage: boolean = false;
    ShowPriorityErrorMessage: boolean = false;
    ShowTargetErrorMessage: boolean = false;

    ActionOwner: User;
  }
