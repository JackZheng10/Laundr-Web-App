import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Typography,
  TablePagination,
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
  fetchOrderHistory_SSR,
} from "../../src/helpers/ssr";
import { GET_SWR, getFilterConfig, hasPageAccess } from "../../src/helpers/swr";
import useSWR from "swr";
import compose from "recompose/compose";
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

  fetchPage = async (page, limit, filter) => {
    try {
      const response = await axios.get(`/api/order/fetchOrders`, {
        params: {
          filter: filter,
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

  handleChangePage = async (event, newPage) => {
    this.context.showLoading();
    const response = await this.fetchPage(
      newPage,
      this.state.limit,
      getFilterConfig(this.props.currentUser, window)
    );
    this.context.hideLoading();

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
    this.context.showLoading();
    const response = await this.fetchPage(
      this.state.page,
      event.target.value,
      getFilterConfig(this.props.currentUser, window)
    );
    this.context.hideLoading();

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

  render() {
    const { classes, currentUser } = this.props;
    const { totalCount, limit, page } = this.state;

    return (
      <Layout currentUser={currentUser}>
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
              config={getFilterConfig(currentUser, window)}
              currentUser={currentUser}
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
                You have no completed orders.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

History.propTypes = {
  classes: PropTypes.object.isRequired,
};

const HistoryCSR = (props) => {
  const historyElibility = (response_one) => {
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

  const params_one = `{ "balance": true }`;
  const { data: response_one, error: error_one } = useSWR(
    ["/api/user/getCurrentUser", params_one],
    GET_SWR
  );

  const params_two = `{ "limit": 10, "page": 0 }`;
  const { data: response_two, error: error_two } = useSWR(
    historyElibility(response_one)
      ? [historyElibility(response_one), params_two]
      : null,
    GET_SWR
  );

  if (error_one || error_two)
    return <h1>{error_one ? error_one.message : error_two.message}</h1>;

  if (!response_one || (!response_two && historyElibility(response_one)))
    return <h1>loading... (placeholder)</h1>;

  const currentUser = response_one.data.message;

  if (!response_one.data.success) {
    props.router.push(response_one.data.message);
    return <h1>redirecting... (placeholder)</h1>;
  }

  if (!hasPageAccess(currentUser, window)) {
    props.router.push("/accessDenied");
    return <h1>redirecting... (placeholder)</h1>;
  }

  return (
    <History
      currentUser={currentUser}
      orders={response_two.data.message.orders}
      paginationInfo={response_two.data.message}
      {...props}
    />
  );
};

export default compose(withRouter, withStyles(historyStyles))(HistoryCSR);
