export class User {
    UserId: number;
    Email: string;
    FirstName: string;
    LastName: string;
    FullName: string;
    UserTypeId: number;
    UserTypes: any = {
        InActive: false,
        UserType: 'Employee',
        UserTypeId: 1
    };
    ContactNumber: number;
    Designation: string;
    DepartmentName: string;
}

