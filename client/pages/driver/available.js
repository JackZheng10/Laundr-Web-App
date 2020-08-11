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
import { showConsoleError, caughtError } from "../../src/helpers/errors";
import { Layout } from "../../src/layouts";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import OrderTable from "../../src/components/Driver/OrderTable/OrderTable";
import baseURL from "../../src/baseURL";
import availableDashboardStyles from "../../src/styles/Driver/AvailableDashboard/availableDashboardStyles";

//todo: https://www.npmjs.com/package/react-infinite-scroll-component for orders and stuff
//also put inside of a scrollview type thing, or pad so table doesnt stretch all the way

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled

//only display status 0 and 4, ones able to be "accepted"

class AvailableDashboard extends Component {
  static contextType = MainAppContext;

  state = { orders: [], userFname: "" };

  componentDidMount = async () => {
    await this.fetchOrders();
  };

  //high level dialog for errors
  //todo: change to fetchorders for others too
  fetchOrders = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await axios.post(baseURL + "/order/fetchOrders", {
        statuses: [0, 4],
        filter: false,
      });

      if (response.data.success) {
        this.setState({
          orders: response.data.message,
          userFname: currentUser.fname,
        });
      } else {
        this.context.showAlert(response.data.message);
      }
    } catch (error) {
      showConsoleError("fetching orders", error);
      this.context.showAlert(caughtError("fetching orders", error, 99));
    }
  };

  //snackbar
  handlePickupAccept = async (order) => {
    try {
      const currentUser = getCurrentUser();
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(baseURL + "/driver/assignOrderPickup", {
        driverEmail: currentUser.email,
        orderID,
      });

      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      showConsoleError("accepting order", error);
      return {
        success: false,
        message: caughtError("accepting order", error, 99),
      };
    }
  };

  handleDropoffAccept = async (order) => {
    try {
      const currentUser = getCurrentUser();
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(baseURL + "/driver/assignOrderDropoff", {
        driverEmail: currentUser.email,
        orderID,
      });

      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      showConsoleError("accepting order for dropoff", error);
      return {
        success: false,
        message: caughtError("accepting order for dropoff", error, 99),
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
            <Paper elevation={3} className={classes.welcomeCard}>
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
            <Typography variant="h1" className={classes.componentName}>
              Available Orders
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
              handlePickupAccept={this.handlePickupAccept}
              handleDropoffAccept={this.handleDropoffAccept}
            />
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

AvailableDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(availableDashboardStyles)(AvailableDashboard);
