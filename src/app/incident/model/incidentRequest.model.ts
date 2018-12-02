import { IncidentRequestPost } from './incidentRequestPost.model';
import { PeopleInvolved } from './peopleInvolved.model';
import { SpilDetails } from './spilDetails.model';

export class IncidentRequest {
    IncidentRequest: IncidentRequestPost;
    PeopleInvolved: PeopleInvolved[];
    SpilDetails: SpilDetails[];
}

