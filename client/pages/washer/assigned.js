import React, { Component } from "react";
import {
  withStyles,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
  Paper,
} from "@material-ui/core";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import { Layout } from "../../src/layouts";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import OrderTable from "../../src/components/Washer/OrderTable/OrderTable";
import baseURL from "../../src/baseURL";
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
    await this.fetchOrders();
  };

  fetchOrders = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await axios.post(baseURL + "/order/fetchOrders", {
        statuses: [3],
        filter: true,
        filterConfig: "washerAssigned",
        filterEmail: currentUser.email,
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

  handleWasherDone = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(baseURL + "/washer/setWasherDone", {
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
    const { classes } = this.props;

    return (
      <Layout>
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
          style={{
            paddingTop: 8,
            backgroundColor: "#21d0e5",
          }}
        >
          <Grid item>
            <Paper elevation={3} className={classes.welcomeCard}>
              <Typography variant="h3" className={classes.welcomeText}>
                {`Welcome, ${this.state.userFname}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Typography variant="h1" className={classes.componentName}>
              Assigned Orders
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src="/images/UserDashboard/sectionBorder.png"
            style={{
              width: "100%",
              height: "100%",
              paddingTop: 8,
              paddingBottom: 15,
            }}
            alt="Section border"
          />
        </Grid>
        <OrderTable
          orders={this.state.orders}
          fetchOrders={this.fetchOrders}
          handleWasherDone={this.handleWasherDone}
        />
      </Layout>
    );
  }
}

AssignedDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(assignedStyles)(AssignedDashboard);
