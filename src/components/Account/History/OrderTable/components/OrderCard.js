import React, { Component } from "react";
import {
  Typography,
  withStyles,
  Paper,
  Grid,
  TableCell,
  TableRow,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  List,
  ListItemText,
  ListItem,
  Divider,
} from "@material-ui/core";
import PropTypes from "prop-types";
import PricingPopoverButton from "../../../../other/PricingPopoverButton";
import TooltipButton from "../../../../other/TooltipButton";
import PopoverButton from "../../../../other/PopoverButton";
import orderCardStyles from "../../../../../styles/Driver/components/OrderTable/components/orderCardStyles";

const NameCard = (order) => {
  return (
    <Grid item>
      <Grid container justify="center">
        <Typography
          variant="body1"
          style={{ fontWeight: 600, color: "#01C9E1" }}
          gutterBottom
        >
          Name:&nbsp;
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`${order.userInfo.fname} ${order.userInfo.lname}`}
        </Typography>
      </Grid>
    </Grid>
  );
};

//date time
const DateTimeCard = (order) => {
  return (
    <Grid item>
      <Paper
        elevation={1}
        style={{
          padding: 5,
          marginBottom: 10,
        }}
      >
        <Typography
          style={{
            fontWeight: 600,
            color: "#01C9E1",
            textAlign: "center",
          }}
        >
          Date/Time
        </Typography>
        <Grid container justify="center">
          <Typography variant="body1" style={{ fontWeight: 600 }}>
            Pickup:&nbsp;
          </Typography>
          <Typography style={{ textAlign: "center" }}>
            {` ${order.pickupInfo.date} @ ${order.pickupInfo.time}`}
          </Typography>
        </Grid>
        <Grid container justify="center">
          <Typography variant="body1" style={{ fontWeight: 600 }}>
            Dropoff:&nbsp;
          </Typography>
          <Typography style={{ textAlign: "center" }}>
            {` ${order.dropoffInfo.date} @ ${order.dropoffInfo.time}`}
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  );
};

//address
const AddressCard = (order) => {
  return (
    <Grid item>
      <Paper
        elevation={1}
        style={{
          padding: 5,
          marginBottom: 10,
        }}
      >
        <Typography
          style={{
            fontWeight: 600,
            color: "#01C9E1",
            textAlign: "center",
          }}
        >
          Address
        </Typography>
        <Grid container justify="center">
          <Typography variant="body1" style={{ fontWeight: 600 }}>
            User:&nbsp;
          </Typography>
          <Typography style={{ textAlign: "center" }}>
            {order.orderInfo.address}
          </Typography>
        </Grid>
        <Grid container justify="center">
          <Typography variant="body1" style={{ fontWeight: 600 }}>
            Washer:&nbsp;
          </Typography>
          <Typography style={{ textAlign: "center" }}>
            {order.washerInfo.address}
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  );
};

//tooltip
const TooltipCard = (text, classes) => {
  return (
    <Grid item>
      <TooltipButton
        text={text}
        className={classes.secondaryButton}
        buttonText={"View Instructions"}
      />
    </Grid>
  );
};

//weight
const WeightCard = (order) => {
  return (
    <Grid item>
      <Grid container justify="center">
        <Typography
          variant="body1"
          style={{ fontWeight: 600, color: "#01C9E1" }}
          gutterBottom
        >
          Weight:&nbsp;
        </Typography>
        <Typography variant="body1" gutterBottom>
          {order.orderInfo.weight === "N/A"
            ? "N/A"
            : `${order.orderInfo.weight} lbs`}
        </Typography>
      </Grid>
    </Grid>
  );
};

