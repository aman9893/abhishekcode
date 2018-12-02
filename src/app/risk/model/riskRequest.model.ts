
import { Project, RiskManagementTool, RiskSource, RiskControlTechniques } from './raiseRiskAllMaster';
import { AssignActionPost } from './../../actiontracker/model/actionDetails.model';
import { LocationDetails } from '../../masterscreen/model/admin-master.model';

export class RiskRequest {
    RiskRequestId: number;
    RaisedBy: number;
    RiskSourceId: number = 0;
    ProjectId: number = 0;
    LocationId: number = 0;
    RiskTitle: String = '';
    RiskManagementToolId: number = 0;
    ActivityLeadingToHazard: String = '';
    HazardIdentified: String = '';
    ThreatIdentified: String = '';
    Consequences: String = '';
    PotentialRiskPear: String = '0';
    PotentialRiskLikelihood: String = '0';
    PotentialRiskSeverity: number = 0;
    RiskControlTechniquesId: number = 0;
    ControlMeasure: String = '';
    ContengencyPlan: String = '';
    ResidualRiskPear: String = '0';
    ResidualRiskLikelihood: String = '0';
    ResidualRiskSeverity: number = 0;
    InActive: Boolean = false;
}

export class RaiseRisk {
    RiskRequest: RiskRequest;
    ActionDetails: AssignActionPost[];
}

export class RaiseRiskShowErrorMessages {
    showRiskSourceErrorMessage: boolean = false;
    showProjectNameErrorMessage: boolean = false;
    showLocationErrorMessage: boolean = false;
    showRiskTitleErrorMessage: boolean = false;
    showRiskManagementToolErrorMessage: boolean = false;
    showActivityLeadingToHazardErrorMessage: boolean = false;
    showHazardIdentifiedErrorMessage: boolean = false;
    showThreatIdentifiedErrorMessage: boolean = false;
    showConsequencesErrorMessage: boolean = false;
    showPotentialPearErrorMessage: boolean = false;
    showPotentialConsequencesErrorMessage: boolean = false;
    showPotentialSeverityErrorMessage: boolean = false;
    showControlTechniqueErrorMessage: boolean = false;
    showControlMeasureErrorMessage: boolean = false;
    showContegencyPlanErrorMessage: boolean = false;
    showResidualPearErrorMessage: boolean = false;
    showResidualConsequenceErrorMessage: boolean = false;
    showResidualSeverityErrorMessage: boolean = false;
}

export class RiskRequestGet {
    RiskTitle: String;
    ActivityLeadingToHazard: String;
    HazardIdentified: String;
    ThreatIdentified: String;
    Consequences: String;
    PotentialRiskPear: String;
    PotentialRiskLikelihood: String;
    PotentialRiskSeverity: number;
    RiskControlTechniquesId: number;
    ControlMeasure: String;
    ContengencyPlan: String;
    ResidualRiskPear: String;
    ResidualRiskLikelihood: String;
    ResidualRiskSeverity: number;
    LocationDetails: LocationDetails;
    ProjectDetails: Project;
    RiskManagmentTool: RiskManagementTool;
    RiskSource: RiskSource;
    RiskControlTechniques: RiskControlTechniques;
}
