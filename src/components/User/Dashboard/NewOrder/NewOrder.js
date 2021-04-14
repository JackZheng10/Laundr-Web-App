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
import axios from "../../../../helpers/axios";
import MainAppContext from "../../../../contexts/MainAppContext";
import LoadingButton from "../../../../components/other/LoadingButton";
import Scheduling from "./components/Scheduling";
import Preferences from "./components/Preferences/Preferences";
import Address from "./components/Address/Address";
import Pricing from "./components/Pricing";
import Review from "./components/Review";
import ProgressBar from "./components/ProgressBar";
import newOrderStyles from "../../../../styles/User/Dashboard/components/NewOrder/newOrderStyles";

const moment = require("moment-timezone");
moment.tz.setDefault("America/New_York");
const geolib = require("geolib");

const apiKEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
  require("../../../../config").google.mapsKEY;

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
      formattedTime: "N/A",
      selectValue: "",
      lowerBound: null,
      upperBound: null,
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

  getTimeAvailability = () => {
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

    const lowerBound = moment("10:00:00", "HH:mm:ss");
    const upperBound = moment("19:00:00", "HH:mm:ss");
    const now = moment();

    let availableTimes = [];
    let todayNotAvailable = false;

    //when here, user has already chosen a date

    //if after 7:00, since pickup needs to be at least 30 mins away and last window is 7:30
    if (now.isSameOrAfter(upperBound)) {
      todayNotAvailable = true;
    }

    //if date chosen
    if (this.state.tomorrowSelected || this.state.todaySelected) {
      //if before earliest pickup or after latest pickup (where todayNotAvailable would be true)
      if (this.state.tomorrowSelected) {
        availableTimes = possibleTimes;
      } else {
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
      }
    }

    return {
      availableTimes,
      todayNotAvailable,
    };
  };

  handleTimeCheck = () => {
    let canNext = true;

    const scheduledLowerBound = this.state.lowerBound;
    const scheduledUpperBound = this.state.upperBound;

    //isBetween is non-inclusive of the bounds
    const lowerBound = moment("10:00:00", "HH:mm:ss");
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
        "Sorry! Our last pickup window today has passed. Please choose a time for tomorrow."
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

  handleDone = () => {
    this.props.fetchOrderInfo();
  };

  handleInputChange = (property, value) => {
    switch (property) {
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

      case "time":
        this.setState({
          lowerBound: value.lowerBound,
          upperBound: value.upperBound,
          formattedTime: value.string,
          selectValue: value.selectValue,
        });
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

  getLbsData = () => {
    const { currentUser } = this.props;
    const loads = this.state.loads;
    const maxLbs = this.getMaxLbs(currentUser.subscription);
    const lbsLeft = currentUser.subscription.lbsLeft;
    const estLbsCost = loads * 18;

    return [
      {
        value: lbsLeft - estLbsCost >= 0 ? lbsLeft - estLbsCost : 0, //remaining sub lbs
        color: "#01c9e1",
        opacity: 1,
      },
      {
        value: estLbsCost <= lbsLeft ? estLbsCost : lbsLeft, //sub lbs used
        color: "red",
        opacity: 0.7,
      },
      {
        value: maxLbs - lbsLeft, //previously used sub lbs
        color: "#828282",
        opacity: 0.2,
      },
      {
        overage: lbsLeft - estLbsCost >= 0 ? false : true,
        overageLbs: estLbsCost - lbsLeft,
      },
    ];
  };

  getMaxLbs = (subscription) => {
    switch (subscription.plan) {
      case "Student":
        return 40;

      case "Standard":
        return 48;

      case "Plus":
        return 66;

      case "Family":
        return 84;

      default:
        return 0;
    }
  };

  render() {
    const { classes, currentUser, balance } = this.props;

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
                          selectValue={this.state.selectValue}
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
                          currentUser={currentUser}
                          getLbsData={this.getLbsData}
                          getMaxLbs={this.getMaxLbs}
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
                          currentUser={currentUser}
                          getLbsData={this.getLbsData}
                          getMaxLbs={this.getMaxLbs}
                          balance={balance}
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
