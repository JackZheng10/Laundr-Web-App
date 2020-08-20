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
      this.setState({
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
      this.setState({
        subscriptionComponent: (
          <div style={{ padding: 16 }}>
            <Grid
              container
              spacing={2}
              direction="row"
              justify="center"
              alignItems="center" /*main page column*/
            >
              <SubscriptionBoxes />
            </Grid>
          </div>
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
              Subscription
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
