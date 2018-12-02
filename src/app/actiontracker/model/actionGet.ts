import { Process } from './process.model';
import { User } from './user.model';
import { Status } from '../../observation/model/status.model';
import {ActionAssignment} from '../model/actionAssignment.model';
import {UploadedDocument} from '../model/uploadedDocument.model';

export class ActionGet {
    ActionId: number;
    Process: Process = new Process();
    CreatedBy: User = new User();
    ActionOwner: User = new User();
    ActionParty: User = new User();
    ActionVerifier: User = new User();
    ActionDetails: string;
    Priority: number;
    Source: number;
    CreatedDate: Date;
    TargetDate: Date;
    Status: Status = new Status();
    RequestData: any = {};
    ActionAssignment: ActionAssignment [];
    UploadedDocument: UploadedDocument[];
}
