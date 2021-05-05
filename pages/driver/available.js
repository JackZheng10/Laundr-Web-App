import React, { Component } from "react";
import {
  withStyles,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
  Paper,
  TablePagination,
} from "@material-ui/core";
import {
  TopBorderDarkPurple,
  BottomBorderDarkPurple,
  TopBorderLightPurple,
  TopBorderBlue,
  BottomBorderBlue,
} from "../../src/utility/borders";
import { ErrorPage, ProgressPage } from "../../src/components/other";
import { showConsoleError, caughtError } from "../../src/helpers/errors";
import { Layout } from "../../src/layouts";
import { GetServerSideProps } from "next";
import { withRouter } from "next/router";
import { GET_SWR, getFilterConfig, hasPageAccess } from "../../src/helpers/swr";
import useSWR from "swr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "../../src/helpers/axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import OrderTable from "../../src/components/Driver/OrderTable/OrderTable";
import availableStyles from "../../src/styles/Driver/Available/availableStyles";

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

  constructor(props) {
    super(props);

    //handle pagination
    const { paginationInfo } = this.props;
    const initialLimit = 10;
    const initialPage = 0; //MUI uses 0-indexed

    this.state = {
      orders: this.props.orders,
      limit: initialLimit,
      page: initialPage,
      totalCount: paginationInfo.totalCount,
    };
  }

  fetchPage = async (page, limit) => {
    try {
      const response = await axios.get(`/api/order/fetchOrders`, {
        params: {
          filter: "none",
          limit: limit,
          page: page,
        },
        withCredentials: true,
      });

      return response;
    } catch (error) {
      showConsoleError("fetching orders", error);
      return {
        data: {
          success: false,
          message: caughtError("fetching orders", error, 99),
        },
      };
    }
  };

  refreshPage = async (page, limit) => {
    try {
      const response = await axios.get(`/api/order/fetchOrders`, {
        params: {
          filter: "none",
          limit: limit,
          page: page,
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        if (response.data.redirect) {
          this.props.router.push(response.data.message);
        } else {
          this.context.showAlert(response.data.message);
        }
      } else {
        this.setState({
          orders: response.data.message.orders,
          totalCount: response.data.message.totalCount,
        });
      }
    } catch (error) {
      showConsoleError("fetching orders", error);
      return {
        data: {
          success: false,
          message: caughtError("fetching orders", error, 99),
        },
      };
    }
  };

  handleChangePage = async (event, newPage) => {
    const response = await this.fetchPage(newPage, this.state.limit);

    if (!response.data.success) {
      if (response.data.redirect) {
        this.props.router.push(response.data.message);
      } else {
        this.context.showAlert(response.data.message);
      }
    } else {
      this.setState({
        orders: response.data.message.orders,
        totalCount: response.data.message.totalCount,
        page: newPage,
      });
    }
  };

  handleChangeRowsPerPage = async (event) => {
    const response = await this.fetchPage(this.state.page, event.target.value);

    if (!response.data.success) {
      if (response.data.redirect) {
        this.props.router.push(response.data.message);
      } else {
        this.context.showAlert(response.data.message);
      }
    } else {
      this.setState({
        orders: response.data.message.orders,
        totalCount: response.data.message.totalCount,
        limit: event.target.value,
      });
    }
  };

  handlePickupAccept = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(
        "/api/driver/assignOrderPickup",
        {
          orderID,
        },
        { withCredentials: true }
      );

      return response;
    } catch (error) {
      showConsoleError("accepting order", error);
      return {
        data: {
          success: false,
          message: caughtError("accepting order", error, 99),
        },
      };
    }
  };

  handleDropoffAccept = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(
        "/api/driver/assignOrderDropoff",
        {
          orderID,
        },
        { withCredentials: true }
      );

      return response;
    } catch (error) {
      showConsoleError("accepting order for dropoff", error);
      return {
        data: {
          success: false,
          message: caughtError("accepting order for dropoff", error, 99),
        },
      };
    }
  };

  render() {
    const { classes, currentUser } = this.props;
    const { totalCount, limit, page } = this.state;

    return (
      <Layout currentUser={currentUser}>
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
                {`Welcome, ${currentUser.fname}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Typography
              variant="h1"
              className={classes.componentName}
              gutterBottom
            >
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
              refreshPage={this.refreshPage}
              handlePickupAccept={this.handlePickupAccept}
              handleDropoffAccept={this.handleDropoffAccept}
              limit={this.state.limit}
              page={this.state.page}
            />
            {totalCount > 0 && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={limit}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            )}
            {totalCount <= 0 && (
              <Typography
                style={{
                  textAlign: "center",
                  color: "#01c9e1",
                  paddingTop: 15,
                }}
                variant="h2"
              >
                There are no available orders.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

AvailableDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const AvailableCSR = (props) => {
  const availableEligibility = (response_one) => {
    if (response_one) {
      if (response_one.data.message.email) {
        const currentUser = response_one.data.message;

        if (!hasPageAccess(currentUser, window)) return null;

        return (
          "/api/order/fetchOrders?filter=" +
          getFilterConfig(currentUser, window)
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const { data: response_one, error: error_one } = useSWR(
    "/api/user/getCurrentUser",
    GET_SWR
  );

  const params_two = `{ "limit": 10, "page": 0 }`;
  const { data: response_two, error: error_two } = useSWR(
    availableEligibility(response_one)
      ? [availableEligibility(response_one), params_two]
      : null,
    GET_SWR
  );

  if (error_one || error_two)
    return (
      <ErrorPage text={error_one ? error_one.message : error_two.message} />
    );

  if (!response_one || (!response_two && availableEligibility(response_one)))
    return <ProgressPage />;

  const currentUser = response_one.data.message;

  if (!response_one.data.success) {
    props.router.push(response_one.data.message);
    return <ProgressPage />;
  }

  if (!hasPageAccess(currentUser, window)) {
    props.router.push("/accessDenied");
    return <ProgressPage />;
  }

  return (
    <AvailableDashboard
      currentUser={currentUser}
      orders={response_two.data.message.orders}
      paginationInfo={response_two.data.message}
      {...props}
    />
  );
};

export default compose(withRouter, withStyles(availableStyles))(AvailableCSR);
