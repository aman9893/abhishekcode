import { CompanyDetails } from '../model/admin-master.model';

// Entity of Observation Types
export class ObservationTypesModel {
    observationTypeId: number;
    observationTypeName: string;
    selectedCompanyIds: any[];
    companyDetails: CompanyDetails;
    isUpdatedObservationTypes: boolean;
    InActive: boolean;
    IsDeleteButtonShow: boolean;
}
