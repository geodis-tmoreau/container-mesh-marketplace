import "./App.css";
import kuzzle from "./services/kuzzle";
import { useEffect, useState, useMemo } from "react";
import Page from "component/Page";
import CssBaseline from "@material-ui/core/CssBaseline";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router } from "react-router-dom";
import { Badge, makeStyles, Paper, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import ForecastTab from "component/tabs/forecast/ForecastTab";
import SupplyManagement from "component/tabs/supplyManagement/SupplyManagement";
import kuzzleService from "services/kuzzle/kuzzle.service";
import useLocalStorage from "hooks/useLocalStorage";
import { actors, STOCK_MANAGER } from "constants";
import ProposalTab from "component/tabs/proposal/ProposalTab";
import ReplenishmentsContext from "contexts/ReplenishmentsContext";
import RentTab from "component/tabs/renting/RentTab";

function App() {
  window.kuzzle = kuzzle;

  const [kuzzleIndex, setKuzzleIndex] = useLocalStorage(
    "kuzzleIndex",
    "tenant-sdl-geodis1"
  );

  const [currentSession, setCurrentSession] = useState(null);
  const [canPlayStep3, setCanPlayStep3] = useState(false);
  const [tabIndex, setTabIndex] = useState("1");
  const [locations, setLocations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [replenishments, setReplenishments] = useState([]);
  const [events, setEvents] = useState([]);
  const [jitEvents, setJitEvents] = useState([]);
  const [stepIndex /* what are you doing stepIndex ??*/, setStepIndex] =
    useState(0);
  const [actor, setActor] = useState(actors[0]);

  /**
   *
   * @param {string} collection
   * @param {Array<Object>} target
   * @returns
   */
  const subscribeForCollection = (collection, target, setTarget) => {
    kuzzle.realtime.subscribe(
      kuzzleService.index,
      collection,
      {},
      (notification) => {
        if (notification.type !== "document") return;
        const elemIndex = target.findIndex(
          (o) => o._id === notification.result._id
        );
        if (notification.scope === "in") {
          if (elemIndex !== -1) {
            target[elemIndex] = notification.result;
            setTarget([...target]);
          } else {
            target.push(notification.result);
            setTarget([...target]);
          }
        } else {
          target.splice(elemIndex, 1);
          setTarget([...target]);
        }
      }
    );
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        // type: prefersDarkMode ? "dark" : "light",
        type: "dark",
        primary: {
          main: "#82c7a5",
        },
        secondary: {
          main: "#f15e22",
        },
        background: {
          default: "#1b212c",
        },
      },
      typography: {
        h6: {
          color: "#d9ead3",
        },
      },
      overrides: {
        MuiAccordionSummary: {
          root: {
            color: "#d9ead3"
          }
        },
        MuiAppBar: {
          root: {
            borderBottom: "1px solid #d9ead3",
          },
        },
        MuiTab: {
          textColorInherit: {
            "&$selected": {
              color: "#d9ead3",
            },
          },
        },
      },
    })
  );

  useEffect(() => {
    async function init() {
      await kuzzleService.init(kuzzleIndex);
      const availableSessions = await kuzzleService.getSessions();
      setSessions(availableSessions);

      const resultLocations = await kuzzleService.getLocations();
      const resultReplenishments =
        await kuzzleService.getReplenishments();
      const resultEvents = await kuzzleService.getEvents();
      const resultJitEvents = await kuzzleService.getJitEvents();

      subscribeForCollection("locations", locations, setLocations);
      subscribeForCollection(
        "replenishments",
        replenishments,
        setReplenishments
      );
      subscribeForCollection("events", events, setEvents);
      subscribeForCollection("jit-events", jitEvents, setJitEvents);

      setLocations(resultLocations.hits);
      setReplenishments(resultReplenishments.hits);
      setEvents(resultEvents.hits);
      setJitEvents(resultJitEvents.hits);

      const session = await kuzzleService.getCurrentSession();
      let selectedSession = session || availableSessions[0];
      console.log({selectedSession})
      setCurrentSession(selectedSession);

      await kuzzle.realtime.subscribe(
        kuzzleService.index,
        'replenishments',
        {
          "exists": "proposal.quantity"
        },
        () => {
          setCanPlayStep3(true);
        },
        { scope: 'in' })

      await kuzzleService.init(kuzzleIndex);
      setStepIndex(0);
    }
    init();
  }, []);

  const classes = makeStyles();

  const onPlayStep = () => {
    kuzzleService.playStep(stepIndex + 1)
      .then(() => {
        setStepIndex(stepIndex + 1);
      })
      .catch(e => {
        alert(`${e.message}: reload the application to start a new session`)
      })
  };

  const onResetStep = () => {
    kuzzleService.reset()
      .then(() => {
        setStepIndex(1);
        setTabIndex("1");
      })
      .catch(e => {
        alert(`${e.message}: reload the application to start a new session`)
      })
  };

  const onActorChange = (e) => {
    setActor(actors.find((a) => a.id === e.target.value));
    setTabIndex("1");
  };

  const startSession = (session) => {
    kuzzleService.startSession(session)
      .then(() => {
        setCurrentSession(session);
      })
      .catch(e => {
        alert(`${e.message}: reload the application to start a new session`)
      })
  }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ReplenishmentsContext.Provider value={replenishments}>
                <Router>
                    <Page
                        title="ContainerMesh"
                        canPlayStep3={canPlayStep3}
                        sessions={[currentSession, ...sessions]}
                        kuzzleIndex={kuzzleIndex}
                        setKuzzleIndex={setKuzzleIndex}
                        stepIndex={stepIndex}
                        onPlayStep={onPlayStep}
                        onResetStep={onResetStep}
                        actor={actor}
                        onActorChange={onActorChange}
                        currentSession={currentSession}
                        startSession={startSession}
                    >
                        {actor.type === STOCK_MANAGER ? (
                            <TabContext value={tabIndex}>
                                <Paper square className={classes.root}>
                                    <TabList
                                        value={tabIndex}
                                        onChange={(event, newValue) =>
                                            setTabIndex(newValue)
                                        }
                                    >
                                        <Tab label="Forecast" value="1" />
                                        <Tab
                                            label={
                                                <Badge
                                                    badgeContent={
                                                        replenishments.length
                                                    }
                                                    color="error"
                                                >
                                                    Supply Management
                                                </Badge>
                                            }
                                            value="2"
                                        />
                                    </TabList>
                                </Paper>
                                <TabPanel value="1">
                                    <ForecastTab
                                        locations={locations}
                                        stepIndex={stepIndex}
                                    />
                                </TabPanel>
                                <TabPanel value="2">
                                    <SupplyManagement
                                        locations={locations}
                                        replenishments={replenishments}
                                        events={[...events, ...jitEvents]}
                                    />
                                </TabPanel>
                            </TabContext>
                        ) : (
                            <TabContext value={tabIndex}>
                                <Paper square className={classes.root}>
                                    <TabList
                                        value={tabIndex}
                                        onChange={(event, newValue) =>
                                            setTabIndex(newValue)
                                        }
                                    >
                                        <Tab
                                            label="Propose transports"
                                            value="1"
                                        />
                                        <Tab label="Rent container" value="2" />
                                    </TabList>
                                </Paper>
                                <TabPanel value="1">
                                    <ProposalTab />
                                </TabPanel>
                                {/* <TabPanel value="2">
                                    <RentTab />
                                </TabPanel> */}
                            </TabContext>
                        )}
                    </Page>
                </Router>
            </ReplenishmentsContext.Provider>
        </ThemeProvider>
    );
}

export default App;
