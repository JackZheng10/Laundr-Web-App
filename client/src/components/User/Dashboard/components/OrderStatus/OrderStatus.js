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
import { getCurrentUser } from "../../../../../helpers/session";
import { caughtError, showConsoleError } from "../../../../../helpers/errors";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import MainAppContext from "../../../../../contexts/MainAppContext";
import baseURL from "../../../../../baseURL";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ProgressBar from "./components/ProgressBar";
import orderStatusStyles from "../../../../../styles/User/Dashboard/components/OrderStatus/orderStatusStyles";

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled
//8: fulfilled (user confirmed theyve seen the status on it)

//todo: fix time picker dialog positioning for this and scheduling

const moment = require("moment");

const timeTheme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(0, 153, 255)",
    },
  },
});

class OrderStatus extends Component {
  static contextType = MainAppContext;

  constructor() {
    super();

    this.now = moment();
    this.today = this.now.format("MM/DD/YYYY");
    this.tomorrow = this.now.add(1, "days").format("MM/DD/YYYY");
    this.nowFormattedTime = moment(this.now, "HH:mm:ss").format("LT");

    this.state = {
      showCancelDialog: false,
      showDropoffDialog: false,
      rawTime: new Date(),
      formattedTime: this.nowFormattedTime,
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
      const response = await axios.delete(`${baseURL}/order/cancelOrder`, {
        params: {
          orderID: order.orderInfo.orderID,
        },
      });

      this.setState({ showCancelDialog: false }, () => {
        this.context.showAlert(
          response.data.message,
          this.props.fetchOrderInfo
        );
      });
    } catch (error) {
      showConsoleError("cancelling order", error);
      this.context.showAlert(caughtError("cancelling order", error, 99));
    }
  };

  handleSetDropoffTime = async (order) => {
    if (!this.state.todaySelected && !this.state.tomorrowSelected) {
      //if no date selected
      return this.context.showAlert("Please select a dropoff date.");
    }

    if (this.handleTimeCheck(order.orderInfo.weight, order.pickupInfo)) {
    }

    // try {
    //   const response = await axios.put(`${baseURL}/order/setDropoff`, {
    //     orderID: order.orderInfo.orderID,
    //     date: this.state.date,
    //     time: this.state.formattedTime,
    //   });

    //   this.setState({ showDropoffDialog: false }, () => {
    //     this.context.showAlert(
    //       response.data.message,
    //       this.props.fetchOrderInfo
    //     );
    //   });
    // } catch (error) {
    //   showConsoleError("setting dropoff", error);
    //   this.context.showAlert(caughtError("setting dropoff", error, 99));
    // }
  };

  handleTimeCheck = (weight, pickupInfo) => {
    let canNext = true;

    const currentUser = getCurrentUser();
    console.log("pickup: " + `${pickupInfo.date} ${pickupInfo.time}`);
    console.log("dropoff: " + `${this.state.date} ${this.state.formattedTime}`);
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
      if (dropoff.isBefore(pickup.add(1, "days"))) {
        canNext = false;
        this.context.showAlert(
          "Dropoff must be at least the day after pickup."
        );
      }
    }

    if (dropoff.isBefore(pickup.add(5, "hours"))) {
      console.log("dropoff must be at least x hours after pickup");
    }
    // console.log(pickupDate + " " + pickupTime);
    // console.log("date: ");
    // console.log(moment(pickupDate, "MM/DD/YYYY"));
    // console.log("time: ");
    // console.log(moment(pickupTime, "LT"));
    // console.log("combined: ");
    // console.log(moment(`${pickupDate} ${pickupTime}`, "MM/DD/YYYY LT"));

    // if (weight > 29) {
    //   console.log(1);
    // } else if (weight <= 29) {
    //   console.log(2);
    // } else {
    //   canNext = false;
    //   this.context.showAlert(
    //     "An invalid weight was entered for your order. Please contact us."
    //   );
    // }

    return canNext;
  };

  toggleDropoffDialog = () => {
    this.setState({ showDropoffDialog: !this.state.showDropoffDialog });
  };

  toggleCancelDialog = () => {
    this.setState({ showCancelDialog: !this.state.showCancelDialog });
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
          className={classes.gradient}
          onClick={this.toggleDropoffDialog}
          style={{ marginBottom: 5 }}
        >
          Set Dropoff
        </Button>
      );
    }
  };

  render() {
    const { classes, order } = this.props;

    return (
      <React.Fragment>
        <div className={classes.layout}>
          <div className={classes.root}>
            <Dialog
              open={this.state.showCancelDialog}
              onClose={this.toggleCancelDialog}
              container={() => document.getElementById("orderStatusContainer")}
              style={{ position: "absolute", zIndex: 1 }}
              BackdropProps={{
                style: {
                  position: "absolute",
                  backgroundColor: "transparent",
                },
              }}
            >
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Are you sure you want to cancel your order?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.toggleCancelDialog} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    this.handleOrderCancel(order);
                  }}
                  color="primary"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
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
                      className={classes.gradient}
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
                      className={classes.gradient}
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
                <Button onClick={this.toggleDropoffDialog} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    this.handleSetDropoffTime(order);
                  }}
                  color="primary"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <CardContent>
              <ProgressBar status={order.orderInfo.status} />
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="center"
                id="orderStatusContainer"
                style={{ position: "relative" }}
              >
                <Grid item>
                  <Card className={classes.infoCard}>
                    <CardHeader
                      title={`Order ID: #${order.orderInfo.orderID}`}
                      titleTypographyProps={{ variant: "h4" }}
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        <HomeRoundedIcon
                          fontSize="small"
                          style={{ marginBottom: -4 }}
                        />{" "}
                        Address
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {order.orderInfo.address}
                      </Typography>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        <QueryBuilderIcon
                          fontSize="small"
                          style={{ marginBottom: -4 }}
                        />{" "}
                        Pickup
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {order.pickupInfo.date} @ {order.pickupInfo.time}
                      </Typography>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        <QueryBuilderIcon
                          fontSize="small"
                          style={{ marginBottom: -4 }}
                        />{" "}
                        Dropoff
                      </Typography>
                      {this.renderDropoffComponent(classes, order)}
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        <LocalMallIcon
                          fontSize="small"
                          style={{ marginBottom: -4 }}
                        />{" "}
                        Weight
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {order.orderInfo.weight === "N/A"
                          ? "TBD"
                          : `${order.orderInfo.weight} lbs`}
                      </Typography>
                      <Typography variant="h5" style={{ marginBottom: -10 }}>
                        {order.orderInfo.cost === -1
                          ? "Price: TBD"
                          : `Price: $${order.orderInfo.cost}`}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions style={{ justifyContent: "center" }}>
                      <Button
                        size="small"
                        variant="contained"
                        className={classes.gradient}
                        onClick={this.toggleCancelDialog}
                      >
                        Cancel
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
