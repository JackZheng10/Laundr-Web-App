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
import AccountInfo from "../../src/components/Account/Details/AccountInfo";
import PaymentInfo from "../../src/components/Account/Details/PaymentInfo";
import detailsStyles from "../../src/styles/User/Account/detailsStyles";

//todo: revise data fetching flow here
//todo: fetch everything you need here.
//todo: reorganize the styles

class Details extends Component {
  state = {
    user: null,
    accountInfoComponent: null,
    paymentInfoComponent: null,
  };

  componentDidMount = async () => {
    let currentUser = getCurrentUser();

    await updateToken(currentUser.email);

    currentUser = getCurrentUser();

    this.setState({
      accountInfoComponent: <AccountInfo user={currentUser} />,
      paymentInfoComponent: <PaymentInfo user={currentUser} />,
    });
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
