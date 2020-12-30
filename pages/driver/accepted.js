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
  fetchOrders_DAV_SSR,
  fetchOrders_DAC_SSR,
} from "../../src/helpers/ssr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import OrderTable from "../../src/components/Driver/OrderTable/OrderTable";
import acceptedStyles from "../../src/styles/Driver/Accepted/acceptedStyles";

//todo: refresh list after completing an action, and THEN show the snackbar?

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled

//only display status 1 (need to enter weight), 2: (mark dropped to washer), 5: (mark delivered to user)

class AcceptedDashboard extends Component {
  static contextType = MainAppContext;

  constructor(props) {
    super(props);

    this.state = {
      orders: this.props.fetch_SSR.success ? this.props.fetch_SSR.orders : [],
      weight: "",
      weightErrorMsg: "",
    };
  }

  componentDidMount = async () => {
    const { fetch_SSR } = this.props;

    if (!fetch_SSR.success) {
      this.context.showAlert(fetch_SSR.message);
    }
  };

  fetchOrders = async () => {
    try {
      const { fetch_SSR } = this.props;

      const response = await axios.post(
        "/api/order/fetchOrders",
        {
          filter: "driverAccepted",
          userID: fetch_SSR.userInfo.userID,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        if (response.data.redirect) {
          this.props.router.push(response.data.message);
        } else {
          this.context.showAlert(response.data.message);
        }
      } else {
        this.setState({ orders: response.data.message });
      }
    } catch (error) {
      showConsoleError("fetching orders", error);
      this.context.showAlert(caughtError("fetching orders", error, 99));
    }
  };

  handleWeightChange = (weight) => {
    //todo: make sure decimal works
    const regex = /^\d*\.?\d*$/;

    if (weight === "" || regex.test(weight)) {
      this.setState({ weight: weight });
    }
  };

  validateWeightMinimum = () => {
    if (!this.state.weight.replace(/\s/g, "").length) {
      this.setState({
        weightErrorMsg: "Please enter a weight.",
      });

      return false;
    } else if (this.state.weight < 10) {
      this.setState({
        weightErrorMsg: "Minimum weight to be entered is 10 lbs.",
      });

      return false;
    } else {
      this.setState({
        weightErrorMsg: "",
      });
      return true;
    }
  };

  handleClearWeightError = () => {
    this.setState({ weightErrorMsg: "" });
  };

  handleChargeCustomer = async (order) => {
    try {
      const userID = order.userInfo.userID;
      const orderID = order.orderInfo.orderID;

      const response = await axios.post("/api/stripe/chargeCustomer", {
        weight: this.state.weight,
        userID: userID,
        orderID: orderID,
      });

      return response;
    } catch (error) {
      showConsoleError("charging customer", error);
      return {
        data: {
          success: false,
          message: caughtError("charging customer", error, 99),
        },
      };
    }
  };

  handleUpdateWeight = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put("/api/driver/updateOrderWeight", {
        weight: this.state.weight,
        orderID,
      });

      return response;
    } catch (error) {
      showConsoleError("entering weight", error);
      return {
        data: {
          success: false,
          message: caughtError("entering weight", error, 99),
        },
      };
    }
  };

  handleWasherReceived = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put("/api/driver/setWasherDelivered", {
        orderID,
      });

      return response;
    } catch (error) {
      showConsoleError("setting order as received by washer", error);
      return {
        data: {
          success: false,
          message: caughtError(
            "setting order as received by washer",
            error,
            99
          ),
        },
      };
    }
  };

  handleUserReceived = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put("/api/driver/setUserDelivered", {
        orderID,
      });

      return response;
    } catch (error) {
      showConsoleError("setting order as delivered", error);
      return {
        data: {
          success: false,
          message: caughtError("setting order as delivered", error, 99),
        },
      };
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
            paddingTop: 8,
            backgroundColor: "#01C9E1",
          }}
        >
          <Grid item>
            <Typography
              variant="h1"
              className={classes.componentName}
              gutterBottom
            >
              Accepted Orders
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
              orders={this.state.orders}
              fetchOrders={this.fetchOrders}
              weight={this.state.weight}
              weightError={this.state.weightError}
              weightErrorMsg={this.state.weightErrorMsg}
              handleWeightChange={this.handleWeightChange}
              validateWeightMinimum={this.validateWeightMinimum}
              handleChargeCustomer={this.handleChargeCustomer}
              handleClearWeightError={this.handleClearWeightError}
              handleUpdateWeight={this.handleUpdateWeight}
              handleWasherReceived={this.handleWasherReceived}
              handleUserReceived={this.handleUserReceived}
            />
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

AcceptedDashboard.propTypes = {
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

  //fetch their assigned orders via user id
  const response_two = await fetchOrders_DAC_SSR(context, currentUser);

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
  withStyles(acceptedStyles)
)(AcceptedDashboard);
