import React, { Component } from "react";
import {
  Grid,
  withStyles,
  Paper,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import { Layout } from "../../src/layouts";
import {
  TopBorderDarkPurple,
  BottomBorderDarkPurple,
  TopBorderLightPurple,
  TopBorderBlue,
  BottomBorderBlue,
} from "../../src/utility/borders";
import { withRouter } from "next/router";
import { GetServerSideProps } from "next";
import {
  ErrorPage,
  ProgressPage,
  LoadingButton,
  PricingPopoverButton,
} from "../../src/components/other";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import { GET_SWR, getFilterConfig, hasPageAccess } from "../../src/helpers/swr";
import useSWR from "swr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "../../src/helpers/axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import NewOrder from "../../src/components/User/Dashboard/NewOrder/NewOrder";
import OrderStatus from "../../src/components/User/Dashboard/OrderStatus/OrderStatus";
import AutoRotatingCarousel from "../../src/components/User/Dashboard/Carousel/AutoRotatingCarousel";
import Slide from "../../src/components/User/Dashboard/Carousel/Slide";
import dashboardStyles from "../../src/styles/User/Dashboard/dashboardStyles";

//for order tables, left align the cells, not center

//fix MUI grid spacing causing negative margin (horizontal scrollbar), explicit spacing={0} or none? see GH issues.
//standardize space between title and waves on pages, also from top

//todo: implement admin stuff...later
//add error message to enable cookies

//todo: limit input length for text boxes! frontend and backend. also validation on backend as well.
//add "type" to textfields?
//Head component for pages w/SEO
//overhaul styling organization
//weirdness with the carousel
//center alert texts
//all requests should follow the redirect check (check newly made ones)
//add form (enter = submit) for other stuff
//redo register, login, forgot pwd, acc details, order notes validation (anywhere else that needs input like entering weight)
//make sure all routes with authentication also have authorization

class Dashboard extends Component {
  static contextType = MainAppContext;

  //to refresh order info, just reload the page
  fetchOrderInfo = () => {
    window.location.reload();
  };

  retryPayment = async (orderID, invoiceID) => {
    try {
      const response = await axios.put(
        "/api/stripe/retryPayment",
        {
          invoiceID,
          orderID,
        },
        { withCredentials: true }
      );

      if (!response.data.success) {
        if (response.data.redirect) {
          this.props.router.push(response.data.message);
        } else {
          this.context.showAlert(response.data.message);
        }
      } else {
        this.context.showAlert(response.data.message, () => {
          window.location.reload();
        });
      }
    } catch (error) {
      showConsoleError("retrying payment", error);
      this.context.showAlert(caughtError("retrying payment", error, 99));
    }
  };

  renderOrderComponent = (classes) => {
    const { componentName, order, balance, currentUser } = this.props;

    switch (componentName) {
      case "set_payment":
        return (
          <Card
            className={classes.infoCard}
            style={{ marginTop: 25 }}
            elevation={10}
          >
            <CardHeader
              title="Missing Payment Method"
              titleTypographyProps={{
                variant: "h4",
                style: {
                  color: "white",
                },
              }}
              className={classes.cardHeader}
            />
            <CardContent>
              <Typography variant="h6">
                Please add a payment method to continue.
              </Typography>
            </CardContent>
            <CardActions className={classes.cardFooter}>
              <Button
                size="medium"
                variant="contained"
                onClick={() => {
                  this.props.router.push("/account/details");
                }}
                className={classes.mainButton}
              >
                Add
              </Button>
            </CardActions>
          </Card>
        );

      case "new_order":
        return (
          <NewOrder
            fetchOrderInfo={this.fetchOrderInfo}
            currentUser={currentUser}
            balance={balance}
          />
        );

      case "order_status":
        if (order.orderInfo.status === 9) {
          return (
            <Card
              className={classes.infoCard}
              elevation={10}
              style={{ marginTop: 25 }}
            >
              <CardHeader
                title={`Order ID: #${order.orderInfo.orderID}`}
                titleTypographyProps={{
                  variant: "h4",
                  style: {
                    color: "white",
                  },
                }}
                className={classes.cardHeader}
              />
              <CardContent>
                <PricingPopoverButton
                  showPriceLabel={true}
                  order={order}
                  currentUser={currentUser}
                  containerStyles={{ marginBottom: 5 }}
                  labelStyles={{ fontWeight: 600 }}
                  priceVariant="h4"
                  labelVariant="h4"
                />
                <Typography variant="h6">
                  Your payment failed for this order. Please add a different
                  card if needed and retry using the button below to continue
                  using Laundr. If you need assistance, don't hesitate to
                  contact us.
                </Typography>
              </CardContent>
              <CardActions className={classes.cardFooter}>
                <LoadingButton
                  size="medium"
                  variant="contained"
                  onClick={() =>
                    this.retryPayment(
                      order.orderInfo.orderID,
                      order.orderInfo.invoiceID
                    )
                  }
                  className={classes.mainButton}
                >
                  Retry
                </LoadingButton>
              </CardActions>
            </Card>
          );
        } else {
          return (
            <OrderStatus
              order={order}
              currentUser={currentUser}
              fetchOrderInfo={this.fetchOrderInfo}
            />
          );
        }
    }
  };

  renderOrderComponentName = (componentName) => {
    switch (componentName) {
      case "set_payment":
        return "Missing Payment Method";

      case "new_order":
        return "New Order";

      case "order_status":
        return "Order Status";

      default:
        return "";
    }
  };

  render() {
    const { classes, currentUser, componentName, order } = this.props;

    return (
      <Layout currentUser={currentUser}>
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
          style={{ backgroundColor: "#01C9E1", paddingTop: 10 }}
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
              className={classes.orderComponentName}
              gutterBottom
            >
              {this.renderOrderComponentName(componentName)}
            </Typography>
          </Grid>
        </Grid>
        <div style={{ position: "relative", marginBottom: 50 }}>
          <BottomBorderBlue />
        </div>
        {/* </Grid> */}
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>{this.renderOrderComponent(classes)}</Grid>
        </Grid>
      </Layout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DashboardCSR = (props) => {
  const dashboardEligibility = (response_one) => {
    if (response_one) {
      if (response_one.data.message.email) {
        const currentUser = response_one.data.message;

        if (!hasPageAccess(currentUser, window)) return null;

        return "/api/order/getExistingOrder";
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

  const { data: response_two, error: error_two } = useSWR(
    dashboardEligibility(response_one)
      ? dashboardEligibility(response_one)
      : null,
    GET_SWR
  );

  if (error_one || error_two)
    return (
      <ErrorPage text={error_one ? error_one.message : error_two.message} />
    );

  if (!response_one || (!response_two && dashboardEligibility(response_one)))
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

  let componentName;
  let order = null;

  if (response_two.data.message === "N/A") {
    if (currentUser.stripe.regPaymentID === "N/A") {
      componentName = "set_payment";
    } else {
      componentName = "new_order";
    }
  } else {
    componentName = "order_status";
    order = response_two.data.message;
  }

  return (
    <Dashboard
      currentUser={currentUser}
      componentName={componentName}
      order={order}
      balance={response_one.data.balance}
      {...props}
    />
  );
};

export default compose(withRouter, withStyles(dashboardStyles))(DashboardCSR);
