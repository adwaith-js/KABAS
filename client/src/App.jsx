import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";

import DashboardPage from "./pages/DashboardPage";
import CredentialsPage from "./pages/CredentialsPage";
import Navbar from "./components/Navbar";
import theme from "./theme";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<ToastContainer />
				<Navbar />
				<Box sx={{ p: 4 }}>
					<Routes>
						<Route path="/" element={<Navigate to="/dashboard" />} />
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/credentials" element={<CredentialsPage />} />
					</Routes>
				</Box>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
