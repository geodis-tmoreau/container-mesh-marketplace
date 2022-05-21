import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TextField, Button } from "@material-ui/core";
import moment from "moment";
import kuzzleService from 'services/kuzzle/kuzzle.service';
import { useTheme } from '@material-ui/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Row = ({ replenishment, locations, price, quantity, onPriceChange, onQuantityChange }) => {
  const classes = useStyles();
    console.log(replenishment)
    const disabled = replenishment._id !== "msc-20p-rotterdam-week-4"

  return (
    <TableRow key={replenishment._id}>
      <TableCell component="th" scope="row">
        {replenishment._source.requestor}
      </TableCell>
      <TableCell align="right">{locations?.hits?.find(loc => loc._id === replenishment._source.location)?._source.lo.locationName}</TableCell>
      <TableCell align="right">{replenishment._source.containerSubType}</TableCell>
      <TableCell align="right">{moment('12-31-2021').add(parseInt(replenishment._source.requestedDate.split('-').at(-1)), "week").format("L")}</TableCell>
      <TableCell align="right">{replenishment._source.quantity}</TableCell>
      <TableCell align="right">
        <TextField
          id="standard-basic"
          className={classes.formTextField}
          label="Quantity"
          value={quantity}
          onChange={e => onQuantityChange(e.target.value)}
          style={{ marginRight: "2rem" }}
          disabled={disabled}
        /></TableCell>
        <TableCell align="right">
        <TextField
          id="standard-basic"
          className={classes.formTextField}
          label="Price"
          value={price}
          onChange={e => onPriceChange(e.target.value)}
          style={{ marginRight: "2rem" }}
          disabled={disabled}
        />
      </TableCell>
    </TableRow>
  )
}


const TableProposal = ({ replenishments=[], locations =[] }) => {
    const theme = useTheme();
  const classes = useStyles();
  const [proposals, setProposals] = useState([])

  const onQuantityChange = (replishmentId) => (quantity) => {
    const proposal = proposals.find(p=> p.id === replishmentId);
    if(!proposal) {
        proposals.push({
            id: replishmentId,
            quantity
        })
    }else {
        proposal.quantity = quantity;
    }
    setProposals([...proposals])
  }

  const onPriceChange = (replishmentId) => (price) => {
    const proposal = proposals.find(p=> p.id === replishmentId);
    if(!proposal) {
        proposals.push({
            id: replishmentId,
            price
        })
    }else {
        proposal.price = price;
    }
    setProposals([...proposals])
  }


  const onSubmit =()=> {
      if(!proposals[0]?.quantity) {
          alert("Quantity cannot be null");
      }
      else if(!proposals[0]?.price) {
          alert("Price cannot be null");
      }else {
          kuzzleService.putProposal(proposals[0]?.quantity, proposals[0]?.price)
      }
  }

  return (
    <TableContainer component={Paper} style={{    marginTop: "-5px"}}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Owner</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell align="right">Container type</TableCell>
            <TableCell>Requested date</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell>Quantity proposed</TableCell>
            <TableCell>Price proposed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {replenishments?.map(replishment => {
            const proposal = proposals.find(p=> p.id === replishment._id);
            return (<Row 
            replenishment={replishment} 
            locations={locations}
            price={proposal?.price}
            quantity={proposal?.quantity}
            onPriceChange={onPriceChange(replishment._id)} 
            onQuantityChange={onQuantityChange(replishment._id)} />)})}
        </TableBody>
      </Table>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            <Button variant="contained" color="primary" style={{margin: "1rem"}} disabled={replenishments.length === 0}
            onClick={onSubmit}>
                Submit
            </Button>
        </div>
    </TableContainer>
  );
}

export default TableProposal;