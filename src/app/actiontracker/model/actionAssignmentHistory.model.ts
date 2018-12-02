import { FileAttachment } from './../../shared/models/file-attachment.model';
import { Action } from './action.model';

export class ActionAssignmentHistory {
    Actions: Action[] = [];
    ActionId: number;
    UpdatedBy: number;
    Remarks: string;
    UploadedBy: number;
    Url: string;
    ProcessId: number;
    SourceId: number;
    files: FileAttachment[] = [];
    StatusId: number;
    Comment: string;
    PendingWith: number;
}
