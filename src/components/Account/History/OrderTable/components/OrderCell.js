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
import TooltipButton from "../../../../Driver/OrderTable/components/TooltipButton";
import PopoverButton from "./PopoverButton";
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

const PriceCell = (order, classes, currentUser) => {
  const subtotal = order.pricingInfo.subtotal;
  const subLbsDiscount = order.pricingInfo.subLbsDiscount;
  const balanceDiscount = order.pricingInfo.balanceDiscount;
  const priceMultiplier =
    currentUser.subscription.status === "active" ? 1.2 : 1.5;

  return (
    <TableCell>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Typography variant="body1">
            {order.orderInfo.cost === "-1" ? "N/A" : order.orderInfo.cost}
          </Typography>
        </Grid>
        {order.orderInfo.cost != "-1" && (
          <Grid item>
            <PopoverButton
              className={classes.secondaryButton}
              icon={true}
              content={
                <Card className={classes.root} elevation={5}>
                  <CardContent
                    className={classes.removePadding}
                    style={{ marginTop: -15, marginBottom: -15 }}
                  >
                    <List disablePadding>
                      <ListItem>
                        <ListItemText
                          primary={"Subtotal"}
                          secondary={`${order.orderInfo.weight} lbs`}
                          primaryTypographyProps={{ variant: "h6" }}
                        />
                        <Typography variant="body1">{subtotal}</Typography>
                      </ListItem>
                      {parseFloat(subLbsDiscount.slice(1)) > 0 && (
                        <ListItem>
                          <ListItemText
                            primary={"Subscription Lbs"}
                            secondary={`${
                              subLbsDiscount.slice(1) / priceMultiplier
                            } lbs`}
                            primaryTypographyProps={{ variant: "h6" }}
                          />
                          <Typography variant="body1">
                            -{subLbsDiscount}
                          </Typography>
                        </ListItem>
                      )}
                      {parseFloat(balanceDiscount.slice(1)) > 0 && (
                        <ListItem>
                          <ListItemText
                            primary={"Credit"}
                            primaryTypographyProps={{ variant: "h6" }}
                          />
                          <Typography variant="body1">
                            -{balanceDiscount}
                          </Typography>
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                  <Divider />
                  {/* <CardContent
              className={classes.removePadding}
              style={{ marginTop: -15, marginBottom: -15 }}
            >
              <ListItem>
                <ListItemText
                  primary={"Total"}
                  primaryTypographyProps={{ variant: "h6", fontWeight: 700 }}
                />
                <Typography variant="body1">
                  {order.pricingInfo.total}
                </Typography>
              </ListItem>
            </CardContent> */}
                  <CardContent
                    className={classes.removePadding}
                    style={{ marginTop: -5, marginBottom: -5 }}
                  >
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item>
                        <Grid container justify="center">
                          <Typography variant="h4" style={{ fontWeight: 600 }}>
                            Total:&nbsp;
                          </Typography>
                          <Typography
                            variant="h4"
                            style={{ textAlign: "center" }}
                          >
                            {order.pricingInfo.total}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              }
            />
          </Grid>
        )}
      </Grid>
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
  const comforter = order.washerInfo.comforter;

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

  if (comforter) {
    prefs += "Towels and Sheets,";
  }

  //todo: test this, forget what it does lol
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
            {PriceCell(order, classes, currentUser)}
            {StatusCellDriver(order)}
          </React.Fragment>
        );
    }
  };

  return <TableRow>{renderCellConfig(config)}</TableRow>;
};

export default withStyles(orderCellStyles)(OrderCell);
