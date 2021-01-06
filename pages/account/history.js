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
    const { fetch_SSR } = this.props;
    const paginationInfo = fetch_SSR.paginationInfo;
    const initialLimit = 10;
    const initialPage = 0; //MUI uses 0-indexed

    this.state = {
      orders: fetch_SSR.success ? fetch_SSR.orders : [],
      limit: initialLimit,
      page: initialPage,
      totalCount: paginationInfo.totalCount,
    };
  }

  componentDidMount = async () => {
    const { fetch_SSR } = this.props;

    if (!fetch_SSR.success) {
      this.context.showAlert(fetch_SSR.message);
    }
  };

  getFilterConfig = (currentUser) => {
    if (!currentUser) {
      return "none";
    } else if (currentUser.isDriver) {
      return "orderHistoryDriver";
    } else if (currentUser.isWasher) {
      return "orderHistoryWasher";
    } else {
      return "orderHistoryUser";
    }
  };

  fetchPage = async (page, limit, filter) => {
    try {
      const response = await axios.post(
        `/api/order/fetchOrders`,
        {
          filter: filter,
          limit: limit,
          page: page,
        },
        {
          withCredentials: true,
        }
      );

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
    const response = await this.fetchPage(
      newPage,
      this.state.limit,
      this.getFilterConfig(this.props.fetch_SSR.userInfo)
    );

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
    const response = await this.fetchPage(
      this.state.page,
      event.target.value,
      this.getFilterConfig(this.props.fetch_SSR.userInfo)
    );

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
    const { classes, fetch_SSR } = this.props;
    const { totalCount, limit, page } = this.state;

    return (
      <Layout currentUser={fetch_SSR.success ? fetch_SSR.userInfo : null}>
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
              config={this.getFilterConfig(
                fetch_SSR.success ? fetch_SSR.userInfo : null
              )}
              currentUser={fetch_SSR.success ? fetch_SSR.userInfo : null}
            />
            {fetch_SSR.success && (
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
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

History.propTypes = {
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
    case "account":
      if (currentUser.isAdmin) {
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

  //fetch possible orders, paginated for first page and an initial limit of 10
  const initialLimit = 10;
  const initialPage = 0;
  const response_two = await fetchOrderHistory_SSR(
    context,
    currentUser,
    initialLimit,
    initialPage
  );

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
        orders: response_two.data.message.orders,
        paginationInfo: response_two.data.message,
      },
    },
  };
}

export default compose(withRouter, withStyles(historyStyles))(History);
