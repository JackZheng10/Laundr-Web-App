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
  Tooltip,
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { caughtError, showConsoleError } from "../../../../helpers/errors";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
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

  getTimeAvailability = (order) => {
    let times = [
      { time: moment("10:00 AM", "h:mm A"), string: "10:00 AM - 10:30 AM" },
      { time: moment("10:30 AM", "h:mm A"), string: "10:30 AM - 11:00 AM" },
      { time: moment("11:00 AM", "h:mm A"), string: "11:00 AM - 11:30 AM" },
      { time: moment("11:30 AM", "h:mm A"), string: "11:30 AM - 12:00 PM" },
      { time: moment("12:00 PM", "h:mm A"), string: "12:00 PM - 12:30 PM" },
      { time: moment("12:30 PM", "h:mm A"), string: "12:30 PM - 1:00 PM" },
      { time: moment("1:00 PM", "h:mm A"), string: "1:00 PM - 1:30 PM" },
      { time: moment("1:30 PM", "h:mm A"), string: "1:30 PM - 2:00 PM" },
      { time: moment("6:00 PM", "h:mm A"), string: "6:00 PM - 6:30 PM" },
      { time: moment("6:30 PM", "h:mm A"), string: "6:30 PM - 7:00 PM" },
      { time: moment("7:00 PM", "h:mm A"), string: "7:00 PM - 7:30 PM" },
      { time: moment("7:30 PM", "h:mm A"), string: "7:30 PM - 8:00 PM" },
    ];

    const weight = order.orderInfo.weight;
    const pickupInfo = order.pickupInfo;
    const pickupTime = moment(pickupInfo.rawTime, moment.ISO_8601);

    const twoPM = moment("14:00:00", "HH:mm:ss"); //2 PM
    const sixPM = moment("18:00:00", "HH:mm:ss"); //6 PM
    const eightPM = moment("20:00:00", "HH:mm:ss"); //8 PM
    const currentTime = moment(moment(), "HH:mm:ss");

    let startWindow = 0;
    let todayNotAvailable = false;

    if (
      pickupTime.isSameOrBefore(twoPM) &&
      currentTime.isSameOrAfter(eightPM) &&
      weight < 40
    ) {
      todayNotAvailable = true;
    } else if (pickupTime.isSameOrBefore(twoPM) && weight >= 40) {
      todayNotAvailable = true;
    } else if (pickupTime.isSameOrAfter(sixPM)) {
      todayNotAvailable = true;
    }

    if (this.state.todaySelected && !this.state.tomorrowSelected) {
      if (
        pickupTime.isSameOrBefore(twoPM) &&
        currentTime.isBefore(eightPM) &&
        weight < 40
      ) {
        startWindow = 8;
      }
    } else if (this.state.tomorrowSelected && !this.state.todaySelected) {
      if (pickupTime.isSameOrBefore(twoPM)) {
        startWindow = 0;
      } else if (pickupTime.isSameOrAfter(sixPM)) {
        startWindow = 8;
      }
    }

    let availableTimes = [];
    for (var j = startWindow; j < times.length; j++) {
      availableTimes.push(times[j]);
    }

    return {
      availableTimes,
      todayNotAvailable,
    };
  };

  handleInputChange = (property, value) => {
    switch (property) {
      case "time":
        const rawTime = value.time;
        const formattedTime = value.string;
        this.setState({ rawTime, formattedTime });
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
      });

      this.context.showAlert(response.data.message, this.props.fetchOrderInfo);
    } catch (error) {
      showConsoleError("cancelling order", error);
      this.context.showAlert(caughtError("cancelling order", error, 99));
    }
  };

  handleSetDropoffTime = async (order) => {
    if (this.handleTimeCheck()) {
      try {
        const response = await axios.put("/api/order/setDropoff", {
          orderID: order.orderInfo.orderID,
          date: this.state.date,
          time: this.state.formattedTime,
        });
        this.setState({ showDropoffDialog: false }, () => {
          this.context.showAlert(
            response.data.message,
            this.props.fetchOrderInfo
          );
        });
      } catch (error) {
        showConsoleError("setting dropoff", error);
        this.context.showAlert(caughtError("setting dropoff", error, 99));
      }
    }
  };

  //todo: test
  handleTimeCheck = () => {
    let canNext = true;

    const lowerBound = moment("10:00:00", "HH:mm:ss").add(1, "minutes"); //10 AM
    const upperBound = moment("20:00:00", "HH:mm:ss").add(1, "minutes"); //8 PM
    const hourFromNow = moment(moment(), "HH:mm:ss").add(1, "hours");
    const dropoffTime = moment(this.state.rawTime);

    if (!this.state.todaySelected && !this.state.tomorrowSelected) {
      //if no date selected
      this.context.showAlert("Please select a dropoff date.");
      canNext = false;
    } else if (this.state.todaySelected && hourFromNow.isAfter(upperBound)) {
      //if selected today and its after 8 PM
      this.context.showAlert(
        "Sorry! We are closed after 8 PM. Please select a different day."
      );
      canNext = false;
    } else if (!dropoffTime.isBetween(lowerBound, upperBound)) {
      //if dropoff time isnt between 10 am and 8 pm
      this.context.showAlert(
        "The dropoff time must be between 10 AM and 8 PM."
      );
      canNext = false;
    }

    return canNext;
  };

  handleConfirmReceived = async (order) => {
    try {
      const response = await axios.put("/api/order/confirmReceived", {
        orderID: order.orderInfo.orderID,
      });

      if (response.data.success) {
        await this.props.fetchOrderInfo();
      } else {
        this.context.showAlert(response.data.message);
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

  handleTimeSelect = (event, order) => {
    let index = event.target.value;
    let timeAvailability = this.getTimeAvailability(order);
    let availableTimes = timeAvailability.availableTimes;
    this.handleInputChange("time", {
      time: availableTimes[index].time,
      string: availableTimes[index].string,
    });
  };

  render() {
    const { classes, order } = this.props;

    let timeAvailability = this.getTimeAvailability(order);
    let todayNotAvailable = timeAvailability.todayNotAvailable;
    let availableTimes = timeAvailability.availableTimes;

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
                    {todayNotAvailable && (
                      <Tooltip
                        title={
                          <React.Fragment>
                            {
                              "Same-day dropoff is not available for this pickup time."
                            }
                          </React.Fragment>
                        }
                        arrow
                      >
                        <span>
                          <Button
                            disabled="true"
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
                        </span>
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
                <ThemeProvider theme={timeTheme}>
                  <FormControl className={classes.formControl}>
                    <Select
                      labelId="times"
                      displayEmpty
                      onChange={(e) => this.handleTimeSelect(e, order)}
                    >
                      {availableTimes.map((time, index) => {
                        return <MenuItem value={index}>{time.string}</MenuItem>;
                      })}
                    </Select>
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
                <Button
                  onClick={() => {
                    this.handleSetDropoffTime(order);
                  }}
                  variant="contained"
                  className={classes.mainButton}
                >
                  Confirm
                </Button>
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
                          order.orderInfo.status < 2 &&
                          order.dropoffInfo.time === "N/A"
                            ? classes.mainButton
                            : classes.secondaryButton
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

export default withStyles(orderStatusStyles)(OrderStatus);
