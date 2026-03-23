import { Chip, useTheme } from "@mui/material";

function Badge({ label }) {
	const theme = useTheme();

	let backgroundColor = theme.palette.background.paper;
	let icon = null;

	switch (label) {
		case "GitHub":
			backgroundColor = theme.palette.platform.github;
			icon = <img src="https://cdn.simpleicons.org/github/white" width={12} height={12} alt="GitHub" />;
			break;
		case "Jira":
			backgroundColor = theme.palette.platform.jira;
			icon = <img src="https://cdn.simpleicons.org/jira/white" width={12} height={12} alt="GitHub" />;
			break;
		case "Active":
			backgroundColor = theme.palette.status.active;
			break;
		case "Inactive":
			backgroundColor = theme.palette.status.inactive;
			break;
	}

	return (
		<Chip
			label={label}
			size="small"
			icon={icon}
			sx={{
				backgroundColor,
				color: "#ffffff",
				fontWeight: 500,
				fontSize: "12px",
				borderRadius: "6px",
			}}
		/>
	);
}

export default Badge;
