import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	Button,
	Stack,
	Box,
	IconButton,
	InputAdornment,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

function CredentialsForm({ open, onClose, onConfirm, team }) {
	const [showToken, setShowToken] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		platform: "GitHub",
		url: "",
		token: "",
	});

	const isFormValid = Object.values(formData).every((v) => v.trim() !== "");

	useEffect(() => {
		if (team) {
			setFormData({ name: team.name, platform: team.platform, url: team.url, token: "" });
		} else {
			setFormData({ name: "", platform: "GitHub", url: "", token: "" });
		}
	}, [team]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ px: 4, pt: 4, pb: 0 }} component="div">
				<Typography variant="h6" fontWeight={700}>
					{team ? "Edit Team" : "Add New Team"}
				</Typography>

				<Typography variant="subtitle2" color="text.secondary" fontWeight={400} mt={0.5}>
					{team ? "Update team credentials and information." : "Enter the team credentials to connect to their Kanban board."}
				</Typography>
			</DialogTitle>

			<DialogContent sx={{ px: 4, pt: 3, pb: 0 }}>
				<Stack spacing={2} mt={2}>
					<Box>
						<Typography variant="body2" fontWeight={500} mb={0.5}>
							Team Name
						</Typography>

						<TextField name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Team Alpha" size="small" fullWidth />
					</Box>

					<Box>
						<Typography variant="body2" fontWeight={500} mb={0.5}>
							Platform
						</Typography>

						<FormControl fullWidth size="small">
							<Select name="platform" value={formData.platform} onChange={handleChange}>
								<MenuItem value="GitHub">GitHub</MenuItem>
								<MenuItem value="Jira">Jira</MenuItem>
							</Select>
						</FormControl>
					</Box>

					<Box>
						<Typography variant="body2" fontWeight={500} mb={0.5}>
							Repository URL
						</Typography>

						<TextField
							name="url"
							value={formData.url}
							onChange={handleChange}
							placeholder="github.com/team-name/repository"
							size="small"
							fullWidth
						/>
					</Box>

					<Box>
						<Typography variant="body2" fontWeight={500} mb={0.5}>
							API Token / Credentials
						</Typography>

						<TextField
							name="token"
							value={formData.token}
							onChange={handleChange}
							placeholder="Enter API token"
							type={showToken ? "text" : "password"}
							size="small"
							fullWidth
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowToken(!showToken)} edge="end" size="small">
											{showToken ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						<Typography variant="caption" color="text.secondary">
							Your credentials are encrypted and stored securely.
						</Typography>
					</Box>
				</Stack>
			</DialogContent>

			<DialogActions sx={{ px: 4, pt: 3, pb: 4 }}>
				<Button onClick={onClose} variant="ghost" sx={{ minWidth: 100 }}>
					Cancel
				</Button>

				<Button variant="contained" onClick={() => onConfirm(formData, team?.id)} disabled={!isFormValid} sx={{ minWidth: 100 }}>
					{team ? "Update Team" : "Add Team"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CredentialsForm;
