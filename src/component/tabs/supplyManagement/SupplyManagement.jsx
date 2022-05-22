import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Grid,
    makeStyles,
    Paper,
    TextField,
    Typography,
    ListItem,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useState } from "react";
import Timeline from "component/timeline/Timeline";
import kuzzleService from "services/kuzzle/kuzzle.service";
import moment from "moment";
import { useTheme } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    heading: {
        // fontSize: theme.typography.pxToRem(15),
        // flexBasis: "3 0 0",
        // flexShrink: 0,
        lineHeight: theme.typography.pxToRem(35),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    drawerPaper: {
        padding: theme.spacing(2),
    },
}));

const SupplyManagement = ({
    replenishments = [],
    events = [],
    locations = [],
}) => {
    const classes = useStyles();

    const [trackedReplenishment, setTrackedReplenishment] = useState(null);

    if (replenishments.length === 0) {
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item xs={12} style={{ width: "100%", padding: "1rem" }}>
                    <Paper
                        variant="outlined"
                        elevation={0}
                        className={classes.formContainer}
                        style={{ minHeight: "450px", padding: "1rem" }}
                    >
                        No replenishments detected by the system
                    </Paper>
                </Grid>
            </Grid>
        );
    }

    const forcasted = replenishments.filter(
        (replenishment) => replenishment._source.status === "FORECASTED"
    );
    const accepted = replenishments.filter(
        (replenishment) => replenishment._source.status !== "FORECASTED"
    );

    const timelineEvents = events.map((event) => {
        if (event._id.startsWith("vessel_")) {
            // 1R event
            return {
                linkedObject: event._source.resourceId,
                location: {
                    lat: -118.25752258300781,
                    lon: 33.736902846767954,
                },
                performedBy: {
                    branch: {
                        branchName: event._source.event.createdBy.partyName,
                    },
                },
                dateTime: event._source.event.eventCreatedDateTime,
                eventCode: event._source.event.code,
                eventName: "Allocate " + event._source.event.description,
                eventTypeIndicator: "picto",
            };
        } else {
            let eventName;

            if (event._source.portCallServiceTypeCode === "SOSP") {
                eventName = "SOSP leave USLAX";
            } else if (event._source.portCallServiceTypeCode === "ETA-BERTH") {
                eventName = "ETA NLRTM " + event._source.remark;
            } else if (event._source.portCallServiceTypeCode === "RTA-BERTH") {
                eventName = "RTA terminal " + event._source.remark;
            } else if (event._source.portCallServiceTypeCode === "PTA-BERTH") {
                eventName = "PTA " + event._source.remark;
            } else if (event._source.portCallServiceTypeCode === "ATA-BERTH") {
                eventName = "ATA " + event._source.eventCreatedDateTime;
            }
            // DCSA event
            const location =
                event._source.vesselPosition || event._source.eventLocation;
            return {
                linkedObject:
                    event._source.transportCall.vessel.vesselName +
                    "," +
                    event._source.transportCall.vessel.vesselIMONumber,
                location: {
                    lat: location ? location.latitude : null,
                    lon: location ? location.longitude : null,
                },
                performedBy: {
                    branch: {
                        branchName: event._source.publisher.partyName,
                    },
                },
                dateTime: event._source.eventCreatedDateTime,
                eventCode: event._source.portCallServiceTypeCode,
                eventName,
                eventTypeIndicator: "??",
            };
        }
    });

    const timelineEventGroups = [
        {
            name: "Events",
            departure: {
                date: moment("2022-01-01T04:00:00Z"),
                location: {
                    id: "https://api.onerecord.fr/locations/uslax",
                    geolocation: {
                        id: "https://api.onerecord.fr/locations/uslax/geolocation",
                        elevation: {
                            unit: "m",
                            value: 0.0,
                        },
                        latitude: 33.74021,
                        longitude: 118.265,
                    },
                    code: "USLAX",
                    locationName: "Los Angeles",
                    locationType: "Port",
                },
            },
            arrival: {
                date: moment("2022-01-30T10:50:02Z"),
                location: {
                    id: "https://api.onerecord.fr/locations/nlrtm",
                    geolocation: {
                        id: "https://api.onerecord.fr/locations/nlrtm/geolocation",
                        elevation: {
                            unit: "m",
                            value: 0.0,
                        },
                        latitude: 51.95138,
                        longitude: 4.05362,
                    },
                    code: "NLRTM",
                    locationName: "Rotterdam",
                    locationType: "Port",
                },
            },
            checkPoints: [
                {
                    date: moment("2022-01-01T04:00:00Z"),
                    location: {
                        id: "https://api.onerecord.fr/locations/uslax",
                        geolocation: {
                            id: "https://api.onerecord.fr/locations/uslax/geolocation",
                            elevation: {
                                unit: "m",
                                value: 0.0,
                            },
                            latitude: 33.74021,
                            longitude: 118.265,
                        },
                        code: "USLAX",
                        locationName: "Los Angeles",
                        locationType: "Port",
                    },
                },
                {
                    date: moment("2022-01-30T10:50:02Z"),
                    location: {
                        id: "https://api.onerecord.fr/locations/nlrtm",
                        geolocation: {
                            id: "https://api.onerecord.fr/locations/nlrtm/geolocation",
                            elevation: {
                                unit: "m",
                                value: 0.0,
                            },
                            latitude: 51.95138,
                            longitude: 4.05362,
                        },
                        code: "NLRTM",
                        locationName: "Rotterdam",
                        locationType: "Port",
                    },
                },
            ],
            events: [],
        },
    ];

    const handleTntButtonClick = (replenishment) => (event) => {
        event.stopPropagation();
        setTrackedReplenishment(replenishment);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs>
                <div className={classes.root}>
                    <Typography variant="h4">
                        Forecasted replenishments ({forcasted?.length || 0})
                    </Typography>
                    <Box>
                        {forcasted.map((replenishment) => (
                            <SupplyManagementReplenishmentForecasted
                                key={replenishment._id}
                                replenishment={replenishment}
                                locations={locations}
                            />
                        ))}
                    </Box>
                </div>
                <div className={classes.root}>
                    <Typography variant="h4" style={{ padding: "1rem 0" }}>
                        Confirmed replenishments ({accepted?.length || 0})
                    </Typography>
                    <Box>
                        {accepted.map((replenishment) => (
                            <SupplyManagementReplenishmentAccepted
                                key={replenishment._id}
                                replenishment={replenishment}
                                locations={locations}
                                onTntClick={handleTntButtonClick}
                            />
                        ))}
                    </Box>
                </div>
            </Grid>
            {trackedReplenishment !== null && (
                <Grid item xs={3}>
                    <Typography variant="h4">Track & Trace</Typography>
                    <Paper className={classes.drawerPaper}>
                        <Timeline
                            groups={timelineEventGroups}
                            events={timelineEvents}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setTrackedReplenishment(null)}
                        >
                            Close
                        </Button>
                    </Paper>
                </Grid>
            )}
        </Grid>
    );
};

