import { AppBar, Toolbar, Box, Button, Typography, Divider, Avatar, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";

import InsertChartIcon from "@mui/icons-material/InsertChartRounded";
import LogoutIcon from "@mui/icons-material/Logout";

function Navbar() {
	return (
		<AppBar
			position="static"
			elevation={0}
			sx={{ py: 1, borderBottom: 1, borderColor: "divider", backgroundColor: "background.paper", color: "text.primary" }}
		>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Box>
						<InsertChartIcon sx={{ width: 48, height: 48, color: "primary.main" }} />
					</Box>

					<Box sx={{ ml: 1 }}>
						<Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1.1 }}>
							KABAS
						</Typography>
						<Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block" }}>
							Kanban Board Assessment System
						</Typography>
					</Box>
				</Box>

				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Button variant="nav" component={NavLink} to="/dashboard">
						Dashboard
					</Button>
					<Button variant="nav" component={NavLink} to="/credentials">
						Team Credentials
					</Button>

					<Divider orientation="vertical" flexItem />

					<Avatar sx={{ width: 32, height: 32, backgroundColor: "primary.main" }}></Avatar>
					<Typography>Instructor</Typography>

					<IconButton sx={{ padding: "1" }}>
						<LogoutIcon />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
