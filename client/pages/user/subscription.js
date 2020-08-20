import React, { Component } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import { Layout } from "../../src/layouts";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import {
  TopBorderDarkPurple,
  BottomBorderDarkPurple,
  TopBorderLightPurple,
  TopBorderBlue,
  BottomBorderBlue,
} from "../../src/utility/borders";
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
    subscriptionComponent: null,
  };

  componentDidMount = async () => {
    let currentUser = getCurrentUser();

    await updateToken(currentUser.email);

    currentUser = getCurrentUser();

    this.renderSubscriptionComponent(currentUser);
  };

  renderSubscriptionComponent = (currentUser) => {
    if (currentUser.subscription.status === "active") {
      return this.setState({
        subscriptionComponent: (
          <Grid
            container
            spacing={0}
            direction="column"
            justify="center"
            alignItems="center" /*main page column*/
          >
            <SubscriptionStatus subscription={currentUser.subscription} />
          </Grid>
        ),
      });
    } else {
      return this.setState({
        subscriptionComponent: (
          <Grid
            container
            spacing={0}
            direction="row"
            justify="center"
            alignItems="center" /*main page column*/
          >
            <SubscriptionBoxes />
          </Grid>
        ),
      });
    }
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
              Subscription (WIP)
            </Typography>
          </Grid>
        </Grid>
        <div style={{ position: "relative", marginBottom: 70 }}>
          <BottomBorderBlue />
        </div>
        {this.state.subscriptionComponent}
      </Layout>
    );
  }
}

Subscription.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(subscriptionStyles)(Subscription);
