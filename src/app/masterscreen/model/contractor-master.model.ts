import { SelectItem } from 'primeng/api';

export class ContractorDetails {
    userId: number;
    userName: string;
    password: string;
    fullName: string;
    gender: SelectItem[];
    agency: string;
    designation: string;
    registrationId: string;
    contactNumber: string;
    email: string;
    InActive: boolean;
    companyId: number;
    companyName: string;
    isNewCompany: boolean;
}
