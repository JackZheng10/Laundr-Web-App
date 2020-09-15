import React from "react";
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
import PropTypes from "prop-types";
import axios from "axios";
import FAQAccordion from "../../src/components/User/Help/FAQAccordion/FAQAccordion";
import MainAppContext from "../../src/contexts/MainAppContext";
import historyStyles from "../../src/styles/User/Account/historyStyles";

//todo: styling, @getting started, reach out for email?
//todo: format for readability (paragraphs, etc)
//@ my order: feature to reschedule delivery if not home? also maybe conflicts with "what happens..miss pickup.."
//@subscription: renewal refund, manual or feature?

const Help = (props) => {
  const { classes } = props;

  return (
    <Layout>
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
        <Grid item style={{ marginBottom: 16 }}>
          <Button variant="contained" className={classes.mainButton}>
            Live Chat
          </Button>
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
          <Button variant="contained" className={classes.mainButton}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

Help.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(historyStyles)(Help);
