import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./Context/auth";
import theme from "./Styles/global";
import { ThemeProvider } from "@mui/material";
import Routes from "./Routes";
import SideBar from "./Components/SideBar";
import Footer from "./Components/Footer";
import { BrowserRouter, useLocation } from "react-router-dom";

function AppContent() {
  
  const location = useLocation();
  const hideSideBarRoutes = ["/"];

  const shouldShowSideBar = !hideSideBarRoutes.includes(location.pathname);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <div className="container">
            {shouldShowSideBar && <SideBar />}
            <div className="routes">
              <Routes />
            </div>
          </div>
          <Footer />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
