import React, { Component } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import { Layout } from "../../src/layouts";
import { getCurrentUser } from "../../src/helpers/session";
import {
  TopBorderDarkPurple,
  BottomBorderDarkPurple,
  TopBorderLightPurple,
  TopBorderBlue,
  BottomBorderBlue,
} from "../../src/utility/borders";
import { GetServerSideProps } from "next";
import { withRouter } from "next/router";
import { GET_SWR, getFilterConfig, hasPageAccess } from "../../src/helpers/swr";
import useSWR from "swr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import axios from "../../src/helpers/axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import SubscriptionBoxes from "../../src/components/User/Subscription/SubscriptionBoxes/SubscriptionBoxes";
import SubscriptionStatus from "../../src/components/User/Subscription/SubscriptionStatus/SubscriptionStatus";
import subscriptionStyles from "../../src/styles/User/Subscription/subscriptionStyles";

//todo: why does it do 3+1 but then 4 in a row after a refresh for the cards

class Subscription extends Component {
  static contextType = MainAppContext;

  renderSubscriptionComponent = () => {
    const { currentUser } = this.props;

    if (currentUser.subscription.status === "active") {
      return (
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <SubscriptionStatus currentUser={currentUser} />
        </Grid>
      );
    } else {
      return (
        <div style={{ padding: 16 }}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <SubscriptionBoxes currentUser={currentUser} />
          </Grid>
        </div>
      );
    }
  };

  render() {
    const { classes, currentUser } = this.props;

    return (
      <Layout currentUser={currentUser}>
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
        <Grid
          container
          spacing={0}
          direction="row"
          justify="center"
          alignItems="center" /*main page column*/
        >
          {this.renderSubscriptionComponent()}
        </Grid>
      </Layout>
    );
  }
}

Subscription.propTypes = {
  classes: PropTypes.object.isRequired,
};

const SubscriptionCSR = (props) => {
  const { data: response, error } = useSWR("/api/user/getCurrentUser", GET_SWR);

  if (error) return <h1>{error.message}</h1>;
  if (!response) return <h1>loading... (placeholder)</h1>;

  const currentUser = response.data.message;

  if (!response.data.success) {
    props.router.push(response.data.message);
    return <h1>redirecting... (placeholder)</h1>;
  }

  if (!hasPageAccess(currentUser, window)) {
    props.router.push("/accessDenied");
    return <h1>redirecting... (placeholder)</h1>;
  }

  return <Subscription currentUser={currentUser} {...props} />;
};

export default compose(
  withRouter,
  withStyles(subscriptionStyles)
)(SubscriptionCSR);
