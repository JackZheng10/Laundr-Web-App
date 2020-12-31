import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import { BottomBorderBlue } from "../../src/utility/borders";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import { Layout } from "../../src/layouts";
import {
  GettingStarted,
  MyOrder,
  Subscriptions,
  CompanyInfo,
} from "../../src/components/User/Help/FAQAccordion/questions";
import { GetServerSideProps } from "next";
import { withRouter } from "next/router";
import {
  getExistingOrder_SSR,
  getCurrentUser_SSR,
} from "../../src/helpers/ssr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "axios";
import FAQAccordion from "../../src/components/User/Help/FAQAccordion/FAQAccordion";
import MainAppContext from "../../src/contexts/MainAppContext";
import historyStyles from "../../src/styles/User/Account/historyStyles";

//todo: styling, @getting started, reach out for email?
//todo: format for readability (paragraphs, etc)
//@ my order: feature to reschedule delivery if not home? also maybe conflicts with "what happens..miss pickup.."
//@subscription: renewal refund, manual or feature?

class Help extends Component {
  static contextType = MainAppContext;

  componentDidMount = async () => {
    const { fetch_SSR } = this.props;

    if (!fetch_SSR.success) {
      this.context.showAlert(fetch_SSR.message);
    }
  };

  render() {
    const { classes, fetch_SSR } = this.props;

    return (
      <Layout currentUser={fetch_SSR.success ? fetch_SSR.userInfo : null}>
        <Grid
          container
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
              Help
            </Typography>
          </Grid>
        </Grid>
        <div style={{ position: "relative", marginBottom: 70 }}>
          <BottomBorderBlue />
        </div>
        <Grid container direction="column" justify="center" alignItems="center">
          <FAQAccordion title="Getting Started" questions={GettingStarted} />
          <FAQAccordion title="My Order" questions={MyOrder} />
          <FAQAccordion title="Subscriptions" questions={Subscriptions} />
          <FAQAccordion title="Company Info" questions={CompanyInfo} />
          <Grid item>
            <Typography variant="h1" style={{ color: "#01C9E1" }} gutterBottom>
              Still need help?
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Call customer service at (352) 363-5211!
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" gutterBottom>
              or
            </Typography>
          </Grid>
          <Grid item style={{ marginBottom: 16 }}>
            <Button
              variant="contained"
              className={classes.mainButton}
              onClick={() => {
                alert("In progress");
              }}
            >
              Live Chat
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="h5" gutterBottom>
              or
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Send us a message and we'll get back to you ASAP.
            </Typography>
          </Grid>
          <Grid item style={{ marginBottom: 16 }}>
            <TextField
              label="Message"
              fullWidth
              multiline
              variant="outlined"
              className={classes.input}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              className={classes.mainButton}
              onClick={() => {
                alert("In progress");
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

Help.propTypes = {
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
            destination: "/accessDenied",
            permanent: false,
          },
        };
      }
      break;

    case "washer":
      if (!currentUser.isWasher) {
        return {
          redirect: {
            destination: "/accessDenied",
            permanent: false,
          },
        };
      }
      break;

    case "driver":
      if (!currentUser.isDriver) {
        return {
          redirect: {
            destination: "/accessDenied",
            permanent: false,
          },
        };
      }
      break;

    case "admin":
      if (!currentUser.isAdmin) {
        return {
          redirect: {
            destination: "/accessDenied",
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

export default compose(withRouter, withStyles(historyStyles))(Help);
