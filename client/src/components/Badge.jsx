import { Chip } from "@mui/material";

function Badge({ label }) {
	let backgroundColor = "#ffffff";
	let icon = null;

	switch (label) {
		case "GitHub":
			backgroundColor = "#233449";
			icon = <img src="https://cdn.simpleicons.org/github/white" width={12} height={12} />;
			break;
		case "Jira":
			backgroundColor = "#0052CC";
			icon = <img src="https://cdn.simpleicons.org/jira/white" width={12} height={12} />;
			break;
		case "Active":
			backgroundColor = "#16a34a";
			break;
		case "Inactive":
			backgroundColor = "#9ca3af";
			break;
	}

	return (
		<Chip
			label={label}
			size="small"
			icon={icon}
			sx={{
				backgroundColor: backgroundColor,
				color: "#ffffff",
				fontWeight: 500,
				fontSize: "12px",
				borderRadius: "6px",
			}}
		/>
	);
}

export default Badge;
