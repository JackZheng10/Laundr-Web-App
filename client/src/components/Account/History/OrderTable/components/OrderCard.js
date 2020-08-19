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
} from "@material-ui/core";
import PropTypes from "prop-types";
import TooltipButton from "../../../../Driver/OrderTable/components/TooltipButton";
import orderCardStyles from "../../../../../styles/Driver/components/OrderTable/components/orderCardStyles";
import { getCurrentUser } from "../../../../../helpers/session";

//id

//name

//date time

//address

//tooltip

//weight

//price

//status driver

//status washer

//preferences

const OrderCard = (props) => {
  const { classes, order, config } = props;

  const renderCardConfig = (config, classes) => {
    switch (config) {
      case "none":
        return null;

      case "orderHistoryDriver":
        return <Card className={classes.root} elevation={10}></Card>;

      case "orderHistoryWasher":
        return <Card className={classes.root} elevation={10}></Card>;

      case "orderHistoryUser":
        return <Card className={classes.root} elevation={10}></Card>;
    }
  };

  return (
    <div className={classes.layout}>{renderCardConfig(config, classes)}</div>
  );
};

OrderCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(orderCardStyles)(OrderCard);

/*
<Card className={classes.root} elevation={10}>
        <CardHeader
          title={`${order.userInfo.fname} ${order.userInfo.lname}`}
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
              <div className={classes.inlineText}>
                <Typography
                  variant="body1"
                  style={{ fontWeight: 600, color: "#01C9E1" }}
                  gutterBottom
                >
                  Stage:&nbsp;
                </Typography>
                <Typography variant="body1" gutterBottom>
                  stage
                </Typography>
              </div>
            </Grid>
            <Grid item>
              <div className={classes.inlineText}>
                <Typography
                  variant="body1"
                  style={{ fontWeight: 600, color: "#01C9E1" }}
                  gutterBottom
                >
                  Load Size:&nbsp;
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {order.orderInfo.loads}
                </Typography>
              </div>
            </Grid>
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
                  Phone
                </Typography>
                <Grid container justify="center">
                  <Typography variant="body1" style={{ fontWeight: 600 }}>
                    User:&nbsp;
                  </Typography>
                  <Typography style={{ textAlign: "center" }}>
                    {order.userInfo.phone}
                  </Typography>
                </Grid>
                <Grid container justify="center">
                  <Typography variant="body1" style={{ fontWeight: 600 }}>
                    Washer:&nbsp;
                  </Typography>
                  <Typography style={{ textAlign: "center" }}>
                    {order.washerInfo.phone}
                  </Typography>
                </Grid>
              </Paper>
            </Grid>
            <Grid item>
              <TooltipButton
                text={order.pickupInfo.prefs}
                className={classes.secondaryButton}
                buttonText={"View Instructions"}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
*/
