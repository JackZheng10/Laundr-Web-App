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
} from "@material-ui/core";
import PropTypes from "prop-types";
import TooltipButton from "./TooltipButton";
import orderCardStyles from "../../../../styles/Driver/components/OrderTable/components/orderCardStyles";

const OrderCard = (props) => {
  const { classes, order, actionText, action, stage, showNotification, handleOnTheWayClick } = props;

  return (
    <div className={classes.layout}>
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
                  {stage}
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
                  <Typography
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      navigator.clipboard.writeText(order.orderInfo.address);
                      showNotification(
                        "Successfully copied to clipboard.",
                        true
                      );
                    }}
                  >
                    {order.orderInfo.address}
                  </Typography>
                </Grid>
                <Grid container justify="center">
                  <Typography variant="body1" style={{ fontWeight: 600 }}>
                    Washer:&nbsp;
                  </Typography>
                  <Typography
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      navigator.clipboard.writeText(order.washerInfo.address);
                      showNotification(
                        "Successfully copied to clipboard.",
                        true
                      );
                    }}
                  >
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
                  <Typography
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      navigator.clipboard.writeText(order.userInfo.phone);
                      showNotification(
                        "Successfully copied to clipboard.",
                        true
                      );
                    }}
                  >
                    {order.userInfo.phone}
                  </Typography>
                </Grid>
                <Grid container justify="center">
                  <Typography variant="body1" style={{ fontWeight: 600 }}>
                    Washer:&nbsp;
                  </Typography>
                  <Typography
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      navigator.clipboard.writeText(order.washerInfo.phone);
                      showNotification(
                        "Successfully copied to clipboard.",
                        true
                      );
                    }}
                  >
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
        <CardActions className={classes.cardActions}>
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                className={classes.mainButton}
                onClick={action}
              >
                {actionText}
              </Button>
            </Grid>
            { stage === "Weighing" &&
              <Grid item>
              <Button
                variant="contained"
                size="large"
                className={classes.mainButton}
                onClick={()=> handleOnTheWayClick(order, "pickup")}
              >
                On the way!
              </Button>
            </Grid>
            }
            { stage === "Dropoff" &&
              <Grid item>
              <Button
                variant="contained"
                size="large"
                className={classes.mainButton}
                onClick={()=> handleOnTheWayClick(order, "dropoff")}
              >
                On the way!
              </Button>
            </Grid>
            }
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
};

OrderCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(orderCardStyles)(OrderCard);
