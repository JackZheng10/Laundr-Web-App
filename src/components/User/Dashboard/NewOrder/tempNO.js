import React, { Component } from "react";
import {
  withStyles,
  Button,
  Typography,
  Fade,
  CardContent,
} from "@material-ui/core";
import { getCurrentUser } from "../../../../helpers/session";
import { caughtError, showConsoleError } from "../../../../helpers/errors";
import PropTypes from "prop-types";
import Geocode from "react-geocode";
import axios from "axios";
import MainAppContext from "../../../../contexts/MainAppContext";
import Scheduling from "./components/Scheduling";
import Preferences from "./components/Preferences/Preferences";
import Address from "./components/Address/Address";
import Pricing from "./components/Pricing";
import Review from "./components/Review";
import ProgressBar from "./components/ProgressBar";
import newOrderStyles from "../../../../styles/User/Dashboard/components/NewOrder/newOrderStyles";

const moment = require("moment-timezone");
const geolib = require("geolib");

const apiKEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
  require("../../../../config").google.mapsKEY;

//todo: maybe scroll to top at advancing? or make size of pages same
//todo: no new order when payment method not added yet
//todo: refactoring styling/layout like i would do now. same as others. center everything?

const steps = ["Scheduling", "Preferences", "Address", "Pricing", "Review"];

class NewOrder extends Component {
  static contextType = MainAppContext;

  constructor() {
    super();

    this.today = moment().format("MM/DD/YYYY");
    this.tomorrow = moment().add(1, "days").format("MM/DD/YYYY");

    this.state = {
      activeStep: 0,
      date: "N/A", //scheduling
      todaySelected: false,
      tomorrowSelected: false,
      formattedTime: moment().format("LT"),
      rawTime: new Date(),
      scented: false, //preferences
      delicates: false,
      separate: false,
      towelsSheets: false,
      washerPreferences: "",
      center: {
        //address
        lat: 29.6516, //default view is gainesville
        lng: -82.3248,
      },
      zoom: 12,
      address: "",
      renderMarker: false,
      addressPreferences: "",
      loads: 1, //pricing
      orderID: -1, //done screen
    };
  }

