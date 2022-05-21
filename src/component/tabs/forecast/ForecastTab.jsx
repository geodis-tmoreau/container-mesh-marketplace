import { TextField, MenuItem, Select, Paper, FormControl, InputLabel, useTheme } from '@material-ui/core';
import moment from "moment";
import Map from "component/map/Map";
import { makeStyles } from '@material-ui/core/styles';

import { useState } from "react";
import LocationList from "./LocationList";
import Charts from "./Charts";

import locationService from 'services/location.service';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  formContainer: {
    padding: theme.spacing(1)
  },
  formTextField: {
    marginRight: theme.spacing(1)
  }, listContainer: {
    padding: theme.spacing(1),
    display: "flex"
  }, placeList: {
    flex: "2 1 0",
    borderRightColor: theme.palette.divider,
    borderRightWidth: "2px",
    borderRightStyle: "solid",
    paddingRight: theme.spacing(1)
  }, placeChart: {
    flex: "5 2 0",
    paddingLeft: theme.spacing(1),
    minHeight: "450px"
  }
}));

/**
 * 
 * @param {Object} props
 * @param {Array} props.locations 
 * @returns 
 */
const ForecastTab = ({ locations }) => {
  const classes = useStyles();

  const [forecastRange, setForecastRange] = useState(60);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const theme = useTheme();

  const [viewState, setViewState] = useState({
    longitude: 7.048705213441168,
    latitude: 43.612549661913825,
    zoom: 1
  });

  // TODO :: use real date
  const fromDate = moment();

  const onSelectForecastRange = (event) => {
    setForecastRange(event.target.value);
  };

  const onSelectLocation = location => () => {
    // setViewState({
    //   longitude: location._source.lo.geolocation.longitude.value,
    //   latitude: location._source.lo.geolocation.latitude.value,
    //   zoom: 10
    // })
    setSelectedLocation(location);

  }

  return <>
    <Paper variant="outlined" elevation={0} className={classes.formContainer}>

      <TextField id="standard-basic" className={classes.formTextField} label="From" value={moment(fromDate).format("LLL")} disabled />
      <TextField id="standard-basic" className={classes.formTextField} label="To" value={moment(fromDate).add(forecastRange, "days").format("LLL")} disabled />

      <FormControl className={classes.formControl}>
        <InputLabel id="forcast-range-label">Forecast: </InputLabel>
        <Select
          labelId="forcast-range-label"
          id="demo-simple-select"
          displayEmpty
          value={"" + forecastRange}
          onChange={onSelectForecastRange}
        >
          {/* <MenuItem value={0}>
            <em>None</em>
          </MenuItem> */}
          <MenuItem value={60}>4 weeks</MenuItem>
        </Select>
      </FormControl>

    </Paper>

    <Map
      disableModeSwitch
      viewState={viewState}
      onMove={
        evt => setViewState(evt.viewState)
      }
      selected={selectedLocation?._id}
      pointsData={(forecastRange===0? [] :locations).map(l => {  
        return {
          id: l._id,
          coordinates: {
            latitude: l._source.lo.geolocation.latitude.value,
            longitude: l._source.lo.geolocation.longitude.value,
          },
          content: l._source.lo.locationName,
          color: locationService.getLocationColor(l, theme),
          textColor: theme.palette.common.black,
          radius: 20,
          onClick: onSelectLocation(l)
        }
      })}
    />

    <Paper variant="outlined" elevation={0} className={classes.listContainer}>
      <LocationList locations={forecastRange===0? [] :locations} className={classes.placeList}
        selected={selectedLocation}
        onSelect={onSelectLocation}

      />
      
      <div id="chart-container" className={classes.placeChart}>
        <Charts location={selectedLocation} />
      </div>
    </Paper>


  </>

}

export default ForecastTab;