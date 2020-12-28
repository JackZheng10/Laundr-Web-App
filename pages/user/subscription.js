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
import {
  getExistingOrder_SSR,
  getCurrentUser_SSR,
} from "../../src/helpers/ssr";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import jwtDecode from "jwt-decode";
import axios from "axios";
import SubscriptionBoxes from "../../src/components/User/Subscription/SubscriptionBoxes/SubscriptionBoxes";
import SubscriptionStatus from "../../src/components/User/Subscription/SubscriptionStatus/SubscriptionStatus";
import subscriptionStyles from "../../src/styles/User/Subscription/subscriptionStyles";

class Subscription extends Component {
  componentDidMount = () => {
    const { fetch_SSR } = this.props;

    if (!fetch_SSR.success) {
      this.context.showAlert(fetch_SSR.message);
    }
  };

  renderSubscriptionComponent = () => {
    const { fetch_SSR } = this.props;
    const currentUser = fetch_SSR.userInfo;

    if (!fetch_SSR.success) {
      return <div></div>;
    }

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
    const { classes, fetch_SSR } = this.props;

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
        {this.renderSubscriptionComponent()}
      </Layout>
    );
  }
}

Subscription.propTypes = {
  classes: PropTypes.object.isRequired,
};

export async function getServerSideProps(context) {
  //fetch current user
  const response_one = await getCurrentUser_SSR(context);

  //check for redirect needed due to invalid session or error in fetching
  if (!response_one.data.success) {
    if (response_one.data.redirect) {
      return {
        redirect: {
          destination: response_one.data.message,
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          fetch_SSR: {
            success: false,
            message: response_one.data.message,
          },
        },
      };
    }
  }

  //check for permissions to access page if no error from fetching user
  const currentUser = response_one.data.message;
  const urlSections = context.resolvedUrl.split("/");

  switch (urlSections[1]) {
    case "user":
      if (currentUser.isDriver || currentUser.isWasher || currentUser.isAdmin) {
        return {
          redirect: {
            destination: "/noAccess",
            permanent: false,
          },
        };
      }
      break;

    case "washer:":
      if (!currentUser.isWasher) {
        return {
          redirect: {
            destination: "/noAccess",
            permanent: false,
          },
        };
      }
      break;

    case "driver":
      if (!currentUser.isDriver) {
        return {
          redirect: {
            destination: "/noAccess",
            permanent: false,
          },
        };
      }
      break;

    case "admin":
      if (!currentUser.isAdmin) {
        return {
          redirect: {
            destination: "/noAccess",
            permanent: false,
          },
        };
      }
      break;
  }

  //everything ok, so current user is fetched (currentUser is valid)

  //return info for fetched user, available via props
  return {
    props: {
      fetch_SSR: {
        success: true,
        userInfo: currentUser,
      },
    },
  };
}

export default compose(
  withRouter,
  withStyles(subscriptionStyles)
)(Subscription);
