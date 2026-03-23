import { Paper, Box, Typography, Button, Divider, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import Badge from "./Badge";
import StatCard from "./StatCard";

function TeamCard({ team }) {
	const navigate = useNavigate();
	const theme = useTheme();

	return (
		<Paper
			elevation={0}
			onClick={() => navigate(`/team/${team.id}`)}
			sx={{
				p: 3,
				border: "1px solid",
				borderColor: "grey.200",
				borderRadius: 3,
				display: "flex",
				flexDirection: "column",
				gap: 2,
				cursor: "pointer",
				transition: "box-shadow 0.2s ease, transform 0.2s ease",
				"&:hover": {
					boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.15)",
					transform: "translateY(-2px)",
				},
			}}
		>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Typography variant="h6">{team.name}</Typography>

				<Badge label={team.platform} />
			</Box>

			<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
				<Box sx={{ display: "flex", gap: 1 }}>
					<StatCard
						title="Total Tasks"
						value={team.tasks.total}
						valueColor={theme.palette.task.total.main}
						bg={theme.palette.task.total.light}
						size="sm"
					/>

					<StatCard
						title="Completed"
						value={team.tasks.completed}
						valueColor={theme.palette.task.completed.main}
						bg={theme.palette.task.completed.light}
						size="sm"
					/>
				</Box>
				<Box sx={{ display: "flex", gap: 1 }}>
					<StatCard
						title="In Progress"
						value={team.tasks.inProgress}
						valueColor={theme.palette.task.inProgress.main}
						bg={theme.palette.task.inProgress.light}
						size="sm"
					/>

					<StatCard
						title="Backlog"
						value={team.tasks.backlog}
						valueColor={theme.palette.task.backlog.main}
						bg={theme.palette.task.backlog.light}
						size="sm"
					/>
				</Box>
			</Box>

			<Divider />

			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
					<AccessTimeIcon sx={{ fontSize: 14 }} />
					<Typography variant="caption">Synced {team.synced}</Typography>
				</Box>

				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					<Box
						sx={{
							width: 8,
							height: 8,
							borderRadius: "50%",
							backgroundColor: team.status === "Active" ? theme.palette.status.active : theme.palette.status.inactive,
						}}
					/>

					<Typography variant="caption" color={team.status === "Active" ? theme.palette.status.active : "text.secondary"}>
						{team.status}
					</Typography>
				</Box>
			</Box>

			<Button variant="contained" fullWidth>
				View Details
			</Button>
		</Paper>
	);
}

export default TeamCard;
