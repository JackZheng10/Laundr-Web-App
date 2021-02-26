import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardActions,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Tooltip,
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

//todo: gold button focus for dropoff and cancel

const moment = require("moment-timezone");
moment.tz.setDefault("America/New_York");

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
      date: "N/A",
      todaySelected: false,
      tomorrowSelected: false,
      formattedTime: "N/A",
      selectValue: "",
      lowerBound: null,
      upperBound: null,
    };
  }

  getClosestTimes = (now, possibleTimes) => {
    let availableTimes = [];

    for (let x = 0; x < possibleTimes.length; x++) {
      //get the times starting at the first range where it's before or same as now
      if (now.isBefore(possibleTimes[x].lowerBound)) {
        //if its not at least 30 mins before
        if (now.diff(possibleTimes[x].lowerBound, "minutes") >= -29) {
          continue;
        } else {
          availableTimes = possibleTimes.slice(x);
          break;
        }
      }
    }

    return availableTimes;
  };

  getTimeAvailability = (order) => {
    const possibleTimes = [
      {
        lowerBound: moment("10:00 AM", "h:mm A"),
        upperBound: moment("10:30 AM", "h:mm A"),
        string: "10:00 AM - 10:30 AM",
      },
      {
        lowerBound: moment("10:30 AM", "h:mm A"),
        upperBound: moment("11:00 AM", "h:mm A"),
        string: "10:30 AM - 11:00 AM",
      },
      {
        lowerBound: moment("11:00 AM", "h:mm A"),
        upperBound: moment("11:30 AM", "h:mm A"),
        string: "11:00 AM - 11:30 AM",
      },
      {
        lowerBound: moment("11:30 AM", "h:mm A"),
        upperBound: moment("12:00 PM", "h:mm A"),
        string: "11:30 AM - 12:00 PM",
      },
      {
        lowerBound: moment("12:00 PM", "h:mm A"),
        upperBound: moment("12:30 PM", "h:mm A"),
        string: "12:00 PM - 12:30 PM",
      },
      {
        lowerBound: moment("12:30 PM", "h:mm A"),
        upperBound: moment("1:00 PM", "h:mm A"),
        string: "12:30 PM - 1:00 PM",
      },
      {
        lowerBound: moment("1:00 PM", "h:mm A"),
        upperBound: moment("1:30 AM", "h:mm A"),
        string: "1:00 PM - 1:30 PM",
      },
      {
        lowerBound: moment("1:30 PM", "h:mm A"),
        upperBound: moment("2:00 PM", "h:mm A"),
        string: "1:30 PM - 2:00 PM",
      },
      {
        lowerBound: moment("6:00 PM", "h:mm A"),
        upperBound: moment("6:30 PM", "h:mm A"),
        string: "6:00 PM - 6:30 PM",
      },
      {
        lowerBound: moment("6:30 PM", "h:mm A"),
        upperBound: moment("7:00 PM", "h:mm A"),
        string: "6:30 PM - 7:00 PM",
      },
      {
        lowerBound: moment("7:00 PM", "h:mm A"),
        upperBound: moment("7:30 PM", "h:mm A"),
        string: "7:00 PM - 7:30 PM",
      },
      {
        lowerBound: moment("7:30 PM", "h:mm A"),
        upperBound: moment("8:00 PM", "h:mm A"),
        string: "7:30 PM - 8:00 PM",
      },
    ];

    const weight = order.orderInfo.weight;
    const pickupTime = order.pickupInfo.time.split("-")[0];
    const formattedPickupTime = pickupTime.slice(0, pickupTime.length - 1);
    const pickupDate = order.pickupInfo.date;

    const pickupLowerBound = moment(
      `${pickupDate} ${formattedPickupTime}`,
      "MM/DD/YYYY h:mm A"
    );
    const tenAM = moment(`${pickupDate} 10:00:00`, "MM/DD/YYYY HH:mm:ss");
    const twoPM = moment(`${pickupDate} 14:00:00`, "MM/DD/YYYY HH:mm:ss");
    const sixPM = moment(`${pickupDate} 18:00:00`, "MM/DD/YYYY HH:mm:ss");
    const eightPM = moment(`${pickupDate} 20:00:00`, "MM/DD/YYYY HH:mm:ss");
    const now = moment();

    let todayNotAvailable = false;
    let availableTimes = [];
    let unavailableMessage = "";

    //check for any case of unavailable same-day
    if (now.isSameOrAfter(moment(`19:00:00`, "HH:mm:ss"))) {
      todayNotAvailable = true;
      availableTimes = possibleTimes;
      unavailableMessage =
        "Sorry! Our last delivery window today has passed. Please choose a time for tomorrow.";
    } else if (pickupLowerBound.isSame(now, "day")) {
      //today is the same day as pickup
      if (
        pickupLowerBound.isSameOrAfter(sixPM) &&
        pickupLowerBound.isSameOrBefore(eightPM)
      ) {
        //picked up in night window
        todayNotAvailable = true;
        availableTimes = possibleTimes;
        unavailableMessage =
          "Same-day delivery is not available for your order due to the pickup time.";
      } else if (weight > 29) {
        todayNotAvailable = true;
        availableTimes = possibleTimes;
        unavailableMessage =
          "Same-day delivery is not available for your order due to weight.";
      }
    }

    //if date chosen
    if (this.state.tomorrowSelected || this.state.todaySelected) {
      if (this.state.tomorrowSelected) {
        //if tomorrow is the day after pickup
        if (
          pickupLowerBound
            .clone()
            .add(1, "days")
            .isSame(now.clone().add(1, "days"), "day")
        ) {
          //if picked up within the 6-8 window
          if (
            pickupLowerBound.isSameOrAfter(sixPM) &&
            pickupLowerBound.isSameOrBefore(eightPM)
          ) {
            //only 6-8 window available
            availableTimes = this.getClosestTimes(now, possibleTimes.slice(8));
          } else {
            availableTimes = possibleTimes;
          }
        } else {
          //2 or more days after pickup
          availableTimes = possibleTimes;
        }
      } else {
        //if today is the day after pickup
        if (pickupLowerBound.clone().add(1, "days").isSame(now, "day")) {
          //if picked up within the 6-8 window
          if (
            pickupLowerBound.isSameOrAfter(sixPM) &&
            pickupLowerBound.isSameOrBefore(eightPM)
          ) {
            console.log("3");
            //only 6-8 window available
            availableTimes = this.getClosestTimes(now, possibleTimes.slice(8));
          } else {
            console.log("4");
            availableTimes = this.getClosestTimes(now, possibleTimes);
          }
        } else if (pickupLowerBound.isSame(now, "day")) {
          console.log("1");
          //if today is pickup, only 6-8 window available
          availableTimes = this.getClosestTimes(now, possibleTimes.slice(8));
        } else {
          console.log("2");
          console.log(pickupLowerBound.format("MM-DD-YYYY h:mm A"));
          console.log(now.format("MM-DD-YYYY h:mm A"));
          console.log(
            moment(
              `${pickupDate} ${formattedPickupTime}`,
              "MM/DD/YYYY h:mm A"
            ).format("MM-DD-YYYY h:mm A")
          );
          availableTimes = this.getClosestTimes(now, possibleTimes);
        }
      }
    }

    return {
      availableTimes,
      todayNotAvailable,
      unavailableMessage,
    };
  };

  handleInputChange = (property, value) => {
    switch (property) {
      case "time":
        this.setState({
          lowerBound: value.lowerBound,
          upperBound: value.upperBound,
          formattedTime: value.string,
          selectValue: value.selectValue,
        });
        break;

      case "today":
        this.setState({
          todaySelected: true,
          tomorrowSelected: false,
          date: this.today,
          selectValue: "",
        });
        break;

      case "tomorrow":
        this.setState({
          todaySelected: false,
          tomorrowSelected: true,
          date: this.tomorrow,
          selectValue: "",
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
    if (this.handleTimeCheck()) {
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

  handleTimeCheck = () => {
    let canNext = true;

    const scheduledLowerBound = this.state.lowerBound;
    const upperBound = moment("19:00:00", "HH:mm:ss");
    const now = moment();

    if (!this.state.todaySelected && !this.state.tomorrowSelected) {
      //if no date selected
      this.context.showAlert("Please select a pickup date.");
      canNext = false;
    } else if (!this.state.lowerBound || !this.state.upperBound) {
      //if no time selected
      this.context.showAlert("Please select a pickup time.");
      canNext = false;
    } else if (this.state.todaySelected && now.isSameOrAfter(upperBound)) {
      this.context.showAlert(
        "Sorry! Our last dropoff window today has passed. Please choose a time for tomorrow."
      );
      canNext = false;
    } else if (
      this.state.todaySelected &&
      now.diff(scheduledLowerBound, "minutes") >= -29
    ) {
      this.context.showAlert(
        "Sorry! Pickup time must be at least 30 minutes in advance."
      );
      canNext = false;
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
        showDropoffDialog: !this.state.showDropoffDialog,
        date: "N/A",
        todaySelected: false,
        tomorrowSelected: false,
        formattedTime: "N/A",
        selectValue: "",
        lowerBound: null,
        upperBound: null,
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

    const timeAvailability = this.getTimeAvailability(order);
    const todayNotAvailable = timeAvailability.todayNotAvailable;
    const availableTimes = timeAvailability.availableTimes;
    const unavailableMessage = timeAvailability.unavailableMessage;

    const handleTimeSelect = (event) => {
      const index = event.target.value;

      this.handleInputChange("time", {
        lowerBound: availableTimes[index].lowerBound,
        upperBound: availableTimes[index].upperBound,
        string: availableTimes[index].string,
        selectValue: index,
      });
    };

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
              <DialogTitle disableTypography>
                <Typography variant="h4" style={{ color: "#01c9e1" }}>
                  Set Dropoff
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Typography variant="h5" gutterBottom>
                  What day would you like your order to be dropped off?
                </Typography>
                <Grid container spacing={2} style={{ marginBottom: 5 }}>
                  <Grid item xs={12} sm={6}>
                    {todayNotAvailable && (
                      <Tooltip
                        title={
                          <Typography
                            variant="body1"
                            style={{ color: "white", textAlign: "center" }}
                          >
                            {unavailableMessage}
                          </Typography>
                        }
                        arrow
                        enterTouchDelay={100}
                        leaveTouchDelay={5000}
                      >
                        <div>
                          <Button
                            disabled
                            variant="contained"
                            style={{
                              backgroundColor: "#d5d5d5",
                              color: "white",
                            }}
                            fullWidth
                            size="large"
                            startIcon={<CalendarTodayIcon />}
                          >
                            {this.today}
                          </Button>
                        </div>
                      </Tooltip>
                    )}
                    {!todayNotAvailable && (
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
                    )}
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
                <Typography variant="h5" className={classes.title}>
                  What's your preferred dropoff time?
                </Typography>
                <ThemeProvider theme={timeTheme}>
                  <FormControl className={classes.formControl}>
                    <Select
                      disabled={
                        !this.state.todaySelected &&
                        !this.state.tomorrowSelected
                      }
                      labelId="times"
                      displayEmpty
                      variant="outlined"
                      value={this.state.selectValue}
                      onChange={handleTimeSelect}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        getContentAnchorEl: null,
                      }}
                    >
                      {availableTimes.map((time, index) => {
                        return (
                          <MenuItem value={index} key={index}>
                            {time.string}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {!this.state.todaySelected &&
                      !this.state.tomorrowSelected && (
                        <FormHelperText>
                          *Please select a date first.
                        </FormHelperText>
                      )}
                  </FormControl>
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
