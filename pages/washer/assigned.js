import React, { Component } from "react";
import {
  withStyles,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
  Paper,
} from "@material-ui/core";
import {
  TopBorderDarkPurple,
  BottomBorderDarkPurple,
  TopBorderLightPurple,
  TopBorderBlue,
  BottomBorderBlue,
} from "../../src/utility/borders";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import { Layout } from "../../src/layouts";
import { GetServerSideProps } from "next";
import { withRouter } from "next/router";
import {
  getExistingOrder_SSR,
  getCurrentUser_SSR,
  fetchOrders_WA_SSR,
} from "../../src/helpers/ssr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import OrderTable from "../../src/components/Washer/OrderTable/OrderTable";
import assignedStyles from "../../src/styles/Washer/Assigned/assignedStyles";

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled

//only display status 0 and 4, ones able to be "accepted"

class AssignedDashboard extends Component {
  static contextType = MainAppContext;

  state = { orders: [], userFname: "" };

  componentDidMount = async () => {
    const { fetch_SSR } = this.props;

    if (!fetch_SSR.success) {
      this.context.showAlert(fetch_SSR.message);
    }
  };

  //not touched
  handleWasherDone = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put("/api/washer/setWasherDone", {
        orderID,
      });

      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      showConsoleError("setting order as done by washer", error);
      return {
        success: false,
        message: caughtError("setting order as done by washer", error, 99),
      };
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
            paddingTop: 8,
            backgroundColor: "#01C9E1",
          }}
        >
          <Grid item>
            <Paper elevation={0} className={classes.welcomeCard}>
              <Typography
                variant="h3"
                className={classes.welcomeText}
                gutterBottom
              >
                {`Welcome, ${this.state.userFname}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Typography
              variant="h1"
              className={classes.componentName}
              gutterBottom
            >
              Assigned Orders
            </Typography>
          </Grid>
        </Grid>
        <div style={{ position: "relative", marginBottom: 70 }}>
          <BottomBorderBlue />
        </div>
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <Grid
            item
            style={{ width: "100%", paddingLeft: 10, paddingRight: 10 }}
          >
            <OrderTable
              orders={fetch_SSR.success ? fetch_SSR.orders : []}
              fetchOrders={this.fetchOrders}
              handleWasherDone={this.handleWasherDone}
            />
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

AssignedDashboard.propTypes = {
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
    case "washer:":
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

  //fetch their assigned orders via user id
  const response_two = await fetchOrders_WA_SSR(context, currentUser);

  //check for error
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
  }

  //return info for fetched user, available via props
  return {
    props: {
      fetch_SSR: {
        success: true,
        userInfo: currentUser,
        orders: response_two.data.message,
      },
    },
  };
}

export default compose(
  withRouter,
  withStyles(assignedStyles)
)(AssignedDashboard);
