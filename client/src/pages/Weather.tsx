import React, { Suspense, useEffect, useState, lazy } from "react";
import { Container, Typography, Grid } from "@mui/material";
import { AppLayout } from "../layouts/AppLayout";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission } from "../graphql/schema";

const LocationForecast = lazy(() => import("../components/LocationForecast"));

type SortField = "Title" | "Date" | "Operator";

interface MissionsResponse {
  data: {
    Missions: Mission[];
  };
}

const getMissions = async (
  sortField: SortField,
  sortDesc?: Boolean
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
  {
    Missions(
      sort: {
        field: ${sortField},
        desc: ${sortDesc ? sortDesc : false}
      }
    ) {
      id
      title
      operator
      launch {
        date
        location {
          name
        }
      }
    }
  }
  `,
    []
  );
};

const Weather = (): JSX.Element => {
  const [sortField, setSortField] = useState<SortField>("Title");
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [errMessage, setErrMessage] = useState<String | null>(null);
  const [sortDesc] = useState<boolean>(false);

  useEffect(() => {
    getMissions(sortField, sortDesc)
      .then((result: MissionsResponse) => {
        setMissions(result.data.Missions);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions.");
        console.log(err);
      });
  }, [sortField, sortDesc]);

  console.log({ missions });
  return (
    <AppLayout title="Weather">
      <Container maxWidth="xl">
        {missions?.map((mission) => (
          <>
            <Typography gutterBottom variant="h5" component="div">
              {mission.title} - {mission.launch.location.name}
            </Typography>
            <Grid
              container
              columns={{ xs: 1, md: 4, lg: 12 }}
              gap={2}
              justifyContent="center"
              sx={{
                marginBottom: "4rem",
              }}
            >
              <Suspense fallback={<p>Loading...</p>}>
                {/* <Location location={mission.launch.location.name} /> */}
                <LocationForecast location={mission.launch.location.name} />
              </Suspense>
            </Grid>
          </>
        ))}
      </Container>
    </AppLayout>
  );
};

export { Weather };
