import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Box, Typography, Select, FormControl, MenuItem, Grid } from "@mui/material";

import StatCard from "../components/StatCard";
import TeamCard from "../components/TeamCard";

const MOCK_STATS = {
	totalTeams: 4,
	activeTeams: 4,
	totalTasks: 14,
	completedTasks: 6,
	inProgress: 6,
	completionRate: 43,
	allActive: true,
};

const MOCK_TEAMS = [
	{
		id: 1,
		name: "Team Alpha",
		platform: "GitHub",
		status: "Active",
		synced: "about 1 month ago",
		tasks: { total: 10, completed: 4, inProgress: 4, backlog: 1 },
	},
	{
		id: 2,
		name: "Team Beta",
		platform: "Jira",
		status: "Active",
		synced: "about 1 month ago",
		tasks: { total: 2, completed: 1, inProgress: 1, backlog: 0 },
	},
	{
		id: 3,
		name: "Team Gamma",
		platform: "GitHub",
		status: "Active",
		synced: "about 1 month ago",
		tasks: { total: 2, completed: 1, inProgress: 1, backlog: 0 },
	},
	{
		id: 4,
		name: "Team Delta",
		platform: "Jira",
		status: "Active",
		synced: "about 1 month ago",
		tasks: { total: 0, completed: 0, inProgress: 0, backlog: 0 },
	},
];

function DashboardPage() {
	const [date, setDate] = useState("30");
	const [stats, setStats] = useState(null);
	const [teams, setTeams] = useState([]);

	useEffect(() => {
		/*
            http.get("/api/stats")
                .then((res) => setStats(res.data))
                .catch((err) => toast.error(err));
            http.get("/api/teams")
                .then((res) => setTeams(res.data))
                .catch((err) => toast.error(err));
        */
		setStats(MOCK_STATS);
		setTeams(MOCK_TEAMS);
	}, []);

	return (
		<Box>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
				<Box>
					<Typography variant="h5" fontWeight={700}>
						Dashboard Overview
					</Typography>
					<Typography variant="body2" color="text.secondary" mt={0.5}>
						Monitor all your teams' performance at a glance
					</Typography>
				</Box>

				<FormControl size="small">
					<Select value={date} onChange={(e) => setDate(e.target.value)}>
						<MenuItem value="7">Last 7 days</MenuItem>
						<MenuItem value="30">Last 30 days</MenuItem>
						<MenuItem value="0">All time</MenuItem>
					</Select>
				</FormControl>
			</Box>

			{stats && (
				<Box sx={{ display: "flex", gap: 2, mb: 4 }}>
					<StatCard
						title="Total Teams"
						value={stats.totalTeams}
						subtitle={stats.allActive ? "↑ All active" : `↑ ${stats.activeTeams} active`}
					/>
					<StatCard title="Total Tasks" value={stats.totalTasks} subtitle="Across all teams" />

					<StatCard
						title="Completed Tasks"
						value={stats.completedTasks}
						subtitle={`↑ ${stats.completionRate}% completion rate`}
						valueColor="#16a34a"
					/>
					<StatCard title="In Progress" value={stats.inProgress} subtitle="Active work items" valueColor="#2563eb" />
				</Box>
			)}

			<Grid container spacing={2}>
				{teams.map((team) => (
					<Grid size={{ xs: 12, sm: 6, md: 4 }} key={team.id}>
						<TeamCard team={team} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

export default DashboardPage;
