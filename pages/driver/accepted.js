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
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import { Layout } from "../../src/layouts";
import { GetServerSideProps } from "next";
import { withRouter } from "next/router";
import { GET_SWR, getFilterConfig, hasPageAccess } from "../../src/helpers/swr";
import useSWR from "swr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import validator from "validator";
import axios from "../../src/helpers/axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import OrderTable from "../../src/components/Driver/OrderTable/OrderTable";
import acceptedStyles from "../../src/styles/Driver/Accepted/acceptedStyles";

//only display status 1 (need to enter weight), 2: (mark dropped to washer), 5: (mark delivered to user)

class AcceptedDashboard extends Component {
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
      weight: "",
      weightErrorMsg: "",
    };
  }

  fetchPage = async (page, limit) => {
    try {
      const response = await axios.get(`/api/order/fetchOrders`, {
        params: {
          filter: "driverAccepted",
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
          filter: "driverAccepted",
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

  handleWeightChange = (weight) => {
    const regex = /^\d*\.?\d*$/;

    if (!validator.contains(weight, " ") && regex.test(weight)) {
      this.setState({ weight: weight });
    }
  };

  validateWeightMinimum = () => {
    const weight = this.state.weight;

    if (validator.contains(weight, " ") || this.state.weight < 10) {
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

  handleWeighOrder = async (order) => {
    try {
      const userID = order.userInfo.userID;
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(
        "/api/stripe/weighOrder",
        {
          weight: this.state.weight,
          userID: userID,
          orderID: orderID,
        },
        { withCredentials: true }
      );

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

  handleWasherReceived = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(
        "/api/driver/setWasherDelivered",
        {
          orderID,
        },
        { withCredentials: true }
      );

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
      const userID = order.userInfo.userID;

      const response = await axios.put(
        "/api/driver/setUserDelivered",
        {
          orderID,
          userID,
        },
        { withCredentials: true }
      );

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

  handleSendOnTheWayMsg = async (order, type) => {
    try {
      const response = await axios.post(
        "/api/twilio/sendOnMyWayMsg",
        {
          order: order,
          type: type,
        },
        { withCredentials: true }
      );

      return response;
    } catch (error) {
      showConsoleError("sending on the way text", error);
      return {
        data: {
          success: false,
          message: caughtError("sending on the way text", error, 99),
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
              handleWeighOrder={this.handleWeighOrder}
              handleClearWeightError={this.handleClearWeightError}
              handleWasherReceived={this.handleWasherReceived}
              handleUserReceived={this.handleUserReceived}
              handleSendOnTheWayMsg={this.handleSendOnTheWayMsg}
              refreshPage={this.refreshPage}
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
                You have no accepted orders.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

AcceptedDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const AcceptedCSR = (props) => {
  const acceptedEligibility = (response_one) => {
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
    acceptedEligibility(response_one)
      ? [acceptedEligibility(response_one), params_two]
      : null,
    GET_SWR
  );

  if (error_one || error_two)
    return (
      <ErrorPage text={error_one ? error_one.message : error_two.message} />
    );

  if (!response_one || (!response_two && acceptedEligibility(response_one)))
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
    <AcceptedDashboard
      currentUser={currentUser}
      orders={response_two.data.message.orders}
      paginationInfo={response_two.data.message}
      {...props}
    />
  );
};

export default compose(withRouter, withStyles(acceptedStyles))(AcceptedCSR);
