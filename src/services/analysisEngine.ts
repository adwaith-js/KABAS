import { TeamMemberStats } from './api';

export const AnalysisEngine = {

    detectOutliers(members: TeamMemberStats[]): string[] {

        if (members.length < 2) return [];

        const scores = members.map((m) => m.efficiencyScore);
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);

        if (stdDev === 0) return [];

        return members
            .filter((m) => Math.abs(m.efficiencyScore - mean) > 1.5 * stdDev)
            .map((m) => m.name);

    },
};
