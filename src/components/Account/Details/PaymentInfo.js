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
    card: {
      brand: "N/A",
      expMonth: "N/A",
      expYear: "N/A",
      lastFour: "N/A",
    },
  };

  componentDidMount = async () => {
    const { regPaymentID } = this.props.user.stripe;

    if (regPaymentID !== "N/A") {
      try {
        const response = await axios.post("/api/stripe/getCardDetails", {
          paymentID: regPaymentID,
        });

        if (response.data.success) {
          const card = response.data.message.card;

          const cardInfo = {
            brand: card.brand.toUpperCase(),
            expMonth: card.exp_month,
            expYear: card.exp_year,
            lastFour: card.last4,
          };

          this.setState({
            card: cardInfo,
          });
        } else {
          this.context.showAlert(response.data.message);
        }
      } catch (error) {
        showConsoleError("getting card details", error);
        this.context.showAlert(caughtError("getting card details", error, 99));
      }
    }
  };

  toggleShowPaymentUpdate = () => {
    this.setState({ showPaymentUpdate: !this.state.showPaymentUpdate });
  };

  handleSetupIntent = async () => {
    let secret = "";

    try {
      const currentUser = getCurrentUser();

      const response = await axios.post("/api/stripe/createSetupIntent", {
        customerID: currentUser.stripe.customerID,
      });

      if (response.data.success) {
        secret = response.data.message;
      } else {
        this.context.showAlert(response.data.message);
      }
    } catch (error) {
      showConsoleError("creating setup intent", error);
      this.context.showAlert(caughtError("creating setup intent", error, 99));
    }

    return secret;
  };

  handleCardSetup = async () => {
    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    //create a setup intent
    const secret = await this.handleSetupIntent();
    const currentUser = getCurrentUser();
    const name = `${currentUser.fname} ${currentUser.lname}`;

    //confirm card setup with the secret
    const result = await stripe.confirmCardSetup(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name,
        },
      },
    });

    if (result.error) {
      // Display result.error.message in your UI.
      this.context.showAlert(
        caughtError("setting payment method", result.error.message, 99)
      );
    } else {
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
      try {
        const response = await axios.post("/api/stripe/setRegPaymentID", {
          email: currentUser.email,
          regPaymentID: result.setupIntent.payment_method,
        });

        if (response.data.success) {
          await updateToken(currentuser.email);
          this.context.showAlert(response.data.message);
        } else {
          this.context.showAlert(response.data.message);
        }
      } catch (error) {
        showConsoleError("updating card", error);
        this.context.showAlert(caughtError("updating card", error, 99));
      }
    }
  };

  renderPaymentButtons = (classes) => {
    if (!this.state.showPaymentUpdate) {
      return (
        <Grid item>
          <Button
            size="small"
            variant="contained"
            className={classes.gradientButton}
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
              size="small"
              variant="contained"
              className={classes.gradientButtonRed}
              onClick={this.toggleShowPaymentUpdate}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              size="small"
              variant="contained"
              className={classes.gradientButtonGreen}
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
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Card className={classes.root}>
          <CardHeader
            title="Payment Info"
            titleTypographyProps={{ variant: "h5" }}
            className={classes.centerTitle}
          />
          <Divider />
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
                  value={this.state.card.brand}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Expiration"
                  size="small"
                  value={`${this.state.card.expMonth}/${this.state.card.expYear}`}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last 4 #"
                  size="small"
                  value={this.state.card.lastFour}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
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

InjectedPaymentInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

function InjectedPaymentInfo(props) {
  const { classes, user } = props;

  return (
    <Elements stripe={stripePromise}>
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <PaymentInfo
            stripe={stripe}
            elements={elements}
            classes={classes}
            user={user}
          />
        )}
      </ElementsConsumer>
    </Elements>
  );
}

export default withStyles(paymentInfoStyles)(InjectedPaymentInfo);
