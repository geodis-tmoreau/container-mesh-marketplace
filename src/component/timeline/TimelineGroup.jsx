import { Timeline } from "@material-ui/lab";
import LocationItem from "component/timeline/LocationItem";
import EventItem from "component/timeline/EventItem";
import ArrivalItem from "component/timeline/Arrivaltem";
import DepartureItem from "component/timeline/DepartureItem";
import {
    Card,
    CardActions,
    Collapse,
    IconButton,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { Fragment, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import moment from "moment";

const useStyles = makeStyles({
    actionContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    timeline: {
        marginTop: "0",
    },
});

/**
 *
 * @typedef {Object} Group
 * @property {string} name
 * @property {TimelineItem} departure
 * @property {TimelineItem} arrival
 * @property {TimelineItem[]} checkPoints
 * @property {TimelineEvent[]} events
 */

/**
 *
 * @typedef {Object} TimelineItem
 * @property {moment} date
 * @property {Location} location
 */

/**
 *
 * @typedef {Object} Location
 * @property {string} id
 * @property {GeoLocation} geolocation
 * @property {string} code
 * @property {string} Shanghai
 * @property {string} Warehouse
 */

/**
 *
 * @typedef {Object} GeoLocation
 * @property {string} id
 * @property {Elevation} geolocation
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 *
 * @typedef {Object} TimelineEvent
 * @property {object} linkedObject
 * @property {object} location
 * @property {object} performedBy
 * @property {number} dateTime
 * @property {string} eventCode
 * @property {string} eventName
 * @property {string} eventTypeIndicator
 */

const GroupEvents = ({ group }) =>
    group.events
        .filter(
            (event) =>
                group.checkPoints.length === 0 ||
                moment(
                    group.checkPoints[group.checkPoints.length - 1].date
                ).isBefore(event.dateTime)
        )
        .map((event, i) => <EventItem event={event} key={event.id} />);

const GroupCheckPoints = ({ group }) =>
    group.checkPoints.length > 0 && (
        <>
            {group.checkPoints.map(({ date, location }, index) => (
                <Fragment key={group.name + "-" + index}>
                    {group.events
                        .filter((event) => {
                            if (index === 0) {
                                return moment(event.dateTime).isBefore(date);
                            } else {
                                return moment(event.dateTime).isBetween(
                                    moment(
                                        group.checkPoints[index - 1].date
                                    ).subtract(1, "s"),
                                    date
                                );
                            }
                        })
                        .map((event) => (
                            <EventItem event={event} key={event.id} />
                        ))}
                    <LocationItem
                        location={location}
                        date={date}
                        key="location"
                    />
                </Fragment>
            ))}
        </>
    );

/**
 *
 * @param {Object} param0
 * @param {Group} param0.group
 * @returns
 */
const TimelineGroup = ({ group }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const onExpandClick = () => {
        setOpen(!open);
    };

    return (
        <Card elevation={0} style={{ marginBottom: "1rem" }}>
            <CardActions
                disableSpacing
                onClick={onExpandClick}
                className={classes.actionContainer}
            >
                <Typography variant="h6">{group.name}</Typography>
                <IconButton aria-expanded={open} aria-label="show more">
                    {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </CardActions>
            <Timeline
                align="left"
                className={classes.timeline}
                style={{
                    paddingLeft: "1rem",
                    paddingRight: "0",
                    paddingTop: "0",
                    paddingBottom: "0",
                }}
            >
                <DepartureItem
                    locationName={group.departure.location.locationName}
                />
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <>
                        <GroupCheckPoints group={group} />
                        <GroupEvents group={group} />
                    </>
                </Collapse>
                <ArrivalItem
                    locationName={group.arrival.location.locationName}
                />
            </Timeline>
        </Card>
    );
};

export default TimelineGroup;
