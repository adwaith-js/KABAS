import { AppBar, Toolbar, Box, Button, Typography, Divider, Avatar, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import InsertChartIcon from "@mui/icons-material/InsertChartRounded";
import LogoutIcon from "@mui/icons-material/Logout";

function Navbar() {
	return (
		<AppBar position="static" elevation={0} sx={{ py: 1, borderBottom: 1, borderColor: "divider" }}>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<InsertChartIcon sx={{ width: 48, height: 48, color: "primary.main" }} />

					<Box sx={{ ml: 1 }}>
						<Typography variant="h6" fontWeight="bold" lineHeight={1.1}>
							KABAS
						</Typography>

						<Typography variant="caption" color="text.secondary" display="block">
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

					<Avatar sx={{ width: 32, height: 32, backgroundColor: "primary.main" }} />
					<Typography>Instructor</Typography>

					<IconButton>
						<LogoutIcon />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
