import { User } from './user.model';

// Model for Get Temp Observation Details for mobile user
export class TempObservationRequest {
  TempObservationRequestId: number;
  DisplayId: string;
  CreatedDate: Date;
  UserDetails: User[];
  TempObservationFileURL: string;
}
