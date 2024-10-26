import { createTheme, ThemeProvider } from "@mui/material";
import Navbar from "@/lib/Navbar";
import "../app/globals.css";

const theme = createTheme({
    palette: {
        primary: {
          main: '#011F5B',
          light: '#1283c4',
          dark: '#063a9c',
          contrastText: '#fff',
        },
        secondary: {
          main: '#66d9ef',
          light: '#8bc34a',
          dark: '#2e865f',
          contrastText: '#333',
        },
    },
    typography: {
        fontFamily: ["EB Garamond", "serif", "400"].join(","),
    }
});

const App = ({Component, pageProps}) => {
    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Component {...pageProps} className="penn-font-400"/>
        </ThemeProvider>
    );
};

export default App;
