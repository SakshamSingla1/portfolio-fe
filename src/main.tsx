import "./index.css";
import App from "./App";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "react-jss";
import { BrowserRouter } from "react-router-dom";
import { defaultTheme } from './utils/theme';
import NavBar from "./components/molecules/NavBar/NavBar";
import Footer from "./components/molecules/Footer/Footer";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <HelmetProvider>
        <ThemeProvider theme={defaultTheme}>
            <BrowserRouter>
                <NavBar />
                <App />
                <Footer />
            </BrowserRouter>
        </ThemeProvider>
    </HelmetProvider>
);