const SupplyManagementReplenishmentForecasted = ({
    replenishment,
    locations,
}) => {
    const [quantity, setQuantity] = useState(replenishment._source.quantity);

    const updateReplinishment = () => {
        kuzzleService.acceptForecastedReplenishment(replenishment, quantity);
    };

    const location = locations.find(
        (loc) => loc._id === replenishment._source.location
    );

    return (
        <ListItem
            component={Paper}
            style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "space-between",
                padding: "1rem",
            }}
        >
            <div style={{ display: "flex", alignContent: "center" }}>
                <Typography>
                    The system forecasted you will need{" "}
                    {replenishment._source.quantity}{" "}
                    {replenishment._source.containerSubType} containers by week{" "}
                    {replenishment._source.requestedDate.split("-").at(-1)}
                    {!!location
                        ? " at " + location._source.lo.locationName
                        : ""}
                    .
                </Typography>
                {/* <Typography style={{ textAlign: "right" }}>
                    ({replenishment._id})
                </Typography> */}
            </div>
            <div style={{ display: "flex", alignContent: "center" }}>
                <TextField
                    label="Quantity"
                    variant="outlined"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <Button
                    color="primary"
                    variant="contained"
                    onClick={updateReplinishment}
                >
                    Validate
                </Button>
            </div>
        </ListItem>
    );
};

