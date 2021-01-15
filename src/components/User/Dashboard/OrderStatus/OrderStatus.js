import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardActions,
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { getCurrentUser } from "../../../../helpers/session";
import { caughtError, showConsoleError } from "../../../../helpers/errors";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import { withRouter } from "next/router";
import compose from "recompose/compose";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import LoadingButton from "../../../other/LoadingButton";
import MainAppContext from "../../../../contexts/MainAppContext";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ProgressBar from "./components/ProgressBar";
import orderStatusStyles from "../../../../styles/User/Dashboard/components/OrderStatus/orderStatusStyles";

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled
//8: fulfilled (user confirmed theyve seen the status on it)

//todo: fix time picker dialog positioning for this and scheduling?
//todo: design like card for driver/washer or vice versa?
//todo: gold button focus for dropoff and cancel

const moment = require("moment");

const timeTheme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(1, 203, 225)",
    },
  },
});

class OrderStatus extends Component {
  static contextType = MainAppContext;

  constructor() {
    super();

    //moment(stuff) to construct objects used for comparison, before, etc.
    //.format called on moment obj for raw strings to display or pass in for parsing to construct moment obj

    this.today = moment().format("MM/DD/YYYY");
    this.tomorrow = moment().add(1, "days").format("MM/DD/YYYY");

    this.state = {
      showDropoffDialog: false,
      rawTime: new Date(),
      formattedTime: moment().format("LT"),
      date: "N/A",
      todaySelected: false,
      tomorrowSelected: false,
    };
  }

  handleInputChange = (property, value) => {
    switch (property) {
      case "time":
        const formattedTime = moment(value, "HH:mm:ss").format("LT");
        this.setState({ rawTime: value, formattedTime });
        break;

      case "today":
        this.setState({
          todaySelected: true,
          tomorrowSelected: false,
          date: this.today,
        });
        break;

      case "tomorrow":
        this.setState({
          todaySelected: false,
          tomorrowSelected: true,
          date: this.tomorrow,
        });
        break;
    }
  };

  handleOrderCancel = async (order) => {
    try {
      const response = await axios.delete("/api/order/cancelOrder", {
        params: {
          orderID: order.orderInfo.orderID,
        },
        withCredentials: true,
      });

      if (!response.data.success && response.data.redirect) {
        this.props.router.push(response.data.message);
      } else {
        this.context.showAlert(
          response.data.message,
          this.props.fetchOrderInfo
        );
      }
    } catch (error) {
      showConsoleError("cancelling order", error);
      this.context.showAlert(caughtError("cancelling order", error, 99));
    }
  };

  handleSetDropoffTime = async (order) => {
    if (await this.handleTimeCheck(order.orderInfo.weight, order.pickupInfo)) {
      try {
        const response = await axios.put(
          "/api/order/setDropoff",
          {
            orderID: order.orderInfo.orderID,
            date: this.state.date,
            time: this.state.formattedTime,
          },
          { withCredentials: true }
        );

        this.setState({ showDropoffDialog: false }, () => {
          if (!response.data.success && response.data.redirect) {
            this.props.router.push(response.data.message);
          } else {
            this.context.showAlert(
              response.data.message,
              this.props.fetchOrderInfo
            );
          }
        });
      } catch (error) {
        showConsoleError("setting dropoff", error);
        this.context.showAlert(caughtError("setting dropoff", error, 99));
      }
    }
  };

