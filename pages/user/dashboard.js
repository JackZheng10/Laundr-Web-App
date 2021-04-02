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
  Tabs,
  Tab
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
import { getCurrentUser } from "../../src/helpers/session";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import {
  getExistingOrder_SSR,
  getCurrentUser_SSR,
  getExistingLaundrDay_SSR
} from "../../src/helpers/ssr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import NewOrder from "../../src/components/User/Dashboard/NewOrder/NewOrder";
import LaundrDay from "../../src/components/User/Dashboard/LaundrDayOrder/LaundrDay";
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

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("../../src/config").baseURL;

class Dashboard extends Component {
  static contextType = MainAppContext;

  state = {
    orderComponent: null,
    orderComponentName: "",
    userFname: "",
    orderTabState: "New Order"
  };

  componentDidMount = async () => {
    const { fetch_SSR } = this.props;

    //check for error on fetching initial info via SSR. if this has appeared, nothing will render for the order component so its ok
    if (!fetch_SSR.success) {
      this.context.showAlert(fetch_SSR.message);
    }
  };

  //to refresh order info, just reload the page
  fetchOrderInfo = () => {
    window.location.reload();
  };

  renderOrderComponent = (classes) => {
    const { fetch_SSR } = this.props;

    if (!fetch_SSR.success) {
      return <div></div>;
    }

    if (this.state.orderTabState == "New Order") {
      switch (fetch_SSR.orderInfo.componentName) {
        case "set_payment":
          return (
            <Card className={classes.infoCard} elevation={10}>
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
                <Typography variant="body1">
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
              currentUser={fetch_SSR.userInfo}
              balance={fetch_SSR.balance}
            />
          );
      
        case "order_status":
          return (
            <OrderStatus
              order={fetch_SSR.orderInfo.message}
              currentUser={fetch_SSR.userInfo}
              fetchOrderInfo={this.fetchOrderInfo}
            />
          );
      }
    }
    else if (this.state.orderTabState == "Laundr Day")  {
      switch (fetch_SSR.laundrDayInfo.componentName) {
        case "new_laundr_day":
          return (
            <LaundrDay
              fetchOrderInfo={this.fetchOrderInfo}
              currentUser={fetch_SSR.userInfo}
              balance={fetch_SSR.balance}
            />
          );  

        case "laundr_day_status":
          return (
            <NewOrder
              fetchOrderInfo={this.fetchOrderInfo}
              currentUser={fetch_SSR.userInfo}
              balance={fetch_SSR.balance}
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
        if (this.state.orderTabState == "New Order") {
          return "New Order";
        }
        else if (this.state.orderTabState == "Laundr Day") {
          return "Laundr Day";
        }
       
      case "order_status":
        return "Order Status";

      default:
        return "";
    }
  };

  handleTabChange = (event, value) => {
    this.setState({ orderTabState: value });
  };

  render() {
    const { classes, fetch_SSR } = this.props;

    return (
      <Layout currentUser={fetch_SSR.success ? fetch_SSR.userInfo : null}>
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
                {`Welcome, ${
                  fetch_SSR.success ? fetch_SSR.userInfo.fname : ""
                }`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Typography
              variant="h1"
              className={classes.orderComponentName}
              gutterBottom
            >
              {this.renderOrderComponentName(
                fetch_SSR.success ? fetch_SSR.orderInfo.componentName : ""
              )}
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
          // style={{ backgroundImage: `url("/images/space.png")` }}
        >
            <Tabs
              value={this.state.orderTabState}
              onChange={this.handleTabChange}
            >
              <Tab value={"New Order"} label="New Order" />
              <Tab value={"Laundr Day"} label="Laundr Day" />
            </Tabs>
          <Grid item>{this.renderOrderComponent(classes)}</Grid>
        </Grid>
        {/* <div style={{ position: "relative", marginTop: 50 }}>
          <TopBorderBlue />
        </div> */}
        {/* </Grid> */}
        {/* <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" 
          style={{ backgroundColor: "#01C9E1" }}
        >
          <Grid item>
            <Typography variant="h1" className={classes.carouselTitle}>
              Check these out!
            </Typography>
          </Grid>
          <Grid item>
            <div className={classes.layout}>
              <div id="carouselContainer">
                <AutoRotatingCarousel
                  open={true}
                  autoplay={true}
                  mobile={false}
                  interval={6000}
                  style={{ position: "absolute" }}
                >
                  <Slide
                    media={
                      <img
                        src="/images/UserDashboard/LaundrBombs_New.png"
                        alt="Laundr Bombs"
                      />
                    }
                    mediaBackgroundStyle={{ backgroundColor: "#DC3825" }}
                    style={{ backgroundColor: "#A2261D" }}
                    title="Try our new Laundr Bombs"
                    subtitle="Freshen up your laundry with specialized scents!"
                    buttonText="Learn more"
                    buttonLink="https://www.laundr.io/laundr-bombs/"
                  />
                  <Slide
                    media={
                      <img
                        src="/images/UserDashboard/StudentPlanLogo.png"
                        alt="Student Subscriptions"
                      />
                    }
                    mediaBackgroundStyle={{ backgroundColor: "#2F92EA" }}
                    style={{ backgroundColor: "#0E62AE" }}
                    title="Student Subscriptions now available"
                    subtitle="If you're a student, you can get a discount on a Laundr subscription!"
                    buttonText="Learn more"
                    buttonLink="https://www.laundr.io/"
                  />
                  <Slide
                    media={
                      <img
                        src="/images/UserDashboard/InstagramLogo.png"
                        alt="Instagram"
                      />
                    }
                    mediaBackgroundStyle={{ backgroundColor: "#C560D2" }}
                    style={{ backgroundColor: "#8D2B9A" }}
                    title="Check us out on Instagram"
                    subtitle="Visit our Instagram for the latest updates and chances for free stuff!"
                    buttonText="Go"
                    buttonLink="https://www.instagram.com/laundrofficial/"
                  />
                  <Slide
                    media={
                      <img
                        src="/images/UserDashboard/SupportLogo.png"
                        alt="Customer Support"
                      />
                    }
                    mediaBackgroundStyle={{ backgroundColor: "#817A7A" }}
                    style={{ backgroundColor: "#695F5F" }}
                    title="Need help?"
                    subtitle="Feel free to call us at 352-363-5211 or click below to chat with a representative!"
                    buttonText="Go"
                    buttonLink="https://www.messenger.com/t/laundrofficial"
                  />
                </AutoRotatingCarousel>
              </div>
            </div>
          </Grid>
        </Grid> */}
        {/* <div style={{ position: "relative", marginBottom: 50 }}>
          <BottomBorderBlue />
        </div> */}
      </Layout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export async function getServerSideProps(context) {
  //fetch current user
  const response_one = await getCurrentUser_SSR(context, { balance: true });

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
    case "user":
      if (currentUser.isDriver || currentUser.isWasher || currentUser.isAdmin) {
        return {
          redirect: {
            destination: "/accessDenied",
            permanent: false,
          },
        };
      }
      break;

    case "washer":
      if (!currentUser.isWasher) {
        return {
          redirect: {
            destination: "/accessDenied",
            permanent: false,
          },
        };
      }
      break;

    case "driver":
      if (!currentUser.isDriver) {
        return {
          redirect: {
            destination: "/accessDenied",
            permanent: false,
          },
        };
      }
      break;

    case "admin":
      if (!currentUser.isAdmin) {
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

  //fetch their current order via their userID
  const response_two = await getExistingOrder_SSR(context, currentUser);

  //check for error in fetching current order info (or info for no order) or need for redirect due to invalid session
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

  //fetch current Laundr Day info via userID
  const response_three = await getExistingLaundrDay_SSR(context, currentUser);
  if (!response_three.data.success) {
    if (response_three.data.redirect) {
      return {
        redirect: {
          destination: response_three.data.message,
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          fetch_SSR: {
            success: false,
            message: response_three.data.message,
          },
        },
      };
    }
  }

  // const newCookie = response_one.headers["set-cookie"];

  // console.log("COOKIE: ", newCookie);
  // context.res.setHeader("Set-Cookie", newCookie);

  //finally, return info for fetched user + order info + laundrDayInfo, available via props
  return {
    props: {
      fetch_SSR: {
        success: true,
        orderInfo: response_two.data,
        userInfo: currentUser,
        balance: response_one.data.balance,
        laundrDayInfo: response_three.data
      },
    },
  };
}

export default compose(withRouter, withStyles(dashboardStyles))(Dashboard);