const SupplyManagementReplenishmentAccepted = ({
    replenishment,
    locations = [],
    onTntClick,
}) => {
    const classes = useStyles();
    const location = locations.find(
        (loc) => loc._id === replenishment._source.location
    );

    console.log(replenishment);

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading} variant="body1">
                    Ongoing replanishment of{" "}
                    <strong>
                        {replenishment._source.quantity -
                            (replenishment?._source?.proposal?.status ===
                                "CONFIRMED" ||
                            replenishment?._source?.proposal?.status ===
                                "COMPLETED"
                                ? replenishment._source.proposal.quantity
                                : 0)}
                    </strong>{" "}
                    <strong>{replenishment._source.containerSubType}</strong>{" "}
                    containers for{" "}
                    <strong>{replenishment._source.quantity}</strong> containers
                    on going for{" "}
                    <strong>
                        {!!location ? location._source.lo.locationName : ""}
                    </strong>{" "}
                    week{" "}
                    <strong>
                        {replenishment._source.requestedDate.split("-").at(-1)}
                    </strong>
                </Typography>
                {/* <Typography className={classes.secondaryHeading}>
                    {replenishment._source.containerSubType}
                </Typography> */}
            </AccordionSummary>
            <AccordionDetails>
                {replenishment._source.proposal?.deliveryDate && (
                    <SupplyManagementReplenishmentProposal
                        key={replenishment._id}
                        replenishment={replenishment}
                        onTntButton={onTntClick(replenishment)}
                    />
                )}
                {!replenishment._source.proposal.deliveryDate &&
                    "No proposal yet"}
            </AccordionDetails>
        </Accordion>
    );
};

/**
 * proposal: {
        deliveryDate: {
          proposed: "2022-01-29T00:00:00"
        },
        price,
        provider: "CMA-CGM",
        quantity,
        status: "PROPOSAL"
      },
 */
const SupplyManagementReplenishmentProposal = ({
    replenishment,
    onTntButton,
}) => {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Paper
            style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignContent: "center",
                padding: "1rem",
            }}
            variant="outlined"
        >
            <Typography className={classes.heading}>
                <strong>{replenishment._source.proposal.provider}</strong>{" "}
                {replenishment._source.proposal.status === "PROPOSAL"
                    ? "is proposing you to carry"
                    : replenishment._source.proposal.status === "COMPLETED"
                    ? "has delivered"
                    : "is carrying"}{" "}
                <strong>{replenishment._source.proposal.quantity}</strong> out
                of <strong>{replenishment._source.quantity}</strong>{" "}
                <strong>{replenishment._source.containerSubType}</strong>{" "}
                containers{" "}
                {replenishment._source.proposal.status === "COMPLETED" ? (
                    <>
                        on <strong>{moment("2022-12-30").format("L")}</strong>
                    </>
                ) : (
                    <>
                        to be delivered by{" "}
                        {replenishment._source.proposal.status ===
                            "PROPOSAL" && (
                            <strong>{moment("2022-12-30").format("L")}</strong>
                        )}
                        .
                    </>
                )}
            </Typography>
            <Typography
                className={classes.heading}
                style={{
                    justifyContent: "space-between",
                    alignContent: "center",
                    fontWeight: "bold",
                    color:
                        replenishment._source.proposal.status === "COMPLETED"
                            ? theme.palette.success.main
                            : theme.palette.text.main,
                }}
            >
                {replenishment._source.proposal.status}
            </Typography>
            {"COMPLETED" !== replenishment._source.proposal.status ? (
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() =>
                        kuzzleService.acceptProposal(replenishment._id)
                    }
                >
                    Accept the proposal ({replenishment._source.proposal.price}
                    $)
                </Button>
            ) : (
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onTntButton}
                >
                    Track
                </Button>
            )}
        </Paper>
    );
};

export default SupplyManagement;
