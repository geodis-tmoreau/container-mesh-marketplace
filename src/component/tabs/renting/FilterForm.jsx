import {
    Paper,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
    formContainer: {
        padding: theme.spacing(2),
    },
}));

const FilterForm = ({ onSearch, locations }) => {
    const classes = useStyles();
    console.log(locations);

    const [fromLocation, setFromLocation] = useState(0);
    const [toLocation, setToLocation] = useState(0);
    const [departureDate, setDepartureDate] = useState();
    const [arrivalDate, setArrivalDate] = useState();
    const [containerType, setContainerType] = useState("0");

    const onClick = () => {
        onSearch({
            fromLocation,
            toLocation,
            departureDate,
            arrivalDate,
            radius: 500,
            dateRange: 1,
        });
    };

    return (
        <Paper
            variant="outlined"
            elevation={0}
            className={classes.formContainer}
        >
            <div style={{ display: "flex", marginBottom: "1rem" }}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="standard-from">From</InputLabel>
                    <Select
                        id="standard-from"
                        className={classes.formTextField}
                        onChange={(e) => setFromLocation(e.target.value)}
                        label="From"
                        value={fromLocation}
                        style={{ marginRight: "2rem", width: "12rem" }}
                    >
                        <MenuItem key="none" value="0">
                            None
                        </MenuItem>
                        {locations?.map((loc) => (
                            <MenuItem key={loc._id} value={loc._id}>
                                {loc._source.lo.locationName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel id="standard-to">To</InputLabel>
                    <Select
                        id="standard-to"
                        className={classes.formTextField}
                        onChange={(e) => setToLocation(e.target.value)}
                        label="To"
                        value={toLocation}
                        style={{ marginRight: "2rem", width: "12rem" }}
                    >
                        <MenuItem key="none" value="0">
                            None
                        </MenuItem>
                        {locations?.map((loc) => (
                            <MenuItem key={loc._id} value={loc._id}>
                                {loc._source.lo.locationName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel id="standard-type">Container type</InputLabel>
                    <Select
                        id="standard-type"
                        value={containerType}
                        style={{ marginRight: "2rem", width: "12rem" }}
                        label="Radius"
                        onChange={(e) => setContainerType(e.target.value)}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="20gp">20 GP</MenuItem>
                        <MenuItem value="40gp">40 GP</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div style={{ display: "flex", marginBottom: "1rem" }}>
                <TextField
                    id="standard-basic"
                    className={classes.formTextField}
                    label="Departure date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    style={{ marginRight: "2rem", width: "12rem" }}
                />
                <TextField
                    id="standard-basic"
                    className={classes.formTextField}
                    label="Arrival date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    style={{ marginRight: "2rem", width: "12rem" }}
                />
                <TextField
                    id="standard-basic"
                    className={classes.formTextField}
                    label="Quantity"
                    style={{ marginRight: "2rem", width: "12rem" }}
                />
            </div>
            <Button variant="contained" color="primary" onClick={onClick}>
                Search
            </Button>
        </Paper>
    );
};

export default FilterForm;
