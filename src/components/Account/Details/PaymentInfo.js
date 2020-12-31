import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Card,
  CardContent,
  Divider,
  CardActions,
  Button,
  TextField,
  CardHeader,
  Fade,
  Collapse,
} from "@material-ui/core";
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getCurrentUser, updateToken } from "../../../helpers/session";
import { caughtError, showConsoleError } from "../../../helpers/errors";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../../contexts/MainAppContext";
import paymentInfoStyles from "../../../styles/User/Account/components/paymentInfoStyles";

//todo: maybe use the red/green for other confirms/cancels
//todo: rerender after stored card (updating child state does not rerender parent)
//todo: in .catch errors in server, specify also what went wrong!

//todo: use callback with alert for order fetching so you CAN refresh the page? but prob not since its a snackbar...

const stripeKEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  require("../../../config").stripe.publishableKEY;

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(stripeKEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

class PaymentInfo extends Component {
  static contextType = MainAppContext;

  state = {
    showPaymentUpdate: false,
  };

  toggleShowPaymentUpdate = () => {
    this.setState({ showPaymentUpdate: !this.state.showPaymentUpdate });
  };

  handleSetupIntent = async () => {
    try {
      const currentUser = this.props.user;

      const response = await axios.post(
        "/api/stripe/createSetupIntent",
        {
          customerID: currentUser.stripe.customerID,
        },
        { withCredentials: true }
      );

      return response;
      // if (response.data.success) {
      //   secret = response.data.message;
      // } else {
      //   return this.context.showAlert(response.data.message);
      // }
    } catch (error) {
      showConsoleError("creating setup intent", error);
      return {
        data: {
          success: false,
          message: caughtError("creating setup intent", error, 99),
        },
      };
    }
  };

  handleCardSetup = async () => {
    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    //create a setup intent
    const response = await this.handleSetupIntent();
    let secret;

    //check for error in creating setup intent
    if (!response.data.success) {
      if (response.data.redirect) {
        return this.props.router.push(response.data.message);
      } else {
        return this.context.showAlert(response.data.message);
      }
    } else {
      secret = response.data.message;
    }

    const currentUser = this.props.user;
    const name = `${currentUser.fname} ${currentUser.lname}`;

    //confirm card setup with the secret from setup intent
    const result = await stripe.confirmCardSetup(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name,
        },
      },
    });

    //check for error in card setup
    if (result.error) {
      // Display result.error.message in your UI.
      return this.context.showAlert(
        caughtError("confirming payment method", result.error.message, 99)
      );
    } else {
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
      await this.handleUpdatePaymentID(result, currentUser);
    }
  };

  handleUpdatePaymentID = async (result) => {
    //update the regPaymentID in database
    try {
      const response = await axios.post(
        "/api/stripe/setRegPaymentID",
        {
          regPaymentID: result.setupIntent.payment_method,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        this.setState(
          { showPaymentUpdate: !this.state.showPaymentUpdate },
          () => {
            this.context.showAlert(response.data.message, () => {
              this.props.fetchPaymentInfo();
            });
          }
        );
      } else {
        this.context.showAlert(response.data.message);
      }
    } catch (error) {
      showConsoleError("updating payment ID", error);
      this.context.showAlert(caughtError("updating payment ID", error, 99));
    }
  };

  renderPaymentButtons = (classes) => {
    if (!this.state.showPaymentUpdate) {
      return (
        <Grid item>
          <Button
            size="medium"
            variant="contained"
            className={classes.secondaryButton}
            onClick={this.toggleShowPaymentUpdate}
          >
            Update
          </Button>
        </Grid>
      );
    } else {
      return (
        <React.Fragment>
          <Grid item>
            <Button
              size="medium"
              variant="contained"
              className={classes.redButton}
              onClick={this.toggleShowPaymentUpdate}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              size="medium"
              variant="contained"
              className={classes.greenButton}
              onClick={this.handleCardSetup}
            >
              Confirm
            </Button>
          </Grid>
        </React.Fragment>
      );
    }
  };

  render() {
    const { classes, card } = this.props;

    return (
      <React.Fragment>
        <Card className={classes.root} elevation={10}>
          <CardHeader
            title="Payment Info"
            titleTypographyProps={{
              variant: "h4",
              style: {
                color: "white",
              },
            }}
            className={classes.cardHeader}
          />
          <CardContent>
            <Grid //main column
              container
              spacing={2}
            >
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Brand"
                  size="small"
                  value={card.brand}
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.input}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Expiration"
                  size="small"
                  value={`${card.expMonth}/${card.expYear}`}
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.input}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last 4 #"
                  size="small"
                  value={card.lastFour}
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.input}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className={classes.cardFooter}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              {this.renderPaymentButtons(classes)}
            </Grid>
          </CardActions>
          <Collapse
            in={this.state.showPaymentUpdate}
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <div style={{ width: "100%" }}>
                  <Fade
                    in={this.state.showPaymentUpdate}
                    style={{
                      display: !this.state.showPaymentUpdate ? "none" : "block",
                      transitionDelay: this.state.showPaymentUpdate
                        ? "500ms"
                        : "0ms",
                    }}
                  >
                    <Grid item>
                      <div style={{ width: "100%" }}>
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                    </Grid>
                  </Fade>
                </div>
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
      </React.Fragment>
    );
  }
}

function InjectedPaymentInfo(props) {
  const { classes, card, fetchPaymentInfo, user } = props;

  return (
    <Elements stripe={stripePromise}>
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <PaymentInfo
            stripe={stripe}
            elements={elements}
            classes={classes}
            card={card}
            user={user}
            fetchPaymentInfo={fetchPaymentInfo}
          />
        )}
      </ElementsConsumer>
    </Elements>
  );
}

InjectedPaymentInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(paymentInfoStyles)(InjectedPaymentInfo);
