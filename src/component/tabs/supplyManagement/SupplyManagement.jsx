import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    capitalize,
    Drawer,
    Grid,
    Icon,
    Input,
    makeStyles,
    Paper,
    TextField,
    Typography,
    useTheme,
    List,
    ListItem,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import Timeline from "component/timeline/Timeline";
import kuzzle from "services/kuzzle";
import kuzzleService from "services/kuzzle/kuzzle.service";
import moment from "moment";

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

const SupplyManagement = ({ replenishments = [], events = [] }) => {
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
                <Grid item xs={12}>
                    <Paper
                        variant="outlined"
                        elevation={0}
                        className={classes.formContainer}
                        style={{ minHeight: "450px" }}
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

    const eventGroups = [
        {
            departure: {
                date: Date.parse("01 Jan 1970 00:00:01 GMT"),
            },
            arrival: {
                date: Date.parse("31 Dec 2025 23:59:59 GMT"),
            },
        },
    ];

    const handleTntButtonClick = (replenishment) => (event) => {
        console.log(event);
        event.stopPropagation();
        setTrackedReplenishment(replenishment);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs>
                {/* {forcasted.length > 0 && ( */}
                <div className={classes.root}>
                    <Typography variant="h4">Forecasted</Typography>
                    <Box>
                        {forcasted.map((replenishment) => (
                            <SupplyManagementReplenishmentForecasted
                                key={replenishment._id}
                                replenishment={replenishment}
                            />
                        ))}
                    </Box>
                </div>
                {/* )} */}
                {accepted.length > 0 && (
                    <div className={classes.root}>
                        <Typography variant="h4">Accepted</Typography>
                        <Box>
                            {accepted.map((replenishment) => (
                                <SupplyManagementReplenishmentAccepted
                                    key={replenishment._id}
                                    replenishment={replenishment}
                                    onTntClick={handleTntButtonClick}
                                />
                            ))}
                        </Box>
                    </div>
                )}
            </Grid>
            {trackedReplenishment !== null && (
                <Grid item xs={3}>
                    <Typography variant="h4">Track &and; Trace</Typography>
                    <Paper className={classes.drawerPaper}>
                        <Timeline groups={eventGroups} events={[]} />
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

const SupplyManagementReplenishmentForecasted = ({ replenishment }) => {
    const [quantity, setQuantity] = useState(replenishment._source.quantity);

    const updateReplinishment = () => {
        kuzzleService.acceptForecastedReplenishment(replenishment, quantity);
    };

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
                    The system forcasted that you'll be in need of
                </Typography>
                <Typography style={{ fontWeight: "bold" }}>
                    &nbsp;{replenishment._source.quantity} "
                    {replenishment._source.containerSubType} containers"
                </Typography>
                .
                <Typography style={{ textAlign: "right" }}>
                    ({replenishment._id})
                </Typography>
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
    onTntClick,
}) => {
    const classes = useStyles();

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading} variant="body1">
                    The system forcasted that you'll be in need of{" "}
                    {replenishment._source.quantity}{" "}
                    {replenishment._source.containerSubType}{" "}
                </Typography>
                {/* <Typography className={classes.secondaryHeading}>
                    {replenishment._source.containerSubType}
                </Typography> */}
            </AccordionSummary>
            <AccordionDetails>
                {replenishment._source.proposal && (
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
    console.log(replenishment._source.proposal);

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
                {replenishment._source.proposal.provider} proposes{" "}
                {replenishment._source.proposal.quantity} out of{" "}
                {replenishment._source.quantity}{" "}
                {replenishment._source.containerSubType}{" "}
                {replenishment._source.containerType} for{" "}
                {replenishment._source.proposal.price}${" "}
                {!!replenishment?._source?.proposal?.deliveryDate?.proposed
                    ? "in " +
                      moment(
                          replenishment._source.proposal.deliveryDate.proposed
                      ).fromNow() +
                      " (" +
                      moment(
                          replenishment._source.proposal.deliveryDate.proposed
                      ).toISOString() +
                      ")"
                    : ""}
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
