export interface ProblemAnalysisInput {
  title: string;
  rawDescription: string;
  region?: string;
  organization?: string;
}

export interface GeneratedChallengeOutput {
  structuredTitle: string;
  formattedObjective: string;
  categorySlug: string;
  suggestedSkills: string[];
  targetKPIs: Array<{ name: string; target: string }>;
  challengeFormat: string;
  missingFields: string[];
  generatedQuestions: string[];
}

export interface SolverMatchResult {
  solverId: string;
  solverName: string;
  matchScore: number; // 0 to 100
  matchReasons: string[];
}

export interface SolutionEvaluationInput {
  problemTitle: string;
  problemDescription: string;
  problemBudget?: number;
  problemRegion?: string;
  problemTargetResult?: string;
  solutionTitle: string;
  solutionDescription: string;
  technicalApproach: string;
  expectedResult?: string;
  estimatedCost: number;
  estimatedDays: number;
  riskAnalysis?: string;
  solverName?: string;
  solverOccupation?: string;
  solverSkills?: string[];
  solverRating?: number;
}

export interface SolutionEvaluationOutput {
  overallScore: number; // 0 to 100
  feasibilityScore: number; // 0 to 100
  innovationScore: number; // 0 to 100
  costEfficiencyScore: number; // 0 to 100
  verdict: "EXCELLENT" | "RECOMMENDED" | "NEEDS_REVISION" | "HIGH_RISK";
  verdictText: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  pilotReadiness: string;
  nextSteps: string[];
}

export interface IAIService {
  generateChallenge(input: ProblemAnalysisInput): Promise<GeneratedChallengeOutput>;
  matchSolvers(
    challenge: { structuredTitle: string; suggestedSkills: string[]; region: string },
    solvers: Array<{ id: string; name: string; skills: string[]; region: string; bio?: string }>
  ): Promise<SolverMatchResult[]>;
  evaluateSolution(input: SolutionEvaluationInput): Promise<SolutionEvaluationOutput>;
}
