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
    await this.fetchOrders();
  };

  fetchOrders = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await axios.post("/api/order/fetchOrders", {
        filter: "washerAssigned",
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
              orders={this.state.orders}
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

export default withStyles(assignedStyles)(AssignedDashboard);
