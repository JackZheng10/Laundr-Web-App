import React, { Component } from "react";
import {
  withStyles,
  Button,
  Typography,
  Fade,
  CardContent,
} from "@material-ui/core";
import { getCurrentUser } from "../../../../helpers/session";
import { withRouter } from "next/router";
import { caughtError, showConsoleError } from "../../../../helpers/errors";
import { limitLength } from "../../../../../src/helpers/inputs";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import Geocode from "react-geocode";
import validator from "validator";
import axios from "axios";
import MainAppContext from "../../../../contexts/MainAppContext";
import LoadingButton from "../../../../components/other/LoadingButton";
import Scheduling from "./components/Scheduling";
import Preferences from "./components/Preferences/Preferences";
import Address from "./components/Address/Address";
import Pricing from "./components/Pricing";
import Review from "./components/Review";
import ProgressBar from "./components/ProgressBar";
import newOrderStyles from "../../../../styles/User/Dashboard/components/NewOrder/newOrderStyles";

const moment = require("moment");
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
      tumbleDry: false,
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
        if (validator.isEmpty(this.state.address)) {
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

        if (!response.data.success) {
          if (response.data.redirect) {
            return this.props.router.push(response.data.message);
          } else {
            this.context.showAlert(response.data.message);
            canNext = false;
          }
        } else {
          this.setState({ orderID: response.data.orderID });
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
    try {
      const response = await axios.post(
        "/api/order/placeOrder",
        {
          coupon: "placeholder",
          scented: this.state.scented,
          delicates: this.state.delicates,
          separate: this.state.separate,
          towelsSheets: this.state.towelsSheets,
          tumbleDry: this.state.tumbleDry,
          washerPrefs: validator.isEmpty(this.state.washerPreferences, {
            ignore_whitespace: true,
          })
            ? "N/A"
            : this.state.washerPreferences,
          address: this.state.address,
          addressPrefs: validator.isEmpty(this.state.addressPreferences, {
            ignore_whitespace: true,
          })
            ? "N/A"
            : this.state.addressPreferences,
          loads: this.state.loads,
          pickupDate: this.state.date,
          pickupTime: this.state.formattedTime,
        },
        { withCredentials: true }
      );

      return response;
    } catch (error) {
      showConsoleError("placing order: ", error);
      return {
        data: {
          success: false,
          message: caughtError("placing order", error, 99),
        },
      };
    }
  };

  handleTimeCheck = () => {
    let canNext = true;
    //time checks, military time format: check if logged in user is gainesville or etc, hardcode gnv for now
    const scheduledTime = moment(this.state.rawTime, "HH:mm:ss"); //note: converting Date() to moment obj

    //not exact bounds since isBetween is non-inclusive of the bounds
    const lowerBound = moment("9:59:59", "HH:mm:ss"); //want 10:00:00 to be true
    const upperBound = moment("19:00:59", "HH:mm:ss"); //want 19:00:00 to be true

    //universal 1 hour from now check
    const hourFromNow = moment(moment(), "HH:mm:ss").add(1, "hours");

    if (!this.state.todaySelected && !this.state.tomorrowSelected) {
      //if no date selected
      this.context.showAlert("Please select a pickup date.");
      canNext = false;
    } else if (
      this.state.todaySelected &&
      hourFromNow.isAfter(upperBound) //can replace with upperbound?
    ) {
      //if selected today and its after 7 PM
      this.context.showAlert(
        "Sorry! The pickup time must be at least 1 hour from now and we are closed after 7 PM. Please select a different day."
      );
      canNext = false;
    } else if (!scheduledTime.isBetween(lowerBound, upperBound)) {
      //if pickup time isnt between 10 am and 7 pm
      this.context.showAlert("The pickup time must be between 10 AM and 7 PM.");
      canNext = false;
    } else if (
      hourFromNow.isBetween(lowerBound, upperBound) &&
      scheduledTime.isBefore(hourFromNow) &&
      this.state.todaySelected
    ) {
      //if 1 hr in advance is between 10 and 7 AND pickup time is before that AND the date selected is today
      this.context.showAlert(
        "The pickup time must be at least 1 hour from now."
      );
      canNext = false;
    }

    return canNext;
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
        const formattedTime = moment(value, "HH:mm:ss").format("LT");
        this.setState({ rawTime: value, formattedTime });
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
      
      case "tumbleDry":
        this.setState({ [property]: value });
        break;

      case "washerPreferences":
        value = limitLength(value, 200);
        this.setState({ [property]: value });
        break;

      case "address":
        this.setState({ [property]: value });
        break;

      case "addressPreferences":
        value = limitLength(value, 200);
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
                          tumbleDry={this.state.tumbleDry}
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
                          tumbleDry={this.state.tumbleDry}
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
                      <LoadingButton
                        variant="contained"
                        onClick={this.handleNext}
                        className={classes.mainButton}
                      >
                        {this.state.activeStep === steps.length - 1
                          ? "Place order"
                          : "Next"}
                      </LoadingButton>
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

export default compose(withRouter, withStyles(newOrderStyles))(NewOrder);
