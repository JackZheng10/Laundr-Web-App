import React, { Component } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import { Layout } from "../../src/layouts";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import {
  TopBorderDarkPurple,
  BottomBorderDarkPurple,
  TopBorderLightPurple,
  TopBorderBlue,
  BottomBorderBlue,
} from "../../src/utility/borders";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import AccountInfo from "../../src/components/Account/Details/AccountInfo";
import PaymentInfo from "../../src/components/Account/Details/PaymentInfo";
import detailsStyles from "../../src/styles/User/Account/detailsStyles";

//todo: revise data fetching flow here
//todo: fetch everything you need here.
//todo: reorganize the styles

class Details extends Component {
  static contextType = MainAppContext;

  state = {
    accountInfoComponent: null,
    paymentInfoComponent: null,
    card: {
      brand: "N/A",
      expMonth: "N/A",
      expYear: "N/A",
      lastFour: "N/A",
    },
  };

  componentDidMount = async () => {
    let currentUser = getCurrentUser();

    await updateToken(currentUser.email);

    currentUser = getCurrentUser();

    const shouldRenderPayment = this.shouldRenderPayment(currentUser);

    //if payment method should be rendered
    if (shouldRenderPayment) {
      const regPaymentID = currentUser.stripe.regPaymentID;

      //if they have a payment method, fetch the info
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
          this.context.showAlert(
            caughtError("getting card details", error, 99)
          );
        }
      }
    }

    this.setState({
      accountInfoComponent: <AccountInfo user={currentUser} />,
      paymentInfoComponent: shouldRenderPayment && (
        <PaymentInfo user={currentUser} card={this.state.card} />
      ),
    });
  };

  shouldRenderPayment = (currentUser) => {
    if (currentUser.isWasher || currentUser.isDriver || currentUser.isAdmin) {
      return false;
    }

    return true;
  };

  render() {
    const { classes } = this.props;

    return (
      <Layout>
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
          style={{
            paddingTop: 10,
            backgroundColor: "#01C9E1",
          }}
        >
          <Grid item>
            <Typography
              variant="h1"
              className={classes.componentName}
              gutterBottom
            >
              Account
            </Typography>
          </Grid>
        </Grid>
        <div style={{ position: "relative", marginBottom: 70 }}>
          <BottomBorderBlue />
        </div>
        <div style={{ padding: 16 }}>
          <Grid
            container
            spacing={2}
            direction="column"
            justify="center"
            alignItems="center" /*main page column*/
          >
            <Grid item>{this.state.accountInfoComponent}</Grid>
            <Grid item>{this.state.paymentInfoComponent}</Grid>
          </Grid>
        </div>
      </Layout>
    );
  }
}

Details.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(detailsStyles)(Details);
