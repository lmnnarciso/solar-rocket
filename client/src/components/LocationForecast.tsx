import {
  Card,
  CardContent,
  Typography,
  Box,
  CardMedia,
  Grid,
} from "@mui/material";
import useFetch from "../hooks/useFetch";
import { GiSunset, GiSunrise, GiSunRadiations } from "react-icons/gi";
import { BsCloudRain } from "react-icons/bs";

interface Condition {
  code: number;
  icon: string;
  text: string;
}
interface ForecastDay {
  astro: {
    moon_illumination: string;
    moon_phase: string;
    moonrise: string;
    moonset: string;
    sunrise: string;
    sunset: string;
  };
  date: string | Date;
  date_epoch: number;
  day: {
    avghumidity: number;
    avgtemp_c: number;
    avgtemp_f: number;
    avgvis_km: number;
    avgvis_miles: number;
    daily_chance_of_rain: number;
    daily_chance_of_snow: number;
    daily_will_it_rain: number;
    daily_will_it_snow: number;
    maxtemp_c: number;
    maxtemp_f: number;
    maxwind_kph: number;
    maxwind_mph: number;
    mintemp_c: number;
    mintemp_f: number;
    totalprecip_in: number;
    totalprecip_mm: number;
    uv: number;
    condition: Condition;
  };
}

interface ForecastData {
  forecast: {
    forecastday: ForecastDay[];
  };
}

const Location = ({ location }: { location: String }): JSX.Element => {
  const { data, error } = useFetch<ForecastData>(
    `https://api.weatherapi.com/v1/forecast.json?key=3848974e0ab04c84919160311223005&q=${location}&days=5&aqi=no&alerts=no`
  );

  if (data) {
    return (
      <>
        {data?.forecast.forecastday.map((item) => (
          <Card
            sx={{
              padding: "1rem 2rem",
            }}
          >
            <CardContent>
              <Typography
                textAlign="center"
                variant="h5"
                color="text.primary"
                gutterBottom
              >
                {new Date(item.date).toLocaleDateString("en-US", {
                  weekday: "long",
                })}{" "}
                - {item.date.toString()}
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 64, marginLeft: "auto", marginRight: "auto" }}
              src={item.day.condition.icon}
            />
            <Box component="div">
              <Grid container spacing={2} columns={12}>
                <DayInfo
                  label="Sunrise"
                  info={item.astro.sunrise}
                  icon={<GiSunrise style={{ height: "100%", width: 40 }} />}
                />

                <DayInfo
                  label="Sunset"
                  info={item.astro.sunset}
                  icon={<GiSunset style={{ height: "100%", width: 40 }} />}
                />
                <DayInfo
                  label="Humidity"
                  info={item.day.avghumidity}
                  icon={<BsCloudRain style={{ height: "100%", width: 40 }} />}
                />
                <DayInfo
                  label="UV"
                  info={item.day.uv}
                  icon={
                    <GiSunRadiations style={{ height: "100%", width: 40 }} />
                  }
                />
              </Grid>
            </Box>
            <Typography sx={{ marginTop: 2 }} variant="h5" textAlign="center">
              Temperature: {item.day.avgtemp_c}&#8451;
            </Typography>
          </Card>
        ))}
      </>
    );
  }

  return <></>;
};

interface DayInfo {
  label: string;
  info: string | number;
  icon: JSX.Element;
}

const DayInfo = ({ label, info, icon }: DayInfo) => {
  return (
    <Grid item xs={6}>
      <Box sx={{ display: "flex" }}>
        <Box>{icon}</Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <p style={{ margin: 0 }}>{label}</p>
          <p style={{ margin: 0 }}>{info}</p>
        </Box>
      </Box>
    </Grid>
  );
};

export default Location;
