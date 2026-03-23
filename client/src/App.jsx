import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";
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
						<Route path="/credentials" element={<CredentialsPage />}></Route>
					</Routes>
				</Box>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