  //todo: test
  handleTimeCheck = async (weight, pickupInfo) => {
    let canNext = true;
    const response = await getCurrentUser();

    if (!response.data.success) {
      if (response.data.redirect) {
        return this.props.router.push(response.data.message);
      } else {
        return this.context.showAlert(response.data.message);
      }
    }

    const currentUser = response.data.message;

    const lowerBound = moment("10:00:00", "HH:mm:ss").add(1, "minutes"); //10 AM
    const upperBound = moment("19:00:00", "HH:mm:ss").add(1, "minutes"); //7 PM
    const hourFromNow = moment(moment(), "HH:mm:ss").add(1, "hours");

    const pickup = moment(
      `${pickupInfo.date} ${pickupInfo.time}`,
      "MM/DD/YYYY LT"
    );
    const dropoff = moment(
      `${this.state.date} ${this.state.formattedTime}`,
      "MM/DD/YYYY LT"
    );
    const pickupDate = moment(pickupInfo.date, "MM/DD/YYYY");
    const dropoffDate = moment(this.state.date, "MM/DD/YYYY");
    const dropoffTime = moment(this.state.formattedTime, "LT");

    if (!this.state.todaySelected && !this.state.tomorrowSelected) {
      //if no date selected
      this.context.showAlert("Please select a dropoff date.");
      canNext = false;
    } else if (this.state.todaySelected && hourFromNow.isAfter(upperBound)) {
      //if selected today and its after 7 PM
      this.context.showAlert(
        "Sorry! The dropoff time must be at least 1 hour from now and we are closed after 7 PM. Please select a different day."
      );
      canNext = false;
    } else if (!dropoffTime.isBetween(lowerBound, upperBound)) {
      //if dropoff time isnt between 10 am and 7 pm
      this.context.showAlert(
        "The dropoff time must be between 10 AM and 7 PM."
      );
      canNext = false;
    } else if (
      hourFromNow.isBetween(lowerBound, upperBound) &&
      dropoffTime.isBefore(hourFromNow) &&
      this.state.todaySelected
    ) {
      //if now is between 10 and 7 AND dropoff time is before that AND the date selected is today
      this.context.showAlert(
        "The dropoff time must be at least 1 hour hour from now."
      );
      canNext = false;
    } else {
      //passed general checks, move on to weight limitations
      //if currentuser is a sub, handle checks for weight and same day hours
      if (currentUser.subscription.status === "active") {
        if (weight > 29) {
          //if chosen dropoff time is before x hrs have passed from pickup
          if (dropoff.isBefore(pickup.add(20, "hours"))) {
            canNext = false;
            this.context.showAlert(
              "Due to your order's weight, the dropoff time must be at least 20 hours after pickup."
            );
          }
        } else if (weight <= 29) {
          if (weight >= 25 && weight <= 29) {
            if (dropoff.isBefore(pickup.add(7, "hours"))) {
              canNext = false;
              this.context.showAlert(
                "Due to your order's weight, the dropoff time must be at least 7 hours after pickup."
              );
            }
          } else if (weight >= 19 && weight <= 24) {
            if (dropoff.isBefore(pickup.add(6, "hours"))) {
              canNext = false;
              this.context.showAlert(
                "Due to your order's weight, the dropoff time must be at least 6 hours after pickup."
              );
            }
          } else if (weight >= 13 && weight <= 18) {
            if (dropoff.isBefore(pickup.add(5, "hours"))) {
              canNext = false;
              this.context.showAlert(
                "Due to your order's weight, the dropoff time must be at least 5 hours after pickup."
              );
            }
          } else if (weight >= 10 && weight <= 12) {
            if (dropoff.isBefore(pickup.add(4, "hours"))) {
              canNext = false;
              this.context.showAlert(
                "Due to your order's weight, the dropoff time must be at least 4 hours after pickup."
              );
            }
          }
        }
      } else {
        //otherwise, it should just be at least the next day after picku
        if (dropoffDate.isBefore(pickupDate.add(1, "days"))) {
          canNext = false;
          this.context.showAlert(
            "Dropoff must be at least the day after pickup. Same-day-delivery is only available for subscribers."
          );
        }
      }
    }

    return canNext;
  };

