import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import { makeStyles } from "@material-ui/core/styles";
import locationService from "services/location.service";
import { useMemo } from "react";
import { useTheme } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
    iconError: {
        color: theme.palette.error.dark,
    },
}));

const LocationItem = ({ location, selected, onSelect }) => {
    const theme = useTheme();
    const classes = useStyles();

    const isUnderMin = useMemo(
        () => locationService.isUnderMinThreshold(location),
        [location]
    );
    const isAboveMax = useMemo(
        () => locationService.isAboveMaxThreshold(location),
        [location]
    );

    const iconColor = useMemo(() => {
        if (!!isUnderMin) {
            return theme.palette.error.dark;
        } else if (!!isAboveMax) {
            return theme.palette.warning.dark;
        }
        return theme.palette.success.main;
    }, [isUnderMin, isAboveMax, theme]);

    return (
        <ListItem
            button
            onClick={onSelect(location)}
            selected={selected?._id === location._id}
        >
            <ListItemIcon style={{ color: iconColor }}>
                {isUnderMin || isAboveMax ? <ErrorIcon /> : <CheckCircleIcon />}
            </ListItemIcon>
            <ListItemText primary={location._source.lo.locationName} />
        </ListItem>
    );
};

const LocationList = ({ locations, className, selected, onSelect }) => {
    const classes = useStyles();

    return (
        <List component="nav" className={className}>
            {locations.map((location) => (
                <LocationItem
                    selected={selected}
                    onSelect={onSelect}
                    location={location}
                    key={location._id}
                />
            ))}
        </List>
    );
};

export default LocationList;
