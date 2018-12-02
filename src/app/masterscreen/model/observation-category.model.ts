import { CompanyDetails } from '../model/admin-master.model';

// Entity of Observation Category
export class ObservationCategoryModel {
    observationCategoryId: number;
    observationCategoryName: string;
    selectedCompanyIds: any[];
    companyDetails: CompanyDetails;
    isUpdatedObservationCategory: boolean;
    InActive: boolean;
}