  handleConfirmReceived = async (order) => {
    try {
      const response = await axios.put(
        "/api/order/confirmReceived",
        {
          orderID: order.orderInfo.orderID,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        this.props.fetchOrderInfo();
      } else {
        if (response.data.redirect) {
          this.props.router.push(response.data.message);
        } else {
          this.context.showAlert(response.data.message);
        }
      }
    } catch (error) {
      showConsoleError("setting dropoff", error);
      this.context.showAlert(caughtError("setting dropoff", error, 99));
    }
  };

  toggleDropoffDialog = () => {
    if (this.state.showDropoffDialog) {
      this.setState({
        todaySelected: false,
        tomorrowSelected: false,
        rawTime: new Date(),
        formattedTime: moment(moment(), "HH:mm:ss").format("LT"),
        showDropoffDialog: !this.state.showDropoffDialog,
      });
    } else {
      this.setState({ showDropoffDialog: !this.state.showDropoffDialog });
    }
  };

  renderDropoffComponent = (classes, order) => {
    //if status is not at least 2 and no time is entered
    if (order.orderInfo.status < 2 && order.dropoffInfo.time === "N/A") {
      return (
        <Typography variant="body1" color="textSecondary">
          TBD
        </Typography>
      );
    } else if (order.dropoffInfo.time !== "N/A") {
      return (
        <Typography variant="body1" color="textSecondary">
          {order.dropoffInfo.date} @ {order.dropoffInfo.time}
        </Typography>
      );
    } else {
      return (
        <Button
          size="small"
          variant="contained"
          className={classes.mainButton}
          onClick={this.toggleDropoffDialog}
          style={{ marginBottom: 5 }}
        >
          Set Dropoff
        </Button>
      );
    }
  };

  renderCardContent = (order, classes) => {
    //if order is done, show it
    if (order.orderInfo.status === 6) {
      return (
        <Typography variant="body1" style={{ fontWeight: 500, fontSize: 20 }}>
          Your order was delivered!
        </Typography>
      );
    } else {
      return (
        <React.Fragment>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            <HomeRoundedIcon fontSize="small" style={{ marginBottom: -4 }} />{" "}
            Address
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {order.orderInfo.address}
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            <QueryBuilderIcon fontSize="small" style={{ marginBottom: -4 }} />{" "}
            Pickup
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {order.pickupInfo.date} @ {order.pickupInfo.time}
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            <QueryBuilderIcon fontSize="small" style={{ marginBottom: -4 }} />{" "}
            Dropoff
          </Typography>
          {this.renderDropoffComponent(classes, order)}
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            <LocalMallIcon fontSize="small" style={{ marginBottom: -4 }} />{" "}
            Weight
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {order.orderInfo.weight === "N/A"
              ? "TBD"
              : `${order.orderInfo.weight} lbs`}
          </Typography>
          <Typography variant="h5" style={{ marginBottom: -10 }}>
            {order.orderInfo.cost === "-1"
              ? "Price: TBD"
              : `Price: ${order.orderInfo.cost}`}
          </Typography>
        </React.Fragment>
      );
    }
  };

  render() {
    const { classes, order } = this.props;

    return (
      <React.Fragment>
        <div className={classes.layout}>
          <div className={classes.root}>
            {/*DROPOFF SCHEDULING*/}
            <Dialog
              open={this.state.showDropoffDialog}
              onClose={this.toggleDropoffDialog}
              container={() => document.getElementById("orderStatusContainer")}
              style={{ position: "absolute", zIndex: 1 }}
              BackdropProps={{
                style: {
                  position: "absolute",
                  backgroundColor: "transparent",
                },
              }}
              PaperProps={{
                style: {
                  width: "100%",
                },
              }}
            >
              <DialogTitle>Set Dropoff</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} style={{ marginBottom: 5 }}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      disabled={this.state.todaySelected}
                      onClick={() => {
                        this.handleInputChange("today");
                      }}
                      variant="contained"
                      style={
                        this.state.todaySelected
                          ? { backgroundColor: "#01c9e1", color: "white" }
                          : { backgroundColor: "white", color: "#01c9e1" }
                      }
                      fullWidth
                      size="large"
                      startIcon={<CalendarTodayIcon />}
                    >
                      {this.today}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      disabled={this.state.tomorrowSelected}
                      onClick={() => {
                        this.handleInputChange("tomorrow");
                      }}
                      variant="contained"
                      style={
                        this.state.tomorrowSelected
                          ? { backgroundColor: "#01c9e1", color: "white" }
                          : { backgroundColor: "white", color: "#01c9e1" }
                      }
                      fullWidth
                      size="large"
                      startIcon={<CalendarTodayIcon />}
                    >
                      {this.tomorrow}
                    </Button>
                  </Grid>
                </Grid>
                <ThemeProvider theme={timeTheme}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <TimePicker
                      margin="normal"
                      variant="inline"
                      label="Click to set a time"
                      multiline
                      onChange={(value) => {
                        this.handleInputChange("time", value);
                      }}
                      value={this.state.rawTime}
                      PopoverProps={{
                        anchorOrigin: {
                          vertical: "center",
                          horizontal: "center",
                        },
                        transformOrigin: {
                          vertical: "bottom",
                          horizontal: "center",
                        },
                      }}
                      style={{ width: 130, marginTop: 5 }}
                    />
                  </MuiPickersUtilsProvider>
                </ThemeProvider>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.toggleDropoffDialog}
                  variant="contained"
                  className={classes.secondaryButton}
                >
                  Cancel
                </Button>
                <LoadingButton
                  onClick={async () => await this.handleSetDropoffTime(order)}
                  variant="contained"
                  className={classes.mainButton}
                >
                  Confirm
                </LoadingButton>
              </DialogActions>
            </Dialog>
            <CardContent id="orderStatusContainer">
              <ProgressBar status={order.orderInfo.status} />
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="center"
                style={{ position: "relative" }}
              >
                <Grid item>
                  <Card className={classes.infoCard} elevation={10}>
                    <CardHeader
                      title={`Order ID: #${order.orderInfo.orderID}`}
                      titleTypographyProps={{
                        variant: "h4",
                        style: {
                          color: "white",
                        },
                      }}
                      className={classes.cardHeader}
                    />
                    {/* <Divider /> */}
                    <CardContent>
                      {this.renderCardContent(order, classes)}
                    </CardContent>
                    {/* <Divider /> */}
                    <CardActions className={classes.cardFooter}>
                      <Button
                        size="medium"
                        variant="contained"
                        className={
                          order.dropoffInfo.time === "N/A" &&
                          order.orderInfo.status > 2
                            ? classes.secondaryButton
                            : classes.mainButton
                        }
                        onClick={() => {
                          order.orderInfo.status === 6
                            ? this.handleConfirmReceived(order)
                            : this.context.showAlert_C(
                                "Are you sure you want to cancel your order?",
                                () => {
                                  this.handleOrderCancel(order);
                                }
                              );
                        }}
                      >
                        {order.orderInfo.status === 6 ? "New Order" : "Cancel"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

OrderStatus.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withRouter, withStyles(orderStatusStyles))(OrderStatus);
