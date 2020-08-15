import React, { Component } from "react";
import {
  Typography,
  withStyles,
  Paper,
  Grid,
  TableCell,
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

const WeightCell = (order) => {
  return <TableCell>{order.orderInfo.weight} lbs</TableCell>;
};

const PriceCell = (order) => {
  return (
    <TableCell>
      <Typography variant="body1">${order.orderInfo.cost}</Typography>
    </TableCell>
  );
};

const PreferencesCell = (order) => {
  return (
    <TableCell>
      <Typography variant="body1">{renderWasherPrefs(order)}</Typography>
    </TableCell>
  );
};

const renderWasherPrefs = (order) => {
  const scented = order.washerInfo.scented;
  const delicates = order.washerInfo.delicates;
  const separate = order.washerInfo.separate;
  const towelsSheets = order.washerInfo.towelsSheets;

  let prefs = "";

  if (scented) {
    prefs += "Scented, ";
  }

  if (delicates) {
    prefs += "Delicates, ";
  }

  if (separate) {
    prefs += "Separate, ";
  }

  if (towelsSheets) {
    prefs += "Towels and Sheets,";
  }

  //todo: test this, forget what it does lol
  if (towelsSheets) {
    prefs = prefs.slice(0, prefs.length - 1);
  } else {
    prefs = prefs.slice(0, prefs.length - 2);
  }

  return prefs;
};

const StatusCellDriver = (order) => {
  return (
    <TableCell>
      <Typography variant="body1">
        {renderStatusDriver(order.orderInfo.status)}
      </Typography>
    </TableCell>
  );
};

const renderStatusDriver = (status) => {
  switch (status) {
    case 6:
      return "Delivered";
    case 7:
      return "Cancelled";
    case 8:
      return "Completed";
  }
};

const StatusCellWasher = (order) => {
  return (
    <TableCell>
      <Typography variant="body1">
        {order.orderInfo.status === 7 ? "Cancelled" : "Washed"}
      </Typography>
    </TableCell>
  );
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
            {WeightCell(order)}
            {PriceCell(order)}
            <TableCell>
              <Typography variant="body1">{getDriverStages(order)}</Typography>
            </TableCell>
            {StatusCellDriver(order)}
          </React.Fragment>
        );

      case "orderHistoryWasher":
        return (
          <React.Fragment>
            <TableCell>
              <Typography variant="body1">{order.orderInfo.orderID}</Typography>
            </TableCell>
            {DateTimeCell(order)}
            {PreferencesCell(order)}
            {TooltipCell(order.washerInfo.prefs, classes)}
            {WeightCell(order)}
            {StatusCellWasher(order)}
          </React.Fragment>
        );
    }
  };

  return <TableRow>{renderCellConfig(config)}</TableRow>;
};

export default withStyles(orderCellStyles)(OrderCell);