//status driver
const StatusCardDriver = (order) => {
  return (
    <Grid item>
      <Grid container justify="center">
        <Typography
          variant="body1"
          style={{ fontWeight: 600, color: "#01C9E1" }}
          gutterBottom
        >
          Status:&nbsp;
        </Typography>
        <Typography variant="body1" gutterBottom>
          {renderStatusDriver(order.orderInfo.status)}
        </Typography>
      </Grid>
    </Grid>
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

//status washer
const StatusCardWasher = (order) => {
  return (
    <Grid item>
      <Grid container justify="center">
        <Typography
          variant="body1"
          style={{ fontWeight: 600, color: "#01C9E1" }}
          gutterBottom
        >
          Status:&nbsp;
        </Typography>
        <Typography variant="body1" gutterBottom>
          {order.orderInfo.status === 7 ? "Cancelled" : "Washed"}
        </Typography>
      </Grid>
    </Grid>
  );
};

//preferences
const PreferencesCard = (order) => {
  return (
    <Grid item>
      <Grid container justify="center">
        <Typography
          variant="body1"
          style={{ fontWeight: 600, color: "#01C9E1" }}
          gutterBottom
        >
          Preferences:&nbsp;
        </Typography>
        <Typography variant="body1" gutterBottom>
          {renderWasherPrefs(order)}
        </Typography>
      </Grid>
    </Grid>
  );
};

//driver stages
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

  //todo: test this, forget what it does lol
  if (comforter) {
    prefs = prefs.slice(0, prefs.length - 1);
  } else {
    prefs = prefs.slice(0, prefs.length - 2);
  }

  return prefs;
};

const OrderCard = (props) => {
  const { classes, order, config, currentUser } = props;

  const renderCardConfig = (config, classes, currentUser) => {
    switch (config) {
      case "none":
        return null;

      case "orderHistoryDriver":
        return (
          <Card className={classes.root} elevation={10}>
            <CardHeader
              title={order.orderInfo.orderID}
              titleTypographyProps={{
                variant: "h3",
                className: classes.title,
              }}
              className={classes.cardHeader}
            />
            <CardContent>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                {NameCard(order)}
                {WeightCard(order)}
                <Grid item>
                  <Grid container justify="center">
                    <Typography
                      variant="body1"
                      style={{ fontWeight: 600, color: "#01C9E1" }}
                      gutterBottom
                    >
                      Stage:&nbsp;
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {getDriverStages(order, currentUser)}
                    </Typography>
                  </Grid>
                </Grid>
                {StatusCardDriver(order)}
                {DateTimeCard(order)}
                {AddressCard(order)}
                {TooltipCard(order.pickupInfo.prefs, classes)}
              </Grid>
            </CardContent>
          </Card>
        );

      case "orderHistoryWasher":
        return (
          <Card className={classes.root} elevation={10}>
            <CardHeader
              title={`Order ID: ${order.orderInfo.orderID}`}
              titleTypographyProps={{
                variant: "h3",
                className: classes.title,
              }}
              className={classes.cardHeader}
            />
            <CardContent>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                {WeightCard(order)}
                {StatusCardWasher(order)}
                {PreferencesCard(order)}
                {DateTimeCard(order)}
                {TooltipCard(order.washerInfo.prefs, classes)}
              </Grid>
            </CardContent>
          </Card>
        );

      case "orderHistoryUser":
        return (
          <Card className={classes.root} elevation={10}>
            <CardHeader
              title={`Order ID: ${order.orderInfo.orderID}`}
              titleTypographyProps={{
                variant: "h3",
                className: classes.title,
              }}
              className={classes.cardHeader}
            />
            <CardContent>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <PricingPopoverButton
                    showPriceLabel={true}
                    order={order}
                    currentUser={currentUser}
                    labelStyles={{ fontWeight: 600, color: "#01C9E1" }}
                  />
                </Grid>
                {WeightCard(order)}
                {StatusCardDriver(order)}
                {DateTimeCard(order)}
                <Grid item style={{ marginBottom: 10 }}>
                  <TooltipButton
                    text={order.pickupInfo.prefs}
                    className={classes.secondaryButton}
                    buttonText={"Driver Instructions"}
                  />
                </Grid>
                <Grid item>
                  <TooltipButton
                    text={order.washerInfo.prefs}
                    className={classes.secondaryButton}
                    buttonText={"Washer Instructions"}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className={classes.layout}>
      {renderCardConfig(config, classes, currentUser)}
    </div>
  );
};

OrderCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(orderCardStyles)(OrderCard);