  handleNext = async () => {
    //also handle validation in here!
    let canNext = true;

    switch (this.state.activeStep) {
      case 0:
        canNext = this.handleTimeCheck();
        break;

      case 1:
        break;

      case 2:
        if (this.evaluateWhitespace(this.state.address) === "N/A") {
          this.context.showAlert("Please enter an address.");
          canNext = false;
          break;
        }

        let addressCords = { lat: -1, lng: -1 };

        //coordinates of entered address
        await Geocode.fromAddress(this.state.address).then(
          (response) => {
            const { lat, lng } = response.results[0].geometry.location;
            addressCords.lat = lat;
            addressCords.lng = lng;
          },
          (error) => {
            showConsoleError("getting address coordinates", error);
            this.context.showAlert(
              caughtError("getting address coordinates", error, 99)
            );
          }
        );

        //determine distance in m from center of range based on city, hardcode gnv for now
        const distance = geolib.getPreciseDistance(
          { latitude: addressCords.lat, longitude: addressCords.lng },
          { latitude: 29.6499, longitude: -82.3486 }
        );

        if (distance > 16094) {
          this.context.showAlert(
            "The address entered is not valid or is not within our service range. Make sure you've selected an address from the dropdown and try again."
          );

          // console.log("distance: " + distance);
          // console.log("====================================");
          canNext = false;
        }
        break;

      case 3:
        break;

      case 4:
        //check time again in case they waited and then came back to continue their order
        canNext = this.handleTimeCheck();

        let response;

        if (canNext) {
          response = await this.handlePlaceOrder();
        } else {
          return;
        }

        if (!response.success) {
          this.context.showAlert(response.message);
          canNext = false;
        } else {
          this.setState({ orderID: response.message });
        }
        break;

      default:
        break;
    }

    if (canNext) {
      window.scrollTo(0, 0);
      this.setState({ activeStep: this.state.activeStep + 1 });
    }
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 }, () => {
      window.scrollTo(0, 0);
    });
  };

  handlePlaceOrder = async () => {
    // axios.defaults.headers.common["token"] = token;

    try {
      const currentUser = getCurrentUser();

      const response = await axios.post("/api/order/placeOrder", {
        email: currentUser.email,
        fname: currentUser.fname,
        lname: currentUser.lname,
        phone: currentUser.phone,
        coupon: "placeholder",
        scented: this.state.scented,
        delicates: this.state.delicates,
        separate: this.state.separate,
        towelsSheets: this.state.towelsSheets,
        washerPrefs: this.evaluateWhitespace(this.state.washerPreferences),
        address: this.state.address,
        addressPrefs: this.evaluateWhitespace(this.state.addressPreferences),
        loads: this.state.loads,
        pickupDate: this.state.date,
        pickupTime: this.state.formattedTime,
        pickupRawTime: this.state.rawTime,
        created: new Date(),
      });

      if (response.data.success) {
        return { success: true, message: response.data.orderID };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      showConsoleError("placing order: ", error);
      return {
        success: false,
        message: caughtError("placing order", error, 99),
      };
    }
  };

  handleTimeCheck = () => {
    // console.log("scheduled time:" + this.state.formattedTime);
    // console.log("raw time:" + this.state.rawTime);

    let canNext = true;
    //time checks, military time format: check if logged in user is gainesville or etc, hardcode gnv for now
    const scheduledTime = moment(this.state.rawTime, moment.ISO_8601); //note: converting Date() to moment obj

    //not exact bounds since isBetween is non-inclusive of the bounds
    const lowerBound = moment("9:59:59", "HH:mm:ss"); //want 10:00:00 to be true
    const upperBound = moment("20:00:59", "HH:mm:ss"); //want 20:00:00 to be true

    if (!this.state.todaySelected && !this.state.tomorrowSelected) {
      //if no date selected
      this.context.showAlert("Please select a pickup date.");
      canNext = false;
    } else if (
      this.state.todaySelected &&
      scheduledTime.isAfter(upperBound) //can replace with upperbound?
    ) {
      //if selected today and its after 8 PM
      this.context.showAlert(
        "Sorry! We are closed after 8 PM. Please select a different day."
      );
      canNext = false;
    } else if (!scheduledTime.isBetween(lowerBound, upperBound)) {
      //if pickup time isnt between 10 am and 8 pm
      this.context.showAlert("The pickup time must be between 10 AM and 8 PM.");
      canNext = false;
    }

    return canNext;
  };

  getTimeAvailability = () => {
    const lowerBound = moment("9:59:59", "HH:mm:ss"); //want 10:00:00 to be true
    const upperBound = moment("20:00:59", "HH:mm:ss"); //want 20:00:00 to be true
    //let currentTime =  moment(moment(), "HH:mm:ss");

    let todayNotAvailable = false;
    if (moment(moment(), "HH:mm:ss").isAfter(upperBound)) {
      todayNotAvailable = true;
    }

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

    let startWindow = 0;
    if (
      moment(moment(), "HH:mm:ss").isBefore(lowerBound) ||
      this.state.tomorrowSelected
    ) {
      startWindow = 0;
    } else if (this.state.todaySelected) {
      for (var i = 1; i < times.length; i++) {
        var duration = moment.duration(
          times[i].time.diff(moment(moment(), "HH:mm:ss"))
        );
        let minutesBetween = parseInt(duration.asMinutes()) % 60;
        if (minutesBetween < 0) {
          continue;
        } else {
          if (minutesBetween <= 29) {
            startWindow = i + 1;
            break;
          } else {
            startWindow = i;
            break;
          }
        }
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

  handleDone = () => {
    this.props.fetchOrderInfo();
  };

  handleInputChange = (property, value) => {
    switch (property) {
      case "today":
        const hourFromNow = moment(moment(), "HH:mm:ss").add(1, "hours");
        const lowerBound = moment("9:59:59", "HH:mm:ss");
        const upperBound = moment("19:00:59", "HH:mm:ss");

        //if within operating times
        if (hourFromNow.isBetween(lowerBound, upperBound)) {
          this.setState({
            todaySelected: true,
            tomorrowSelected: false,
            date: this.today,
            rawTime: hourFromNow.toDate(),
            formattedTime: hourFromNow.format("LT"),
          });
        } else {
          this.setState({
            todaySelected: true,
            tomorrowSelected: false,
            date: this.today,
          });
        }
        break;

      case "tomorrow":
        const earliestTime = moment("10:00:00", "HH:mm:ss");
        this.setState({
          todaySelected: false,
          tomorrowSelected: true,
          date: this.tomorrow,
          rawTime: earliestTime.toDate(),
          formattedTime: earliestTime.format("LT"),
        });
        break;

      case "time":
        //value is the index of the time selected
        const rawTime = value.time.format();
        const formattedTime = value.string;
        this.setState({ rawTime, formattedTime });
        break;

      case "scented":
        this.setState({ [property]: value });
        break;

      case "delicates":
        this.setState({ [property]: value });
        break;

      case "separate":
        this.setState({ [property]: value });
        break;

      case "towelsSheets":
        this.setState({ [property]: value });
        break;

      case "washerPreferences":
        const washerLimit = 200;

        if (value.length > washerLimit) {
          value = value.slice(0, washerLimit);
        }

        this.setState({ [property]: value });
        break;

      case "address":
        this.setState({ [property]: value });
        break;

      case "addressPreferences":
        const addressLimit = 200;

        if (value.length > addressLimit) {
          value = value.slice(0, addressLimit);
        }

        this.setState({ [property]: value });
        break;

      case "map":
        this.setState({
          center: value.center,
          zoom: value.zoom,
        });
        break;

      case "loads":
        this.setState({
          loads: value,
        });
        break;
    }
  };

  handleAddressSelect = async (address) => {
    //if address was cleared, reset center, zoom, and clear marker
    if (address === "") {
      this.setState({
        center: {
          lat: 29.6516,
          lng: -82.3248,
        },
        zoom: 12,
        address: "",
        renderMarker: false,
      });
    } else {
      this.setState({ address: address });
      //maybe chain

      Geocode.setApiKey(apiKEY);
      await Geocode.fromAddress(address).then(
        (res) => {
          const { lat, lng } = res.results[0].geometry.location;

          this.setState({
            center: {
              lat: lat,
              lng: lng,
            },
            zoom: 16,
            renderMarker: true,
          });
        },
        (error) => {
          showConsoleError("Error with selecting address: ", error);
          this.context.showAlert(caughtError("selecting address", error, 99));
        }
      );
    }
  };

  evaluateWhitespace = (text) => {
    if (!text.replace(/\s/g, "").length) {
      return "N/A";
    }

    return text;
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <div className={classes.layout}>
          <div className={classes.root}>
            <CardContent id="newOrderContainer">
              <ProgressBar step={this.state.activeStep} />
              <React.Fragment>
                {this.state.activeStep === steps.length ? (
                  <React.Fragment>
                    <Typography variant="h5" gutterBottom>
                      Thank you for your order!
                    </Typography>
                    <Typography variant="subtitle1">
                      Your order number is #{this.state.orderID} and can be
                      tracked through your dashboard. Thanks for choosing
                      Laundr!
                    </Typography>
                    <div className={classes.buttons}>
                      {this.state.activeStep === steps.length && (
                        <Button
                          color="primary"
                          onClick={this.handleDone}
                          className={classes.mainButton}
                        >
                          Okay
                        </Button>
                      )}
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Fade
                      in={this.state.activeStep === 0}
                      style={{
                        display: !(this.state.activeStep === 0)
                          ? "none"
                          : "block",
                        transitionDelay:
                          this.state.activeStep === 0 ? "500ms" : "0ms",
                      }}
                    >
                      <div>
                        <Scheduling
                          today={this.today}
                          tomorrow={this.tomorrow}
                          todaySelected={this.state.todaySelected}
                          tomorrowSelected={this.state.tomorrowSelected}
                          formattedTime={this.state.formattedTime}
                          rawTime={this.state.rawTime}
                          handleInputChange={this.handleInputChange}
                          getTimeAvailability={this.getTimeAvailability}
                        />
                      </div>
                    </Fade>
                    <Fade
                      in={this.state.activeStep === 1}
                      style={{
                        display: !(this.state.activeStep === 1)
                          ? "none"
                          : "block",
                        transitionDelay:
                          this.state.activeStep === 1 ? "500ms" : "0ms",
                      }}
                    >
                      <div>
                        <Preferences
                          scented={this.state.scented}
                          delicates={this.state.delicates}
                          separate={this.state.separate}
                          towelsSheets={this.state.towelsSheets}
                          washerPreferences={this.state.washerPreferences}
                          handleInputChange={this.handleInputChange}
                        />
                      </div>
                    </Fade>
                    <Fade
                      in={this.state.activeStep === 2}
                      style={{
                        display: !(this.state.activeStep === 2)
                          ? "none"
                          : "block",
                        transitionDelay:
                          this.state.activeStep === 2 ? "500ms" : "0ms",
                      }}
                    >
                      <div>
                        <Address
                          center={this.state.center}
                          zoom={this.state.zoom}
                          address={this.state.address}
                          markerLat={this.state.markerLat}
                          markerLong={this.state.markerLong}
                          renderMarker={this.state.renderMarker}
                          addressPreferences={this.state.addressPreferences}
                          handleAddressSelect={this.handleAddressSelect}
                          handleInputChange={this.handleInputChange}
                        />
                      </div>
                    </Fade>
                    <Fade
                      in={this.state.activeStep === 3}
                      style={{
                        display: !(this.state.activeStep === 3)
                          ? "none"
                          : "block",
                        transitionDelay:
                          this.state.activeStep === 3 ? "500ms" : "0ms",
                      }}
                    >
                      <div>
                        <Pricing
                          loads={this.state.loads}
                          handleInputChange={this.handleInputChange}
                        />
                      </div>
                    </Fade>
                    <Fade
                      in={this.state.activeStep === 4}
                      style={{
                        display: !(this.state.activeStep === 4)
                          ? "none"
                          : "block",
                        transitionDelay:
                          this.state.activeStep === 4 ? "500ms" : "0ms",
                      }}
                    >
                      <div>
                        <Review
                          address={this.state.address}
                          addressPreferences={this.state.addressPreferences}
                          scented={this.state.scented}
                          delicates={this.state.delicates}
                          separate={this.state.separate}
                          towelsSheets={this.state.towelsSheets}
                          washerPreferences={this.state.washerPreferences}
                          pickupDate={this.state.date}
                          pickupTime={this.state.formattedTime}
                          loads={this.state.loads}
                        />
                      </div>
                    </Fade>
                    <div className={classes.buttons}>
                      {this.state.activeStep !== 0 && (
                        <Button
                          variant="contained"
                          onClick={this.handleBack}
                          className={classes.secondaryButton}
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={this.handleNext}
                        className={classes.mainButton}
                      >
                        {this.state.activeStep === steps.length - 1
                          ? "Place order"
                          : "Next"}
                      </Button>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            </CardContent>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

NewOrder.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(newOrderStyles)(NewOrder);
