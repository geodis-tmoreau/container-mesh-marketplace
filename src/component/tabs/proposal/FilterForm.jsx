import { Paper, TextField, Select, MenuItem, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
    formContainer: {
      padding: theme.spacing(2)
    },
  }));

const FilterForm =({onSearch, locations}) => {

    const classes = useStyles();

    const [fromLocation, setFromLocation] = useState(0)
    const [toLocation, setToLocation] = useState(0)
    const [departureDate, setDepartureDate] = useState()
    const [arrivalDate, setArrivalDate] = useState()

    const onClick= () => {
        onSearch({fromLocation, toLocation, departureDate, arrivalDate, radius: 500, dateRange: 1})
    }

    return (<Paper variant="outlined" elevation={0} className={classes.formContainer}>
    <div style={{display:"flex", marginBottom: "1rem"}}>
        <Select 
            id="standard-basic" 
            className={classes.formTextField} 
            onChange={e=>setFromLocation(e.target.value)}
            label="From" 
            value={fromLocation} 
            style={{marginRight: "2rem", width: "12rem"}}
            >
                <MenuItem key="none" value="0">None</MenuItem>        
                {locations?.hits?.map(loc=> 
                    <MenuItem key={loc._id} value={loc._id}>{loc._source.lo.locationName}</MenuItem>
                )}
        </Select>
        <Select 
            id="standard-basic" 
            className={classes.formTextField} 
            onChange={e=>setToLocation(e.target.value)}
            label="To" 
            value={toLocation} 
            style={{marginRight: "2rem", width: "12rem"}}
            >
                <MenuItem key="none" value="0">None</MenuItem>        
                {locations?.hits?.map(loc=> 
                    <MenuItem key={loc._id} value={loc._id}>{loc._source.lo.locationName}</MenuItem>
                )}
        </Select>
        <Select
        value={500}
        style={{marginRight: "1rem"}}
        label="Radius"
        disabled
        >
        <MenuItem value={500}>500 KM</MenuItem>
        </Select>
     </div>
    
     <div style={{display:"flex", marginBottom: "1rem"}}>
        <TextField 
            id="standard-basic" 
            className={classes.formTextField} 
            label="Departure date" 
            value={departureDate} 
            onChange={e=>setDepartureDate(e.target.value)}
            style={{marginRight: "2rem", width: "12rem"}}
        />
        <TextField 
            id="standard-basic" 
            className={classes.formTextField} 
            label="Arrival date" 
            value={arrivalDate} 
            onChange={e=>setArrivalDate(e.target.value)}
            style={{marginRight: "2rem", width: "12rem"}}
        />
        <Select
        value={1}
        style={{marginRight: "1rem"}}
        label="Radius"
        disabled
        >
        <MenuItem value={1}>+/- 1 week</MenuItem>
        </Select>

     </div>
    <Button variant="contained" color="primary" onClick={onClick}>Search</Button>
    
    </Paper>)
}

export default FilterForm;