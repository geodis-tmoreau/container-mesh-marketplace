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

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        maxWidth: 500,
    },
});

function App() {
<<<<<<< HEAD
    const [kuzzleIndex, setKuzzleIndex] = useLocalStorage(
        "kuzzleIndex",
        "tenant-sdl-geodis1"
    );

    const [tabIndex, setTabIndex] = useState("1");
    const [locations, setLocations] = useState([]);
    const [replenishments, setReplenishments] = useState([]);
    const [events, setEvents] = useState([]);
    const [jitEvents, setJitEvents] = useState([]);
    const [stepIndex /* what are you doing stepIndex ??*/, setStepIndex] =
        useState(1);
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
                console.log("Received notification", notification);
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
=======

  const [kuzzleIndex, setKuzzleIndex] = useLocalStorage('kuzzleIndex', 'tenant-sdl-geodis1');

  const [tabIndex, setTabIndex] = useState("1");
  const [locations, setLocations] = useState([])
  const [sessions, setSessions] = useState([])
  const [replenishments, setReplenishments] = useState([])
  const [events, setEvents] = useState([])
  const [jitEvents, setJitEvents] = useState([])
  const [stepIndex /* what are you doing stepIndex ??*/, setStepIndex] = useState(1);
  const [actor, setActor] = useState(actors[0]);

  /**
   *
   * @param {string} collection
   * @param {Array<Object>} target
   * @returns
   */
  const subscribeForCollection = (collection, target, setTarget) => {
    kuzzle.realtime.subscribe(kuzzleService.index, collection, {}, (notification) => {
      console.log("Received notification", notification)
      if (notification.type !== 'document') return;
      const elemIndex = target.findIndex(o => o._id === notification.result._id)
      if (notification.scope === 'in') {
        if (elemIndex !== -1) {
          target[elemIndex] = notification.result;
          setTarget([...target])
        } else {
          target.push(notification.result);
          setTarget([...target])
        }
      } else {
        target.splice(elemIndex, 1)
        setTarget([...target])
      }
    })
  }

  useEffect(() => {
    async function init() {
      await kuzzleService.init(kuzzleIndex)

      const availableSessions = await kuzzleService.getSessions()
      setSessions(availableSessions);

      const resultLocations = await kuzzleService.getLocations()
      const resultReplenishments = await kuzzleService.getReplenishments()
      const resultEvents = await kuzzleService.getEvents()
      const resultJitEvents = await kuzzleService.getJitEvents()

      subscribeForCollection("locations", locations, setLocations)
      subscribeForCollection("replenishments", replenishments, setReplenishments)
      subscribeForCollection("events", events, setEvents)
      subscribeForCollection("jit-events", jitEvents, setJitEvents)

      setLocations(resultLocations.hits);
      setReplenishments(resultReplenishments.hits);
      setEvents(resultEvents.hits);
      setJitEvents(resultJitEvents.hits);
      setStepIndex(1);

    }
    init()
    return () => kuzzle.disconnect()
  }, [kuzzleIndex])

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // type: prefersDarkMode ? "dark" : "light",
          type: "dark",
          primary: {
            main: "#82c7a5"
          },
          secondary: {
            main: "#f15e22"
          },
          background: {
            default: "#1b212c"
          }
        },
        typography: {
          h6: {
            color: "#d9ead3"
          }
        },
        overrides: {
          MuiAppBar: {
            root: {
              borderBottom: "1px solid #d9ead3"
            }
          },
          MuiTab: {
            textColorInherit: {
              '&$selected': {
                color: "#d9ead3",
              }
>>>>>>> eef38f72faec537fb050ce78794cac3fabb8d0d5
            }
        );
    };

    useEffect(() => {
        async function init() {
            await kuzzleService.init(kuzzleIndex);
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
            console.log(resultEvents.hits);

            setLocations(resultLocations.hits);
            setReplenishments(resultReplenishments.hits);
            setEvents(resultEvents.hits);
            setJitEvents(resultJitEvents.hits);
            setStepIndex(1);
        }
<<<<<<< HEAD
        init();
        return () => kuzzle.disconnect();
    }, [kuzzleIndex]);

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    const theme = useMemo(
        () =>
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
            }),
        []
    );

    const classes = makeStyles();

    const onPlayStep = () => {
        setStepIndex(stepIndex + 1);
        kuzzleService.playStep(stepIndex + 1);
    };

    const onResetStep = () => {
        setStepIndex(1);
        kuzzleService.reset();
        setTabIndex("1");
    };

    const onActorChange = (e) => {
        setActor(actors.find((a) => a.id === e.target.value));
        setTabIndex("1");
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ReplenishmentsContext.Provider value={replenishments}>
                <Router>
                    <Page
                        title="ContainerMesh"
                        kuzzleIndex={kuzzleIndex}
                        setKuzzleIndex={setKuzzleIndex}
                        stepIndex={stepIndex}
                        onPlayStep={onPlayStep}
                        onResetStep={onResetStep}
                        actor={actor}
                        onActorChange={onActorChange}
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
                                    <ForecastTab locations={locations} />
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
                                        <Tab label="replenishments" value="1" />
                                    </TabList>
                                </Paper>
                                <TabPanel value="1">
                                    <ProposalTab />
                                </TabPanel>
                            </TabContext>
                        )}
                    </Page>
                </Router>
            </ReplenishmentsContext.Provider>
        </ThemeProvider>
    );
=======
      }),
    []
  );

  const classes = makeStyles();

  const onPlayStep = async () => {
    await kuzzleService.playStep(stepIndex + 1);
    setStepIndex(stepIndex + 1);
  }

  const onResetStep = async () => {
    await kuzzleService.reset()
    setStepIndex(1)
    setTabIndex("1");
  }

  const onActorChange = (e) => {
    setActor(actors.find(a => a.id === e.target.value))
    setTabIndex("1");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReplenishmentsContext.Provider value={replenishments} >

        <Router>
          <Page title="ContainerMesh" sessions={sessions} kuzzleIndex={kuzzleIndex} setKuzzleIndex={setKuzzleIndex} stepIndex={stepIndex} onPlayStep={onPlayStep} onResetStep={onResetStep}
            actor={actor} onActorChange={onActorChange}>
            {actor.type === STOCK_MANAGER ?
              (<TabContext value={tabIndex}>
                <Paper square className={classes.root}>
                  <TabList value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)}>
                    <Tab label="Forecast" value="1" />
                    <Tab label={<Badge badgeContent={replenishments.length} color="error">Supply Management</Badge>} value="2" />
                  </TabList>
                </Paper>
                <TabPanel value="1">
                  <ForecastTab locations={locations} />
                </TabPanel>
                <TabPanel value="2">

                  <SupplyManagement replenishments={replenishments} events={[...events, ...jitEvents]} />

                </TabPanel>
              </TabContext>) :
              (<TabContext value={tabIndex}>
                <Paper square className={classes.root}>
                  <TabList value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)}>
                    <Tab label="ECRAN 3" value="1" />
                  </TabList>
                </Paper>
                <TabPanel value="1">
                  <ProposalTab />
                </TabPanel>
              </TabContext>)}
          </Page>
        </Router>
      </ReplenishmentsContext.Provider>
    </ThemeProvider>
  );
>>>>>>> eef38f72faec537fb050ce78794cac3fabb8d0d5
}

export default App;
