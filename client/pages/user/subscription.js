import React, { Component } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import { Layout } from "../../src/layouts";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import baseURL from "../../src/baseURL";
import axios from "axios";
import SubscriptionBoxes from "../../src/components/User/Subscription/SubscriptionBoxes/SubscriptionBoxes";
import SubscriptionStatus from "../../src/components/User/Subscription/SubscriptionStatus/SubscriptionStatus";
import subscriptionStyles from "../../src/styles/User/Subscription/subscriptionStyles";

//todo: add card header and divider to review page, similar to order status
//todo: add cost to order
//todo: if any other page needs an updated token, do that
//todo: add bottom border section to every page?
//todo: after purchasing, the sub object might not get updated by the webhook in time for the redirect to be updated pg?
//todo: add loading bar to interactions - especially entering weight so button not clicked multiple times
//todo: refactor calls to stripe? try catch instead of async? like in charge?
//todo: make sure everything is async awaited
//todo: change size of subscription card since its larger than iphone 5s width
//todo: change spacing and stuff for right/left side: see order status and new order's layout/root? understand how devias's acc pg works.
//todo: center update payment info, when click, dropdown confirm/cancel and show cardElement
//todo: can handle onChange better with bookmarked thing
//todo: post, get, put, etc. fix that bruh
//todo: make gettoken function, or decode token you know

class Subscription extends Component {
  //todo: adopt ordercomponent thing from dashboard as well so it doesnt flash sub boxes before switching
  state = {
    subscription: {
      plan: "",
      lbsLeft: "",
      periodStart: "N/A",
      periodEnd: "N/A",
      status: "N/A",
    },
  };

  componentDidMount = async () => {
    let currentUser = getCurrentUser();

    await updateToken(currentUser.email);

    currentUser = getCurrentUser();

    this.setState({ subscription: currentUser.subscription });
  };

  renderSubscriptionComponent = () => {
    if (this.state.subscription.status === "active") {
      return (
        <React.Fragment>
          <Grid
            container
            spacing={2}
            direction="column"
            justify="center"
            alignItems="center" /*main page column*/
          >
            <SubscriptionStatus subscription={this.state.subscription} />
          </Grid>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="center" /*main page column*/
          >
            <SubscriptionBoxes />
          </Grid>
        </React.Fragment>
      );
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Layout>
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
          style={{
            paddingTop: 8,
            backgroundColor: "#21d0e5",
          }}
        >
          <Grid item>
            <Typography variant="h1" className={classes.componentName}>
              Subscription
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src="/images/UserDashboard/sectionBorder.png"
            style={{
              width: "100%",
              height: "100%",
              paddingTop: 8,
              paddingBottom: 15,
            }}
            alt="Section border"
          />
        </Grid>
        {this.renderSubscriptionComponent()}
      </Layout>
    );
  }
}

Subscription.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(subscriptionStyles)(Subscription);
