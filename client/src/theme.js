// theme.js
import { createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
		background: {
			default: "#F8FAFC",
			paper: "#FFFFFF",
		},
		primary: {
			main: "#2c5F8D",
			dark: "#234A6F",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: 8,
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
						color: "#000000",
						"&:hover": {
							backgroundColor: theme.palette.grey[200],
						},
					}),
				},
				{
					props: { variant: "nav" },
					style: ({ theme }) => ({
						color: "#000000",
						"&:hover": {
							backgroundColor: theme.palette.grey[200],
						},
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
				}),
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					borderRadius: 8,
				},
			},
		},
	},
});

export default theme;
