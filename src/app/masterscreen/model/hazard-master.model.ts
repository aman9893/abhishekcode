import { FileAttachment } from './../../shared/models/file-attachment.model';

// Entity of hazard master
export class HazardMaster {
    hazardId: number;
    hazardName: string;
    isUpdatedCompany: boolean;
    InActive: boolean;
    selectedCompanyDetails: any[];
    files: FileAttachment[] = [];
    companyId: number;
    companyName: string;
    fileURL: string;
    checked: boolean;
    getOnlyActiveHazards: boolean;
}
