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
import { GET_SWR, getFilterConfig, hasPageAccess } from "../../src/helpers/swr";
import useSWR from "swr";
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

  render() {
    const { classes, currentUser } = this.props;

    return (
      <Layout currentUser={currentUser}>
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
                window.open("https://m.me/laundrofficial");
              }}
            >
              Chat With Us
            </Button>
          </Grid>
          {/* <Grid item>
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
          </Grid> */}
        </Grid>
      </Layout>
    );
  }
}

Help.propTypes = {
  classes: PropTypes.object.isRequired,
};

const HelpCSR = (props) => {
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

  return <Help currentUser={currentUser} {...props} />;
};

export default compose(withRouter, withStyles(historyStyles))(HelpCSR);
