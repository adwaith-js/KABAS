import { Paper, Typography } from "@mui/material";

const paddingMap = { sm: 1.5, md: 3 };
const titleVariant = { sm: "caption", md: "body2" };

function StatCard({ title, value, subtitle, valueColor = "text.primary", bg, size = "md" }) {
	return (
		<Paper
			elevation={0}
			sx={{
				p: paddingMap[size],
				border: "1px solid",
				borderColor: "grey.200",
				borderRadius: 3,
				flex: 1,
				backgroundColor: bg || "background.paper",
				boxShadow: bg ? "none" : "0px 2px 8px rgba(0, 0, 0, 0.08)",
			}}
		>
			<Typography variant={titleVariant[size]} fontWeight={500} color={valueColor} display="block">
				{title}
			</Typography>

			<Typography variant="h6" fontWeight={700} color={valueColor}>
				{value}
			</Typography>

			{subtitle && (
				<Typography variant="caption" color={valueColor}>
					{subtitle}
				</Typography>
			)}
		</Paper>
	);
}

export default StatCard;
