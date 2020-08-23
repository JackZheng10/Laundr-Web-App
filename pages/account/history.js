import React, { Component } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
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
import OrderTable from "../../src/components/Account/History/OrderTable/OrderTable";
import historyStyles from "../../src/styles/User/Account/historyStyles";

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled

//configure for user, driver, washer
//driver first
//since this depends on current user, in ordercell and order card, render null until config passed in isnt "none"
//todo: configure loading...make sure it makes sense
//todo: test thoroughly

class History extends Component {
  static contextType = MainAppContext;

  state = { currentUser: null, orders: [] };

  componentDidMount = async () => {
    await this.fetchOrders();
  };

  fetchOrders = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await axios.post("/api/order/fetchOrders", {
        filter: this.getFilterConfig(currentUser),
        filterEmail: currentUser.email,
      });

      if (response.data.success) {
        this.setState({
          orders: response.data.message,
          currentUser: currentUser,
        });
      } else {
        this.context.showAlert(response.data.message);
      }
    } catch (error) {
      showConsoleError("getting orders", error);
      this.context.showAlert(caughtError("fetching orders", error, 99));
    }
  };

  //null check for the table rendered, not the backend req
  getFilterConfig = (user) => {
    if (!user) {
      return "none";
    } else if (user.isDriver) {
      return "orderHistoryDriver";
    } else if (user.isWasher) {
      return "orderHistoryWasher";
    } else {
      return "orderHistoryUser";
    }
  };

  render() {
    const { classes } = this.props;

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
              Order History
            </Typography>
          </Grid>
        </Grid>
        <div style={{ position: "relative", marginBottom: 70 }}>
          <BottomBorderBlue />
        </div>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid
            item
            style={{ width: "100%", paddingLeft: 10, paddingRight: 10 }}
          >
            <OrderTable
              orders={this.state.orders}
              config={this.getFilterConfig(this.state.currentUser)}
            />
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

History.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(historyStyles)(History);
