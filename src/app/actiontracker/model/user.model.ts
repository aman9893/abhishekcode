export class User {
    UserId: number;
    Email: string;
    FirstName: string;
    LastName: string;
    FullName: string;
    UserTypeId: number;
    LocationName: string;
    UserTypes: any = {
        InActive: false,
        UserType: '',
        UserTypeId: null
    };
    ContactNumber: number;
    Reporting: string;
    Position: string;
    Designation: string;
    DepartmentName: string;
}
