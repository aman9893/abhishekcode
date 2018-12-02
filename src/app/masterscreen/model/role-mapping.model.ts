import { CompanyDetails } from '../model/admin-master.model';
import { User } from '../../actiontracker/model/user.model';
import { UserRole } from './user-role.model';

export class RoleMappingModel {
    companyName: string;
    companyId: number;
    roleId: number;
    roleName: string;
}


export class RoleMappingModelGet {
    UserDetails: User;
    RoleDetails: UserRole;
}
