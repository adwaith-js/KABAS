import { createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
		background: {
			default: "#F8FAFC",
			paper: "#FFFFFF",
		},
		primary: {
			main: "#2c5f8d",
			dark: "#234a6f",
		},
		status: {
			active: "#16a34a",
			inactive: "#9ca3af",
		},
		platform: {
			github: "#233449",
			jira: "#0052CC",
		},
		task: {
			completed: { main: "#16a34a", light: "#f0fdf4" },
			inProgress: { main: "#2563eb", light: "#eff6ff" },
			backlog: { main: "#ea580c", light: "#fff7ed" },
			total: { main: "#000000", light: "#f5f5f5" },
		},
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: ({ theme }) => ({
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
				}),
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: 8,
					boxShadow: "none",
					"&:hover": { boxShadow: "none" },
					"&:active": { boxShadow: "none" },
				},
				contained: {
					"&.Mui-disabled": {
						backgroundColor: "#93b8d8",
						color: "#ffffff",
					},
				},
			},
			variants: [
				{
					props: { variant: "ghost" },
					style: ({ theme }) => ({
						color: theme.palette.text.primary,
						"&:hover": { backgroundColor: theme.palette.grey[200] },
					}),
				},
				{
					props: { variant: "nav" },
					style: ({ theme }) => ({
						color: theme.palette.text.primary,
						"&:hover": { backgroundColor: theme.palette.grey[200] },
						"&.active": {
							color: "#ffffff",
							backgroundColor: theme.palette.primary.main,
						},
					}),
				},
			],
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: 8,
					backgroundColor: theme.palette.grey[100],
					"& fieldset": { border: `1px solid ${theme.palette.grey[300]}` },
					"&:hover fieldset": { border: `1px solid ${theme.palette.grey[400]}` },
					"&.Mui-focused fieldset": {
						border: `2px solid ${theme.palette.primary.main}`,
					},
				}),
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: { borderRadius: 12 },
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					fontSize: "14px",
					borderColor: "#f0f0f0",
				},
				head: {
					fontSize: "11px",
					fontWeight: 700,
					letterSpacing: "0.05em",
					textTransform: "uppercase",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
				},
			},
		},
	},
});

export default theme;
