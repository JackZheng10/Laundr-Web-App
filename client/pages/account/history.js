import React, { Component } from "react";
import {
  withStyles,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
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
import baseURL from "../../src/baseURL";
import historyStyles from "../../src/styles/User/Account/historyStyles";

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled

class History extends Component {
  static contextType = MainAppContext;

  state = { orders: [] };

  // componentDidMount = async () => {
  //   await this.fetchOrders();
  // };

  fetchOrders = async () => {
    //todo: figure out better way for filtering
    try {
      const currentUser = getCurrentUser();
      const response = await axios.post(baseURL + "/order/fetchOrders", {
        statuses: [7, 8],
        filter: true,
        filterConfig: "orderHistory",
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
        <div style={{ position: "relative", marginBottom: 50 }}>
          <BottomBorderBlue />
        </div>
        <Grid container direction="column" justify="center" alignItems="center">
          <h1>either include weight OR price, pick</h1>
          <Grid
            item
            style={{ width: "100%", paddingLeft: 10, paddingRight: 10 }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" className={classes.tableHeader}>
                      ID
                    </TableCell>
                    <TableCell align="left" className={classes.tableHeader}>
                      Date/Time
                    </TableCell>
                    <TableCell align="left" className={classes.tableHeader}>
                      Address
                    </TableCell>
                    <TableCell align="left" className={classes.tableHeader}>
                      Instructions
                    </TableCell>
                    <TableCell align="left" className={classes.tableHeader}>
                      Load Size
                    </TableCell>
                    <TableCell align="left" className={classes.tableHeader}>
                      Price
                    </TableCell>
                    <TableCell align="left" className={classes.tableHeader}>
                      Coupon
                    </TableCell>
                    <TableCell align="left" className={classes.tableHeader}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody></TableBody>
              </Table>
            </TableContainer>
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
