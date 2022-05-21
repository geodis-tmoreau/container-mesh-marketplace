import { Accordion, AccordionDetails, AccordionSummary, Box, Button, capitalize, Drawer, Grid, Icon, Input, makeStyles, Paper, TextField, Typography, useTheme } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useEffect, useState } from "react";
import ReactJson from 'react-json-view'
import Timeline from "component/timeline/Timeline";
import kuzzle from "services/kuzzle";
import kuzzleService from "services/kuzzle/kuzzle.service";
import moment from 'moment';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  drawerPaper: {
    padding: theme.spacing(2),
  }
}));

const SupplyManagement = ({ replenishments = [], events = [] }) => {
  console.log(events)

  const classes = useStyles();

  const [trackedReplenishment, setTrackedReplenishment] = useState(null);

  const handleTntButtonClick = (replenishment) => (event) => {
    event.stopPropagation();
    setTrackedReplenishment(replenishment);
  }

  if (replenishments.length === 0) {
    return <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12}>
        <Paper variant="outlined" elevation={0} className={classes.formContainer} style={{ minHeight: "450px" }}>
          No replenishments detected by the system
        </Paper>
      </Grid>

    </Grid>

  }

  const forcasted = replenishments.filter(replenishment => replenishment._source.status === "FORECASTED")
  const accepted = replenishments.filter(replenishment => replenishment._source.status === "CONFIRMED" && !replenishment._source.proposal.deliveryDate)
  const proposal = replenishments.filter(replenishment => replenishment._source.status === "CONFIRMED" && replenishment._source.proposal.deliveryDate)

  const eventGroups = [{
    departure: {
      date: Date.parse('01 Jan 1970 00:00:01 GMT')
    },
    arrival: {
      date: Date.parse('31 Dec 2025 23:59:59 GMT')
    },
  }]

  return (
    <Grid container spacing={3}>
      <Grid item xs>
      <div className={classes.root}>
          <Typography variant="h4">Proposals</Typography>
          <Box>

            {proposal.map(replenishment => <SupplyManagementReplenishmentProposal key={replenishment._id} replenishment={replenishment} tntButtonAction={handleTntButtonClick(replenishment)} />)}
          </Box>
        </div>
        <div className={classes.root}>
          <Typography variant="h4">Forecasted</Typography>
          <Box>

            {forcasted.map(replenishment => <SupplyManagementReplenishmentForecasted key={replenishment._id} replenishment={replenishment} />)}
          </Box>
        </div>
        <div className={classes.root}>
          <Typography variant="h4">Accepted</Typography>
          <Box>

            {accepted.map(replenishment => <SupplyManagementReplenishmentAccepted key={replenishment._id} replenishment={replenishment} tntButtonAction={handleTntButtonClick(replenishment)} />)}
          </Box>
        </div>
        <Paper >
          <ReactJson theme="monokai" collapsed src={replenishments} />
        </Paper>
      </Grid>
      {trackedReplenishment !== null && (
        <Grid item xs={3}>
          <Typography variant="h4">Track & Trace</Typography>
          <Paper className={classes.drawerPaper}>
            <ReactJson theme="monokai" collapsed src={events} />
            <Timeline groups={eventGroups} events={[]} />
            <Button variant="contained" color="secondary" onClick={() => setTrackedReplenishment(null)}>
              Close
            </Button>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

}

const SupplyManagementReplenishmentForecasted = ({ replenishment }) => {

  const [quantity, setQuantity] = useState(replenishment._source.quantity)

  const updateReplinishment = () => {
    kuzzleService.acceptForecastedReplenishment(replenishment, quantity);
  }

  return <Accordion >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
    >
      <Typography >The system forcasted that you'll be in need of</Typography>
      <Typography style={{ fontWeight: "bold" }}>&nbsp;{replenishment._source.quantity} "{replenishment._source.containerSubType} containers"</Typography>.
      <Typography style={{ textAlign: 'right' }}>({replenishment._id})</Typography>



    </AccordionSummary>
    <AccordionDetails>
      <TextField label="Quantity" variant="outlined" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <Button color="primary" variant="contained" onClick={updateReplinishment} >Validate</Button>
    </AccordionDetails>
  </Accordion>
}

const SupplyManagementReplenishmentAccepted = ({ replenishment, tntButtonAction }) => {
  const classes = useStyles();

  return <Accordion >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
    >
      <Typography className={classes.heading}>The system forcasted that you'll be in need of {replenishment._source.quantity}  {replenishment._source.containerSubType}  </Typography>
      <Typography className={classes.secondaryHeading}>{replenishment._source.containerSubType}</Typography>
      <Button variant="contained" color="primary" onClick={tntButtonAction}>
        Track
      </Button>
    </AccordionSummary>
    <AccordionDetails>
      {replenishment._source.proposal.deliveryDate && "Valid"}
      {!replenishment._source.proposal.deliveryDate && "No proposal yet"}
    </AccordionDetails>
  </Accordion>
}

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
const SupplyManagementReplenishmentProposal = ({ replenishment }) => {
  const classes = useStyles();

  return <Accordion >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
    >
      <Typography className={classes.heading}>{replenishment._source.proposal.provider} proposes {replenishment._source.proposal.quantity} out of {replenishment._source.quantity} {replenishment._source.containerSubType} {replenishment._source.containerType} for {replenishment._source.proposal.price}$ in {moment(replenishment._source.proposal.deliveryDate.proposed).fromNow()} ({moment(replenishment._source.proposal.deliveryDate.proposed).toISOString()})</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Button color="primary" variant="contained" onClick={() => kuzzleService.acceptProposal(replenishment._id)}>Accept the proposal ({replenishment._source.proposal.price}$)</Button>
    </AccordionDetails>
  </Accordion>
}

export default SupplyManagement;