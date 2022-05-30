import { SyntheticEvent, useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission } from "../graphql/schema";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
  Grid,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Toolbar,
  Container,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  DialogContentText,
} from "@mui/material";

import {
  Add as AddIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { ListMenu } from "../components/ListMenu";

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
        desc: ${sortDesc}
      }
    ) {
      id
      title
      operator
      launch {
        date
        vehicle
        location {
          name
          longitude
          latitude
        }
      }
      orbit {
        periapsis
        apoapsis
        inclination
      }
      payload {
        capacity
        available
      }
    }
  }
  `,
    []
  );
};

const createMissions = async (mission: any) => {
  const randomLocation = () => {
    const LOCATION = [
      "KSC LC-39A",
      "Vandenberg SLC-4",
      "Cape Canaveral SLC-40",
      "Vandenberg SLC-6",
      "KSC LC-39B",
    ];

    return LOCATION[Math.floor(Math.random() * 4)];
  };
  const randomVehicle = () => {
    const VEHICLES = ["Nimrod V", "Vulture 9", "Epsilon IV"];
    return VEHICLES[Math.floor(Math.random() * 3)];
  };

  const randomNumber = (num: number) => {
    return Math.floor(Math.random() * num);
  };

  const randomData = {
    title: mission.title,
    operator: mission.operator,
    launch: {
      date: mission.date,
      vehicle: randomVehicle(),
      location: {
        name: randomLocation(),
        longitude: randomNumber(100),
        latitude: randomNumber(100),
      },
    },
    orbit: {
      periapsis: randomNumber(200),
      apoapsis: randomNumber(300),
      inclination: randomNumber(50),
    },
    payload: {
      capacity: randomNumber(22000) + 5000,
      available: randomNumber(7000) + 2000,
    },
  };
  return await fetchGraphQL(
    `
    mutation CreateMission($mission:  MissionInput!){
    createMission(
      mission: $mission
    ) {
      id
      title
      operator
      launch {
        date
        vehicle
        location {
          name
          longitude
          latitude
        }
      }
      orbit {
        periapsis
        apoapsis
        inclination
      }
      payload {
        capacity
        available
      }
    }
  }
  `,
    { mission: randomData }
  );
};

const updateMission = async (mission: any) => {
  const { date, ...restMission } = mission;
  return await fetchGraphQL(
    `
    mutation UpdateMission($mission:  MissionInputUpdate!){
      updateMission(
      mission: $mission
    ) {
      id
      title
      operator
      launch {
        date
        vehicle
        location {
          name
          longitude
          latitude
        }
      }
      orbit {
        periapsis
        apoapsis
        inclination
      }
      payload {
        capacity
        available
      }
    }
  }
  `,
    {
      mission: {
        ...restMission,
        launch: {
          ...restMission.launch,
          date: date,
        },
      },
    }
  );
};

const deleteMission = async (mission: any) => {
  return await fetchGraphQL(
    `
    mutation DeleteMission($mission:  MissionInputUpdate!){
      deleteMission(
      mission: $mission
    ) {
      id
      title
      operator
      launch {
        date
        vehicle
        location {
          name
          longitude
          latitude
        }
      }
      orbit {
        periapsis
        apoapsis
        inclination
      }
      payload {
        capacity
        available
      }
    }
  }
  `,
    {
      mission,
    }
  );
};
interface FormValue {
  title: String;
  operator: String;
}
const Missions = (): JSX.Element => {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [newMissionOpen, setNewMissionOpen] = useState(false);
  const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("Title");
  const [errMessage, setErrMessage] = useState<String | null>(null);
  const [formValue, setFormValue] = useState<FormValue>({
    title: "",
    operator: "",
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [newEditMissionOpen, setNewEditMissionOpen] = useState<boolean>(false);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<
    number | null
  >(null);

  const handleErrClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrMessage(null);
  };

  const handleNewMissionOpen = () => {
    setTempLaunchDate(null);
    setNewMissionOpen(true);
    setFormValue({ title: "", operator: "" });
  };

  const handleNewMissionClose = () => {
    setNewMissionOpen(false);
  };

  const handleClickOpenDeleteDialog = (key: number) => {
    setSelectedMissionIndex(key);
    setIsDeleteOpen(true);
  };

  const handleClickCloseDeleteDialog = () => {
    setSelectedMissionIndex(null);
    setIsDeleteOpen(false);
  };

  const handleNewEditMissionOpen = (index: number) => {
    setNewEditMissionOpen(true);
    setSelectedMissionIndex(index);
  };

  const handleNewEditMissionClose = () => {
    setNewEditMissionOpen(false);
    setSelectedMissionIndex(null);
  };

  const handleSetFormValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmitNewMission = async () => {
    const mission = await createMissions({
      ...formValue,
      date: tempLaunchDate,
    });
    if (missions) {
      setMissions([mission.data.createMission, ...missions]);
    } else {
      setMissions([mission.data.createMission]);
    }
    handleNewMissionClose();
  };

  const handleUpdateMission = async () => {
    if (missions && selectedMissionIndex) {
      const data = await updateMission({
        ...missions[selectedMissionIndex],
        ...formValue,
        date: tempLaunchDate,
      });

      const updatedMissions = missions.map((mission) => {
        if (data.data.updateMission.id === mission.id) {
          return data.data.updateMission;
        }
        return mission;
      });
      setMissions(updatedMissions);
      handleNewEditMissionClose();
    }
  };

  const handleDeleteMission = async () => {
    console.log({ selectedMissionIndex, missions });
    if (missions && selectedMissionIndex !== null) {
      console.log("here");
      const data = await deleteMission({
        ...missions[selectedMissionIndex],
      });

      const updatedMissions = missions.filter(
        (mission) => data.data.deleteMission.id !== mission.id
      );
      setMissions(updatedMissions);
      handleClickCloseDeleteDialog();
    }
  };

  const handleTempLaunchDateChange = (newValue: Date | null) => {
    setTempLaunchDate(newValue);
  };

  const handleSortFieldChange = (event: SyntheticEvent, value: SortField) => {
    setSortField(value);
  };
  const handleSortDescClick = () => {
    setSortDesc(!sortDesc);
  };

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

  useEffect(() => {
    if (selectedMissionIndex && newEditMissionOpen && missions) {
      setFormValue({
        title: missions?.[selectedMissionIndex]["title"]
          ? missions[selectedMissionIndex]["title"]
          : "",
        operator: missions?.[selectedMissionIndex]["operator"]
          ? missions?.[selectedMissionIndex]["operator"]
          : "",
      });
      setTempLaunchDate(missions[selectedMissionIndex]["launch"]["date"]);
    }
  }, [selectedMissionIndex]);

  return (
    <AppLayout title="Missions">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Solar Rocket Missions
        </Typography>

        <Toolbar disableGutters>
          <Grid justifyContent="flex-end" container>
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <ListMenu
              options={["Date", "Title", "Operator"]}
              endIcon={<SortIcon />}
              onSelectionChange={handleSortFieldChange}
            />
            <IconButton onClick={handleSortDescClick}>
              {sortDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Toolbar>

        {missions ? (
          <Grid container spacing={2}>
            {" "}
            {missions.map((mission: Mission, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={mission.title}
                    subheader={new Date(mission.launch.date).toDateString()}
                  />
                  <CardContent>
                    <Typography noWrap>{mission.operator}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleNewEditMissionOpen(key);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleClickOpenDeleteDialog(key)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        <Tooltip title="New Mission">
          <Fab
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            color="primary"
            aria-label="add"
            onClick={handleNewMissionOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <Dialog
          open={newMissionOpen}
          onClose={handleNewMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>New Mission</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  id="name"
                  label="Title"
                  name="title"
                  variant="standard"
                  fullWidth
                  onChange={handleSetFormValue}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  label="Operator"
                  variant="standard"
                  name="operator"
                  fullWidth
                  onChange={handleSetFormValue}
                />
              </Grid>

              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    minDate={new Date()}
                    minTime={new Date()}
                    label="Launch Date"
                    value={tempLaunchDate}
                    onChange={handleTempLaunchDateChange}
                    renderInput={(params) => (
                      <TextField variant="standard" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewMissionClose}>Cancel</Button>
            <Button
              onClick={handleSubmitNewMission}
              disabled={
                formValue.title.length === 0 ||
                formValue.operator.length === 0 ||
                tempLaunchDate === null
              }
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={newEditMissionOpen}
          onClose={handleNewEditMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Mission</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  id="name"
                  label="Title"
                  name="title"
                  variant="standard"
                  fullWidth
                  value={formValue.title}
                  onChange={handleSetFormValue}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  label="Operator"
                  variant="standard"
                  name="operator"
                  fullWidth
                  value={formValue.operator}
                  onChange={handleSetFormValue}
                />
              </Grid>

              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    minDate={new Date()}
                    minTime={new Date()}
                    label="Launch Date"
                    value={tempLaunchDate}
                    onChange={handleTempLaunchDateChange}
                    renderInput={(params) => (
                      <TextField variant="standard" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewEditMissionClose}>Cancel</Button>
            <Button onClick={handleUpdateMission}>Edit</Button>
          </DialogActions>
        </Dialog>

        <div>
          <Dialog
            open={isDeleteOpen}
            onClose={handleClickCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Warning!</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This process will delete the data forever.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickCloseDeleteDialog} autoFocus>
                Disagree
              </Button>
              <Button
                onClick={handleDeleteMission}
                color="error"
                variant="contained"
              >
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Container>
      <Snackbar
        open={errMessage != null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrClose}
      >
        <Alert onClose={handleErrClose} variant="filled" severity="error">
          {errMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

const EditDialog = () => {};

export { Missions };
