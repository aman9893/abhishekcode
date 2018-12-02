import { ObservationRequest } from '../../observation/model/observationData.model';
import { User } from './user.model';
import { Action } from './action.model';

export class ActionAssign {
    ObservationData: ObservationRequest;
    UserData: User;
    Action: Action;
}
