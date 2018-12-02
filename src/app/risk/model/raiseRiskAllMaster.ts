export class RiskSource {
    RiskSourceId: number;
    Source: string;
}

export class Project {
    ProjectId: number;
    ProjectName: string;
}

export class RiskManagementTool {
    RiskManagementToolId: number;
    ToolName: string;
}

export class RiskControlTechniques {
    RiskControlTechniquesId: number;
    ControlTechnique: string;
}

export class RaiseRiskAllMaster {
    RiskSource: RiskSource[] = [];
    Project: Project[] = [];
    RiskManagementTool: RiskManagementTool[] = [];
    RiskControlTechniques: RiskControlTechniques[] = [];
}
