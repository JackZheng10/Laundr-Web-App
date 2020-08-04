import React, { Component } from "react";
import {
  withStyles,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Divider,
} from "@material-ui/core";
import { loadStripe } from "@stripe/stripe-js";
import { getCurrentUser, updateToken } from "../../../../../../helpers/session";
import {
  showDefaultError,
  showConsoleError,
} from "../../../../../../helpers/errors";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../../../../../baseURL";
import subscriptionCardStyles from "../../../../../../styles/User/Subscription/components/SubscriptionBoxes/components/subscriptionCardStyles";

const stripeKEY =
  process.env.STRIPE_PUBLISHABLE_KEY ||
  require("../../../../../../config").stripe.publishableKEY;

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(stripeKEY);

class SubscriptionCard extends Component {
  handlePurchase = async () => {
    // When the customer clicks on the button, redirect them to Checkout.
    // Call your backend to create the Checkout session.
    try {
      const currentUser = getCurrentUser();

      const response = await axios.post(
        baseURL + "/stripe/createCheckoutSession",
        { type: this.props.planName, customerID: currentUser.stripe.customerID }
      );

      if (response.data.success) {
        const sessionId = response.data.message;

        const stripe = await stripePromise;

        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (error) {
          showDefaultError(error.message, 99);
        }
      } else {
        showDefaultError("creating checkout session", 99);
      }
    } catch (error) {
      showConsoleError("creating checkout session", error);
      showDefaultError("creating checkout session", error, 99);
    }
  };

  render() {
    const { classes, planName, priceText, text, image } = this.props;

    return (
      <React.Fragment>
        <Card className={classes.root}>
          <CardMedia className={classes.media} image={image} />
          <CardContent style={{ textAlign: "center" }}>
            <Typography gutterBottom variant="h3">
              {planName}
            </Typography>
            <Typography variant="h4" color="textSecondary" gutterBottom>
              {priceText}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {text}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions style={{ justifyContent: "center" }}>
            <Button
              size="small"
              variant="contained"
              className={classes.gradientButton}
              onClick={this.handlePurchase}
            >
              Purchase
            </Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
}

SubscriptionCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(subscriptionCardStyles)(SubscriptionCard);
