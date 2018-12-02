import { User } from '../../shared/models/user.model';
export class PeopleInvolved {
    PeopleInvolvedId: number;
    IncidentRequestId: number;
    UserId: number;
    User: User;
    Job: number;
    Injury: string;
    Company: string;
}
