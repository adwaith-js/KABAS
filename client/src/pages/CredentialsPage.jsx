import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
	Box,
	Button,
	Typography,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	InputAdornment,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import CredentialsForm from "../components/CredentialsForm";
import Badge from "../components/Badge";

const TABLE_COLUMNS = ["Team Name", "Platform", "Repository/Project URL", "Last Updated", "Status", "Actions"];

const MOCK_TEAMS = [
	{ id: 1, name: "Team Alpha", platform: "GitHub", url: "github.com/team-alpha/project", updated: "about 1 month ago", status: "Active" },
	{ id: 2, name: "Team Beta", platform: "Jira", url: "teambeta.atlassian.net", updated: "about 1 month ago", status: "Active" },
	{ id: 3, name: "Team Gamma", platform: "GitHub", url: "github.com/team-gamma/kanban", updated: "about 1 month ago", status: "Active" },
	{ id: 4, name: "Team Delta", platform: "Jira", url: "teamdelta.atlassian.net", updated: "about 1 month ago", status: "Inactive" },
];

function CredentialsPage() {
	const [teams, setTeams] = useState([]);
	const [selectedTeam, setSelectedTeam] = useState(null);

	const [search, setSearch] = useState("");

	const [openForm, setOpenForm] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const filteredTeams = teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

	useEffect(() => {
		/*
            http.get("/api/credentials")
                .then((res) => setTeams(res.data))
                .catch((err) => toast.error(err));
        */
		setTeams(MOCK_TEAMS);
	}, []);

	const handleNew = () => {
		setSelectedTeam(null);
		setOpenForm(true);
	};

	const handleEdit = (team) => {
		setSelectedTeam(team);
		setOpenForm(true);
	};

	const handleDeleteClick = (team) => {
		setSelectedTeam(team);
		setOpenDelete(true);
	};

	const handleDeleteClose = () => {
		setOpenDelete(false);
		setSelectedTeam(null);
	};

	const handleDeleteConfirm = () => {
		/*
            http.delete(`/api/credentials/${selectedTeam.id}`)
                .then(() => toast.success("Team deleted!"))
                .catch((err) => toast.error(err));
        */
		setTeams((prev) => prev.filter((t) => t.id !== selectedTeam.id));
		setOpenDelete(false);
		setSelectedTeam(null);
	};

	const onConfirm = (formData, id) => {
		if (id) {
			/*
                http.put(`/api/credentials/${id}`, formData)
                    .then(() => toast.success("Team updated!"))
                    .catch((err) => toast.error(err));
            */
			setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...formData } : t)));
		} else {
			/*
                http.post("/api/credentials", formData)
                    .then(() => toast.success("Team added!"))
                    .catch((err) => toast.error(err));
            */
			setTeams((prev) => [...prev, { id: Date.now(), ...formData, updated: "just now", status: "Active" }]);
		}
		setOpenForm(false);
	};

	return (
		<>
			<CredentialsForm open={openForm} onClose={() => setOpenForm(false)} onConfirm={onConfirm} team={selectedTeam} />

			<Dialog open={openDelete} onClose={handleDeleteClose}>
				<DialogTitle sx={{ px: 4, pt: 4, pb: 0 }} component="div">
					<Typography variant="h6" fontWeight={700}>
						Are you sure?
					</Typography>
				</DialogTitle>

				<DialogContent sx={{ px: 4, pt: 2, pb: 0 }}>
					<Typography variant="body2" color="text.secondary">
						This will permanently delete this team and remove all associated credentials. This action cannot be undone.
					</Typography>
				</DialogContent>

				<DialogActions sx={{ px: 4, pt: 3, pb: 4 }}>
					<Button onClick={handleDeleteClose} variant="ghost" sx={{ minWidth: 100 }}>
						Cancel
					</Button>

					<Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ minWidth: 100 }}>
						Delete Team
					</Button>
				</DialogActions>
			</Dialog>

			<Box>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
					<Box>
						<Typography variant="h5" fontWeight={700}>
							Team Credentials Management
						</Typography>

						<Typography variant="body2" color="text.secondary" mt={0.5}>
							Manage GitHub and Jira credentials for all teams
						</Typography>
					</Box>

					<Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}>
						Add New Team
					</Button>
				</Box>

				<TextField
					placeholder="Search teams..."
					size="small"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					sx={{ mb: 3 }}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
							</InputAdornment>
						),
					}}
				/>

				<TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "grey.300", borderRadius: 2 }}>
					<Table>
						<TableHead>
							<TableRow sx={{ backgroundColor: "background.default" }}>
								{TABLE_COLUMNS.map((col) => (
									<TableCell key={col} sx={{ color: "text.secondary" }}>
										{col}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredTeams.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
										No teams found.
									</TableCell>
								</TableRow>
							) : (
								filteredTeams.map((team) => (
									<TableRow key={team.id} hover>
										<TableCell sx={{ fontWeight: 500 }}>{team.name}</TableCell>

										<TableCell>
											<Badge label={team.platform} />
										</TableCell>

										<TableCell sx={{ color: "text.secondary" }}>{team.url}</TableCell>

										<TableCell>
											<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
												<AccessTimeIcon sx={{ fontSize: 14 }} />
												{team.updated}
											</Box>
										</TableCell>

										<TableCell>
											<Badge label={team.status} />
										</TableCell>

										<TableCell>
											<Box sx={{ display: "flex", gap: 0.3 }}>
												<IconButton size="small" onClick={() => handleEdit(team)}>
													<CreateOutlinedIcon fontSize="small" sx={{ color: "#2563eb" }} />
												</IconButton>

												<IconButton size="small" color="error" onClick={() => handleDeleteClick(team)}>
													<DeleteOutlineOutlinedIcon fontSize="small" />
												</IconButton>
											</Box>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
}

export default CredentialsPage;
