import React, { Component } from "react";
import {
  Typography,
  withStyles,
  Paper,
  Grid,
  TableCell,
  TableRow,
  CardContent,
  List,
  ListItemText,
  ListItem,
  Divider,
  Card,
} from "@material-ui/core";
import PropTypes from "prop-types";
import PricingPopoverButton from "../../../../other/PricingPopoverButton";
import TooltipButton from "../../../../other/TooltipButton";
import PopoverButton from "../../../../other/PopoverButton";
import orderCellStyles from "../../../../../styles/Driver/components/OrderTable/components/orderCellStyles";

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

const IDCell = (order) => {
  return (
    <TableCell>
      <Typography variant="body1">{order.orderInfo.orderID}</Typography>
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

const WeightCell = (order) => {
  return (
    <TableCell>
      {order.orderInfo.weight === "N/A"
        ? "N/A"
        : `${order.orderInfo.weight} lbs`}
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
  const lowTemp = order.washerInfo.lowTemp;
  const separate = order.washerInfo.separate;
  const comforter = order.washerInfo.comforter;

  let prefs = "";

  if (scented) {
    prefs += "Scented, ";
  }

  if (lowTemp) {
    prefs += "Low Temperature, ";
  }

  if (separate) {
    prefs += "Separate, ";
  }

  if (comforter) {
    prefs += "Comforter,";
  }

  if (comforter) {
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

const getDriverStages = (order, currentUser) => {
  const pickupUserID = order.pickupInfo.userID;
  const dropoffUserID = order.dropoffInfo.userID;

  let stages = "";

  if (pickupUserID === currentUser.userID) {
    stages += "Pickup, ";
  }

  if (dropoffUserID === currentUser.userID) {
    stages += "Dropoff, ";
  }

  stages = stages.slice(0, stages.length - 2);
  return stages;
};

const OrderCell = (props) => {
  const { classes, order, config, currentUser } = props;

  const renderCellConfig = (config) => {
    switch (config) {
      case "none":
        return null;

      case "orderHistoryDriver":
        return (
          <React.Fragment>
            {IDCell(order)}
            {NameCell(order)}
            {DateTimeCell(order)}
            {AddressCell(order)}
            {TooltipCell(order.pickupInfo.prefs, classes)}
            {WeightCell(order)}
            <TableCell>
              <Typography variant="body1">
                {getDriverStages(order, currentUser)}
              </Typography>
            </TableCell>
            {StatusCellDriver(order)}
          </React.Fragment>
        );

      case "orderHistoryWasher":
        return (
          <React.Fragment>
            {IDCell(order)}
            {DateTimeCell(order)}
            {PreferencesCell(order)}
            {TooltipCell(order.washerInfo.prefs, classes)}
            {WeightCell(order)}
            {StatusCellWasher(order)}
          </React.Fragment>
        );

      case "orderHistoryUser":
        return (
          <React.Fragment>
            {IDCell(order)}
            {DateTimeCell(order)}
            <TableCell>
              <Typography variant="body1">{order.orderInfo.address}</Typography>
            </TableCell>
            <TableCell>
              <TooltipButton
                text={order.pickupInfo.prefs}
                className={classes.secondaryButton}
                buttonText={"Driver"}
              />
              {"               "}
              <TooltipButton
                text={order.washerInfo.prefs}
                className={classes.secondaryButton}
                buttonText={"Washer"}
              />
            </TableCell>
            {WeightCell(order)}
            <TableCell>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <PricingPopoverButton
                    showPriceLabel={false}
                    order={order}
                    currentUser={currentUser}
                  />
                </Grid>
              </Grid>
            </TableCell>
            {StatusCellDriver(order)}
          </React.Fragment>
        );
    }
  };

  return <TableRow>{renderCellConfig(config)}</TableRow>;
};

export default withStyles(orderCellStyles)(OrderCell);
