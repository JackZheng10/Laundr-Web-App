import React, { Component } from "react";
import { Grid, withStyles, Paper, Typography } from "@material-ui/core";
import { Layout } from "../../src/layouts";
import {
  TopBorderDarkPurple,
  BottomBorderDarkPurple,
  TopBorderLightPurple,
  TopBorderBlue,
  BottomBorderBlue,
} from "../../src/utility/borders";
import { getCurrentUser } from "../../src/helpers/session";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import baseURL from "../../src/baseURL";
import NewOrder from "../../src/components/User/Dashboard/components/NewOrder/NewOrder";
import OrderStatus from "../../src/components/User/Dashboard/components/OrderStatus/OrderStatus";
import AutoRotatingCarousel from "../../src/components/User/Dashboard/components/Carousel/AutoRotatingCarousel";
import Slide from "../../src/components/User/Dashboard/components/Carousel/Slide";
import dashboardStyles from "../../src/styles/User/Dashboard/dashboardStyles";

//refactor priorities:
//!!!map multiple routes to single component
//-add loading...only to components that need to fetch data from the user? for example login doesnt have it and uses localstorage, but not while rendering i guess? whereas dashboard needs it to prevent localstorage error.
//^^ figure out, also use getstaticprops for fetching something like orders? keep loading until everything is fetched, so if theres an error the loading stays
//^^also, loading on only main pages (after logged in, before main component rendered aka sidebar and topbar are there tho)? or different loading for individual components/fullscreen (like from login)
//findOneAndUpdate where possible,
//use cardheader for titles of various cards, color, etc.
//const vs let
//backtick for variable + text stuff
//styling errors like: prefs not centering when small, review page bleeds when small, etc.

//method for loading: do all data fetching in main parent component, apply loading bool
//hold child components that rely on loaded data in state as null first, then change after gathered loaded data
//render this.state.childComponent

//-individual components (use helpers and loading component)
//-implement update token helper
//-fix places autocomplete on address
//-imports (use index.js) from root for images, styles, deep components, etc.
//-styles restructure folders and change file names, also restructure components folder
//fix MUI grid spacing causing negative margin (horizontal scrollbar)
//errors: caught (use showConsole and this.context.showAlert(caughtError(stuff))), res.data.success=false (use this.context.showalert(res.data.message))

//FLOW: close dialog before showing success/error of successful request to backend, keep it open if its a caught error on frontend
//make sure this is established for everything.

//todo: fix white line appearing when small mobile
//todo: implement admin stuff...later
//handle student subscription
//todo: research efficient querying, maybe better to sort in the query rather than grab all orders?
//todo: maybe move logout button since if on mobile hitting sidebar button is close
//todo: add isUser? maybe when im less lazy
//todo: stripe self-serve portal handles all the payment info stuff??
//todo: maybe just store their payment id, check if it exists every time a on-demand charge is made, use the id to modify method. sub is separate card?
//todo: !!!cannot edit card #, so if user updates payment method then delete the old one and add the new one, also updating the user property id
//todo: 10lb minimum on orders - so if you send one sock you get charged 10 lbs. (add to new order notes)
//todo: sort out customer email thing (different: login vs stripe - can be changed with checkout session)
//todo: move moment to higher level package.json
//todo: add button styling to ALL dialogs
//todo: add progress circle to buttons for submission actions

//notes:
/*
-sometime use zapier with wordpress 
doing .add(something) changes the object itself with moment
*/

class Dashboard extends Component {
  static contextType = MainAppContext;

  state = {
    orderComponent: null,
    orderComponentName: "",
    userFname: "",
  };

  componentDidMount = async () => {
    await this.fetchOrderInfo();
  };

  fetchOrderInfo = async () => {
    try {
      const currentUser = getCurrentUser();

      const response = await axios.get(`${baseURL}/order/getExistingOrder`, {
        params: {
          email: currentUser.email,
        },
      });

      if (response.data.success) {
        let component;
        let componentName;

        if (response.data.message === "N/A") {
          component = <NewOrder fetchOrderInfo={this.fetchOrderInfo} />;
          componentName = "New Order";
        } else {
          component = (
            <OrderStatus
              order={response.data.message}
              fetchOrderInfo={this.fetchOrderInfo}
            />
          );
          componentName = "Order Status";
        }

        this.setState({
          orderComponent: component,
          orderComponentName: componentName,
          userFname: currentUser.fname,
        });
      } else {
        this.context.showAlert(response.data.message);
      }
    } catch (error) {
      showConsoleError("fetching order info", error);
      this.context.showAlert(caughtError("fetching order info", error, 99));
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
            backgroundImage: "linear-gradient(#4231fd, #0b0833)",
          }}
        >
          <Grid item>
            <Paper elevation={3} className={classes.welcomeCard}>
              <Typography
                variant="h3"
                className={classes.welcomeText}
                gutterBottom
              >
                {`Welcome, ${this.state.userFname}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Typography
              variant="h1"
              className={classes.orderComponentName}
              gutterBottom
            >
              {this.state.orderComponentName}
            </Typography>
          </Grid>
        </Grid>
        <div style={{ position: "relative", marginBottom: 50 }}>
          <BottomBorderDarkPurple />
        </div>
        {/* </Grid> */}
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>{this.state.orderComponent}</Grid>
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

export default withStyles(dashboardStyles)(Dashboard);
