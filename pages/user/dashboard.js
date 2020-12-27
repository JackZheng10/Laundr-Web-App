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
import { getCurrentUser } from "../../src/helpers/session";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import {
  getExistingOrder_SSR,
  getCurrentUser_SSR,
} from "../../src/helpers/ssr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import NewOrder from "../../src/components/User/Dashboard/NewOrder/NewOrder";
import OrderStatus from "../../src/components/User/Dashboard/OrderStatus/OrderStatus";
import AutoRotatingCarousel from "../../src/components/User/Dashboard/Carousel/AutoRotatingCarousel";
import Slide from "../../src/components/User/Dashboard/Carousel/Slide";
import dashboardStyles from "../../src/styles/User/Dashboard/dashboardStyles";

//refactor priorities:
//!!!map multiple routes to single component
//-add loading...only to components that need to fetch data from the user? for example login doesnt have it and uses localstorage, but not while rendering i guess? whereas dashboard needs it to prevent localstorage error.
//^^ figure out, also use getstaticprops for fetching something like orders? keep loading until everything is fetched, so if theres an error the loading stays
//^^also, loading on only main pages (after logged in, before main component rendered aka sidebar and topbar are there tho)? or different loading for individual components/fullscreen (like from login)
//findOneAndUpdate where possible,
//const vs let
//backtick for variable + text stuff
//styling errors like: prefs not centering when small, review page bleeds when small, etc.
//get rid of xs={12} sm={6} stuff maybe (basically applies to cards and input fields), get rid of card variant="outlined", standard elevation
//standard typography sizes/color/boldness (default color is grey, prob located in theme somewhere) (maybe take a look at the order table card vs review cards vs order status card)...standardize cards
//standard btn sizes
//authorization for either pages/routes/both
//make sure loads show for driver, cost is updated when charged. show weight for washer?
//error when: drop both order collections, place new order, cancel? doesnt cancel? check
//configure: account, history, for washer/driver
//for order tables, left align the cells, not center
//sorting the orders by date in order history,

//method for loading: do all data fetching in main parent component, apply loading bool
//hold child components that rely on loaded data in state as null first, then change after gathered loaded data
//render this.state.childComponent

//-individual components (use helpers and loading component)
//-implement update token helper
//-fix places autocomplete on address
//-imports (use index.js) from root for images, styles, deep components, etc.
//-styles restructure folders and change file names, also restructure components folder
//fix MUI grid spacing causing negative margin (horizontal scrollbar), explicit spacing={0} or none? see GH issues.
//standardize space between title and waves on pages, also from top
//errors: caught (use showConsole and this.context.showAlert(caughtError(stuff))), res.data.success=false (use this.context.showalert(res.data.message))
//overhaul styles (destructure into components when available, remove unecessary styles, style structure like personal site)

//FLOW: close dialog before showing success/error of successful request to backend, keep it open if its a caught error on frontend
//make sure this is established for everything.

//todo: fix white line appearing when small mobile for border
//todo: implement admin stuff...later
//handle student subscription
//handle special cases for pricing
//add error message to enable cookies (and therefore localstorage) to laundr shi
//store token in cookies
//make it expire and stuff.
//todo: research efficient querying. look into usestaticquery
//todo: maybe move logout button since if on mobile hitting sidebar button is close
//todo: add isUser? maybe when im less lazy
//todo: stripe self-serve portal handles all the payment info stuff??
//todo: maybe just store their payment id, check if it exists every time a on-demand charge is made, use the id to modify method. sub is separate card?
//todo: sort out customer email thing (different: login vs stripe - can be changed with checkout session)
//todo: move moment to higher level package.json
//todo: add progress circle to buttons for submission actions? or reg loading
//pagination
//add order ID to driver available etc?
//remove class inlinetext
//mainbutton (yellow) for ordercards too
//standard sizes for stuff (text etc)
//move account into one folder (either top level or in user, atm theres two)
// /https://www.npmjs.com/package/react-infinite-scroll-component

//notes:
/*
-sometime use zapier with wordpress 
doing .add(something) changes the object itself with moment
*/

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("../../src/config").baseURL;

class Dashboard extends Component {
  static contextType = MainAppContext;

  state = {
    orderComponent: null,
    orderComponentName: "",
    userFname: "",
  };

  componentDidMount = async () => {
    const { fetch_SSR } = this.props;
    //check for error on fetching initial info via SSR. if this has appeared, nothing will render for the order component so its ok
    if (!fetch_SSR.success) {
      return this.context.showAlert(fetch_SSR.message);
    }

    //await this.fetchOrderInfo();
  };

  //to refresh order info
  fetchOrderInfo = () => {
    return 1;
  };

  renderOrderComponent = (fetch_SSR, classes) => {
    if (!fetch_SSR.success) {
      return <div></div>;
    }

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
            currentUser_ID={fetch_SSR.userInfo.userID}
          />
        );

      case "order_status":
        return (
          <OrderStatus
            order={fetch_SSR.orderInfo.message}
            fetchOrderInfo={this.fetchOrderInfo}
          />
        );
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
    const { classes, fetch_SSR } = this.props;

    return (
      <Layout>
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
                {`Welcome, ${fetch_SSR.userInfo.fname}`}
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
          <Grid item>{this.renderOrderComponent(fetch_SSR, classes)}</Grid>
        </Grid>
        <div style={{ position: "relative", marginTop: 50 }}>
          <TopBorderBlue />
        </div>
        {/* </Grid> */}
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
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
                        src="/images/UserDashboard/LaundrBombsLogo.png"
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
        </Grid>
        <div style={{ position: "relative", marginBottom: 50 }}>
          <BottomBorderBlue />
        </div>
      </Layout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export async function getServerSideProps(context) {
  //fetch current user
  const response_one = await getCurrentUser_SSR(context);

  //check for redirect needed due to invalid session or error in fetching
  if (!response_one.success) {
    if (response_one.redirect) {
      return {
        redirect: {
          destination: response_one.message,
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          fetch_SSR: {
            success: false,
            message: response_one.message,
          },
        },
      };
    }
  }

  //check for permissions to access page if no error from fetching user
  const currentUser = response_one.message;
  const urlSections = context.resolvedUrl.split("/");

  switch (urlSections[1]) {
    case "user":
      if (currentUser.isDriver || currentUser.isWasher || currentUser.isAdmin) {
        return {
          redirect: {
            destination: "/noAccess",
            permanent: false,
          },
        };
      }
      break;

    case "washer:":
      if (!currentUser.isWasher) {
        return {
          redirect: {
            destination: "/noAccess",
            permanent: false,
          },
        };
      }
      break;

    case "driver":
      if (!currentUser.isDriver) {
        return {
          redirect: {
            destination: "/noAccess",
            permanent: false,
          },
        };
      }
      break;

    case "admin":
      if (!currentUser.isAdmin) {
        return {
          redirect: {
            destination: "/noAccess",
            permanent: false,
          },
        };
      }
      break;
  }

  //everything ok, so current user is fetched (currentUser is valid)

  //user - dashboard: fetch their current order via their userID
  const response_two = await getExistingOrder_SSR(context, currentUser);

  //check for error in fetching current order info (or info for no order)
  if (!response_two.success) {
    return {
      props: {
        fetch_SSR: {
          success: false,
          message: response_two.message,
        },
      },
    };
  }

  //finally, return info for fetched user + order info
  return {
    props: {
      fetch_SSR: {
        success: true,
        orderInfo: response_two,
        userInfo: currentUser,
      },
    },
  };
}

export default compose(withRouter, withStyles(dashboardStyles))(Dashboard);
