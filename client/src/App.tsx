import { createContext, useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Home as HomePage } from "./pages/Home";
import { Missions as MissionsPage } from "./pages/Missions";
import { Weather as WeatherPage } from "./pages/Weather";
import { Preferences as PreferencesPage } from "./pages/Preferences";
import { _404 } from "./pages/_404";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Theme } from "@mui/system";

export const ThemeContext = createContext<any>(undefined);

export const ThemeContextProvider = (props: any) => {
  const [theme, setTheme] = useState<Theme>(
    createTheme({
      palette: {
        mode: "light",
      },
    })
  );

  const handleUpdateTheme = (newTheme: any) => {
    setTheme(
      createTheme({
        palette: {
          mode: "light",
          primary: newTheme,
        },
      })
    );
  };

  const darkMode = () => {
    setTheme(
      createTheme({
        palette: {
          mode: "dark",
        },
      })
    );
  };

  const reset = () => {
    setTheme(
      createTheme({
        palette: {
          mode: "light",
        },
      })
    );
  };

  return (
    <ThemeContext.Provider
      value={{ theme, handleUpdateTheme, reset, darkMode }}
    >
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

function App() {
  // const ThemeContext = useContext(context);
  return (
    <HelmetProvider>
      <Helmet>
        <title>{process.env.REACT_APP_TITLE}</title>
      </Helmet>
      <ThemeContextProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/Preferences" element={<PreferencesPage />} />
          <Route path="*" element={<_404 />} />
        </Routes>
      </ThemeContextProvider>
    </HelmetProvider>
  );
}

export default App;
