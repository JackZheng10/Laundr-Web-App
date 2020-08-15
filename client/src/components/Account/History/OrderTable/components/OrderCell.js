import React, { Component } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  withStyles,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import PropTypes from "prop-types";
import TooltipButton from "../../../../Driver/OrderTable/components/TooltipButton";
import orderCellStyles from "../../../../../styles/Driver/components/OrderTable/components/orderCellStyles";
import { getCurrentUser } from "../../../../../helpers/session";

const DateTimeCell = (order) => {
  return (
    <TableCell>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
        spacing={1}
      >
        <Grid item>
          <Paper
            elevation={1}
            style={{
              padding: 5,
            }}
          >
            <Grid container justify="center">
              <Typography variant="body1" style={{ fontWeight: 600 }}>
                Pickup:&nbsp;
              </Typography>
              <Typography
                variant="body1"
                style={{ textAlign: "center" }}
              >{` ${order.pickupInfo.date} @ ${order.pickupInfo.time}`}</Typography>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper
            elevation={1}
            style={{
              padding: 5,
            }}
          >
            <Grid container justify="center">
              <Typography variant="body1" style={{ fontWeight: 600 }}>
                Dropoff:&nbsp;
              </Typography>
              <Typography variant="body1" style={{ textAlign: "center" }}>
                {` ${order.dropoffInfo.date} @ ${order.dropoffInfo.time}`}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </TableCell>
  );
};

const AddressCell = (order) => {
  return (
    <TableCell>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
        spacing={1}
      >
        <Grid item>
          <Paper
            elevation={1}
            style={{
              padding: 5,
            }}
          >
            <Grid container justify="center">
              <Typography variant="body1" style={{ fontWeight: 600 }}>
                User:&nbsp;
              </Typography>
              <Typography variant="body1" style={{ textAlign: "center" }}>
                {order.orderInfo.address}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper
            elevation={1}
            style={{
              padding: 5,
            }}
          >
            <Grid container justify="center">
              <Typography variant="body1" style={{ fontWeight: 600 }}>
                Washer:&nbsp;
              </Typography>
              <Typography variant="body1" style={{ textAlign: "center" }}>
                {order.washerInfo.address}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </TableCell>
  );
};

const NameCell = (order) => {
  return (
    <TableCell>
      <Typography variant="body1">
        {`${order.userInfo.fname} ${order.userInfo.lname}`}
      </Typography>
    </TableCell>
  );
};

const TooltipCell = (text, classes) => {
  return (
    <TableCell>
      <TooltipButton
        text={text}
        className={classes.secondaryButton}
        buttonText={"View"}
      />
    </TableCell>
  );
};

const LoadCell = (order) => {
  return <TableCell>{order.orderInfo.loads}</TableCell>;
};

const PriceCell = (order) => {
  return (
    <TableCell>
      <Typography variant="body1">${order.orderInfo.cost}</Typography>
    </TableCell>
  );
};

const StatusCell = (order) => {
  return (
    <TableCell>
      <Typography variant="body1">
        {getStatus(order.orderInfo.status)}
      </Typography>
    </TableCell>
  );
};

const getStatus = (status) => {
  switch (status) {
    case 6:
      return "Delivered";
    case 7:
      return "Cancelled";
    case 8:
      return "Completed";
  }
};

const getDriverStages = (order) => {
  const currentUser = getCurrentUser();
  const pickupEmail = order.pickupInfo.driverEmail;
  const dropoffEmail = order.dropoffInfo.driverEmail;

  let stages = "";

  if (pickupEmail === currentUser.email) {
    stages += "Pickup, ";
  }

  if (dropoffEmail === currentUser.email) {
    stages += "Dropoff, ";
  }

  stages = stages.slice(0, stages.length - 2);
  return stages;
};

const OrderCell = (props) => {
  const { classes, order, config } = props;

  const renderCellConfig = (config) => {
    switch (config) {
      case "none":
        return null;

      case "orderHistoryDriver":
        return (
          <React.Fragment>
            <TableCell>
              <Typography variant="body1">{order.orderInfo.orderID}</Typography>
            </TableCell>
            {NameCell(order)}
            {DateTimeCell(order)}
            {AddressCell(order)}
            {TooltipCell(order.pickupInfo.prefs, classes)}
            {LoadCell(order)}
            {PriceCell(order)}
            <TableCell>
              <Typography variant="body1">{getDriverStages(order)}</Typography>
            </TableCell>
            {StatusCell(order)}
          </React.Fragment>
        );
    }
  };

  return <TableRow>{renderCellConfig(config)}</TableRow>;
};

export default withStyles(orderCellStyles)(OrderCell);
