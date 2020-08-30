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

  state = {
    orders: [],
    weight: "",
    weightError: false,
    weightErrorMsg: "",
  };

  componentDidMount = async () => {
    await this.fetchOrders();
  };

  fetchOrders = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await axios.post("/api/order/fetchOrders", {
        filter: "driverAccepted",
        filterEmail: currentUser.email,
      });

      if (response.data.success) {
        this.setState({ orders: response.data.message });
      } else {
        this.context.showAlert(response.data.message);
      }
    } catch (error) {
      showConsoleError("getting orders", error);
      this.context.showAlert(caughtError("fetching orders", error, 99));
    }
  };

  handleWeightChange = (weight) => {
    const regex = /^[0-9\b]+$/;

    if (weight === "" || regex.test(weight)) {
      this.setState({ weight: weight });
    }
  };

  handleWeightMinimum = () => {
    if (!this.state.weight.replace(/\s/g, "").length) {
      this.setState({
        weightError: true,
        weightErrorMsg: "Please enter a weight.",
      });

      return false;
    } else if (this.state.weight < 10) {
      this.setState({
        weightError: true,
        weightErrorMsg: "Minimum weight to be entered is 10 lbs.",
      });

      return false;
    } else {
      return true;
    }
  };

  handleClearWeightError = () => {
    this.setState({ weightError: false, weightErrorMsg: "" });
  };

  handleChargeCustomer = async (order) => {
    try {
      const email = order.userInfo.email;
      const orderID = order.orderInfo.orderID;

      const response = await axios.post("/api/stripe/chargeCustomer", {
        weight: this.state.weight,
        email: email,
        orderID: orderID,
      });

      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      showConsoleError("charging customer", error);
      return {
        success: false,
        message: caughtError("charging customer", error, 99),
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

      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      showConsoleError("entering weight", error);
      return {
        success: false,
        message: caughtError("entering weight", error, 99),
      };
    }
  };

  handleWasherReceived = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put("/api/driver/setWasherDelivered", {
        orderID,
      });

      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      showConsoleError("setting order as received by washer", error);
      return {
        success: false,
        message: caughtError("setting order as received by washer", error, 99),
      };
    }
  };

  handleUserReceived = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put("/api/driver/setUserDelivered", {
        orderID,
      });

      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      showConsoleError("setting order as delivered", error);
      return {
        success: false,
        message: caughtError("setting order as delivered", error, 99),
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
              handleWeightMinimum={this.handleWeightMinimum}
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

export default withStyles(acceptedStyles)(AcceptedDashboard);
