import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Snackbar,
    Typography,
} from "@material-ui/core";
import { availabilities } from "constants";
import MuiAlert from "@material-ui/lab/Alert";
import kuzzleService from "services/kuzzle/kuzzle.service";
import { ViewArray } from "@material-ui/icons";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    tableHead: {
        "& > th ": {
            fontWeight: "bold",
            fontSize: theme.typography.fontWeightBold,
        },
    },
}));

const AvailabilityRow = ({ availability, onSubmitAvailability }) => {
    const [submitted, setSubmitted] = useState(false);
    const onSubmit = () => {
        setSubmitted(true);
        availability = true;
        onSubmitAvailability();
    };

    return (
        <TableRow>
            <TableCell>{availability.carrier}</TableCell>
            <TableCell>{availability.pickUp}</TableCell>
            <TableCell>{availability.returnLocation}</TableCell>
            <TableCell>{availability.leaseRate}&nbsp;USD</TableCell>
            <TableCell>
                {submitted ? (
                    <Typography color="primary">Submitted</Typography>
                ) : (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onSubmit}
                    >
                        Submit request
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
};

const AvailabilityTable = ({}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const [containers, setContainers] = useState([]);

    useEffect(() => {
        const retrieveContainers = async () => {
            const containers = await kuzzleService.getContainers();
            setContainers(containers.hits);
        };
        retrieveContainers();
    }, []);

    const onSubmitAvailability = () => {
        setTimeout(() => {
            setOpen(true);
        }, 500);
    };

    return (
        <>
            <TableContainer component={Paper} style={{ marginTop: "-5px" }}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell>Carrier</TableCell>
                            <TableCell>Pick up location</TableCell>
                            <TableCell>Return location</TableCell>
                            <TableCell>Daily lease rate</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {availabilities?.map((a) => (
                            <AvailabilityRow
                                availability={a}
                                onSubmitAvailability={onSubmitAvailability}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={open}
                autoHideDuration={6000}
                message="Container booking confirmed"
                severity="success"
            >
                <DialogTitle id="simple-dialog-title">
                    Container booking confirmed
                </DialogTitle>
                <DialogContent style={{ width: "30vw", overflowY: "auto" }}>
                    {detailsOpen && (
                        <List>
                            {containers.map((container) => {
                                return (
                                    <ListItem key={container._id} button>
                                        <ListItemAvatar>
                                            <ViewArray color="primary" />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${container._source.reference}`}
                                            secondary="Container type 20GP"
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        size="small"
                        onClick={() => setDetailsOpen(!detailsOpen)}
                    >
                        {detailsOpen ? "Hide details" : "Show details"}
                    </Button>
                    <Button
                        color="secondary"
                        size="small"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AvailabilityTable;
