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
import { GetServerSideProps } from "next";
import { withRouter } from "next/router";
import {
  getExistingOrder_SSR,
  getCurrentUser_SSR,
  fetchOrders_WA_SSR,
  fetchOrders_DAV_SSR,
  fetchCardDetails_SSR,
} from "../../src/helpers/ssr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import AccountInfo from "../../src/components/Account/Details/AccountInfo";
import PaymentInfo from "../../src/components/Account/Details/PaymentInfo";
import detailsStyles from "../../src/styles/User/Account/detailsStyles";

//todo: need to show payment info to only some users? (not admins/drivers/washers?)

class Details extends Component {
  static contextType = MainAppContext;

  componentDidMount = async () => {
    const { fetch_SSR } = this.props;

    if (!fetch_SSR.success) {
      this.context.showAlert(fetch_SSR.message);
    }
  };

  fetchPaymentInfo = () => {
    window.location.reload();
  };

  render() {
    const { classes, fetch_SSR } = this.props;

    return (
      <Layout currentUser={fetch_SSR.success ? fetch_SSR.userInfo : null}>
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
            <Grid item>
              {fetch_SSR.success ? (
                <AccountInfo user={fetch_SSR.userInfo} />
              ) : null}
            </Grid>
            <Grid item>
              {fetch_SSR.success ? (
                <PaymentInfo
                  user={fetch_SSR.userInfo}
                  card={fetch_SSR.cardInfo}
                  fetchPaymentInfo={this.fetchPaymentInfo}
                />
              ) : null}
            </Grid>
          </Grid>
        </div>
      </Layout>
    );
  }
}

Details.propTypes = {
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

  //any user can access this page
  const currentUser = response_one.data.message;

  //fetch card if user has one
  let cardInfo;

  if (currentUser.stripe.regPaymentID != "N/A") {
    const response_two = await fetchCardDetails_SSR(context, currentUser);

    //check for error in fetching (***will throw an error if payment method ID is incorrect)
    if (!response_two.data.success) {
      if (response_two.data.redirect) {
        return {
          redirect: {
            destination: response_two.data.message,
            permanent: false,
          },
        };
      } else {
        return {
          props: {
            fetch_SSR: {
              success: false,
              message: response_two.data.message,
            },
          },
        };
      }
    } else {
      //if successful, return the correct card info
      const card = response_two.data.message.card;

      cardInfo = {
        brand: card.brand.toUpperCase(),
        expMonth: card.exp_month,
        expYear: card.exp_year,
        lastFour: card.last4,
      };
    }
  } else {
    //no card fetch needed? just return a default dummy card instead
    cardInfo = {
      brand: "N/A",
      expMonth: "N/A",
      expYear: "N/A",
      lastFour: "N/A",
    };
  }

  return {
    props: {
      fetch_SSR: {
        success: true,
        userInfo: currentUser,
        cardInfo: cardInfo,
      },
    },
  };
}

export default compose(withRouter, withStyles(detailsStyles))(Details);
