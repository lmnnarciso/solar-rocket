import { Button, Container, Grid } from "@mui/material";
import { AppLayout } from "../layouts/AppLayout";

import {
  lightBlue,
  blue,
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
} from "@mui/material/colors";
import { ThemeContext } from "../App";
import { useContext } from "react";

const Preferences = (): JSX.Element => {
  const { handleUpdateTheme, reset, darkMode } = useContext<any>(ThemeContext);
  const themeList = [
    [lightBlue, "Light Blue"],
    [blue, "Blue"],
    [red, "Red"],
    [pink, "Pink"],
    [purple, "Purple"],
    [deepPurple, "Deep Purple"],
    [indigo, "Indigo"],
    [cyan, "Cyan"],
    [teal, "Teal"],
    [green, "Green"],
    [lightGreen, "Light Green"],
    [lime, "Lime"],
    [yellow, "Yellow"],
    [amber, "Amber"],
    [orange, "Orange"],
    [deepOrange, "Deep Orange"],
    [brown, "Brown"],
    [grey, "Grey"],
    [blueGrey, "Blue Grey"],
  ];
  return (
    <AppLayout title="Preferences">
      <Container maxWidth="lg">
        <div>Preferences!</div>
        <Grid container gap={4}>
          {themeList.map((colorTheme: any) => (
            <Grid item gap={2}>
              <Button
                variant="contained"
                sx={{
                  // color: colorTheme[0][500],
                  bgcolor: colorTheme[0][500],
                }}
                onClick={() => handleUpdateTheme(colorTheme[0])}
              >
                {/* {colorTheme[1]} */}
                {colorTheme[1]}
              </Button>
            </Grid>
          ))}
          <Button variant="contained" onClick={() => reset()}>
            Reset
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "black", color: "white" }}
            onClick={() => darkMode()}
          >
            Dark mode
          </Button>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export { Preferences };
