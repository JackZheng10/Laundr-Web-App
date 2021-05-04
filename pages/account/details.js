import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardFooter,
  Divider,
  CardContent,
  CardActions,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Layout } from "../../src/layouts";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import { BottomBorderBlue } from "../../src/utility/borders";
import { GetServerSideProps } from "next";
import { withRouter } from "next/router";
import { limitLength } from "../../src/helpers/inputs";
import { GET_SWR } from "../../src/helpers/swr";
import { LoadingButton, TooltipButton } from "../../src/components/other";
import useSWR from "swr";
import compose from "recompose/compose";
import axios from "../../src/helpers/axios";
import validator from "validator";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import PropTypes from "prop-types";
import MainAppContext from "../../src/contexts/MainAppContext";
import AccountInfo from "../../src/components/Account/Details/AccountInfo";
import PaymentInfo from "../../src/components/Account/Details/PaymentInfo";
import detailsStyles from "../../src/styles/User/Account/detailsStyles";

//todo: need to show payment info to only some users? (not admins/drivers/washers?)
//be careful...<Link /> doesn't play well. when used on sidebar, caused clicking on this page to redirect sometimes
//^test clicking the help page on footer, might not even be the cause...play around with swr settings maybe the focus?

class Details extends Component {
  static contextType = MainAppContext;

  state = { code: "", codeError: false, codeErrorMsg: "" };

  handleInputChange = (property, value) => {
    if (!validator.contains(value, " ")) {
      value = limitLength(value, 15);
      this.setState({ code: value });
    }
  };

  handleInputValidation = () => {
    let valid = true;

    //whitespace checks
    if (validator.isEmpty(this.state.code)) {
      this.setState({
        codeErrorMsg: "*Please enter a code.",
        codeError: true,
      });
      valid = false;
    } else {
      this.setState({
        codeErrorMsg: "",
        codeError: false,
      });
    }

    return valid;
  };

  redeemCode = async () => {
    if (this.handleInputValidation()) {
      try {
        const response = await axios.post(
          "/api/stripe/redeemCoupon",
          {
            code: this.state.code,
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
        showConsoleError("redeeming code", error);
        this.context.showAlert(caughtError("redeeming code", error, 99));
      }
    }
  };

  render() {
    const { classes, currentUser, cardInfo, balance } = this.props;

    return (
      <Layout currentUser={currentUser}>
        <Grid
          container
          spacing={0}
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
              Account
            </Typography>
          </Grid>
        </Grid>
        <div style={{ position: "relative", marginBottom: 70 }}>
          <BottomBorderBlue />
        </div>
        <div style={{ padding: 8 }}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <AccountInfo user={currentUser} />
                </Grid>
                <Grid item>
                  <PaymentInfo user={currentUser} card={cardInfo} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Card
                    className={classes.root}
                    elevation={5}
                    // style={{ borderRadius: "25px" }}
                  >
                    <CardHeader
                      title="Credit"
                      titleTypographyProps={{
                        variant: "h4",
                        style: {
                          color: "white",
                          textAlign: "center",
                        },
                      }}
                      className={classes.cardHeader}
                    />
                    <CardContent className={classes.removePadding}>
                      <TextField
                        label="Referral/Coupon"
                        variant="outlined"
                        size="small"
                        className={classes.input}
                        value={this.state.code}
                        onChange={(event) => {
                          this.handleInputChange("code", event.target.value);
                        }}
                        style={{ marginRight: 10 }}
                        error={this.state.codeError}
                        helperText={this.state.codeErrorMsg}
                      />
                      <LoadingButton
                        className={classes.mainButton}
                        variant="contained"
                        size="medium"
                        onClick={this.redeemCode}
                      >
                        Apply
                      </LoadingButton>
                      <Grid container justify="center">
                        <Typography
                          variant="h4"
                          style={{ fontWeight: 600, marginTop: 10 }}
                        >
                          Current balance:&nbsp;
                        </Typography>
                        <Typography
                          variant="h4"
                          style={{ textAlign: "center", marginTop: 10 }}
                        >
                          {balance}
                        </Typography>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card
                    className={classes.root}
                    elevation={5}
                    // style={{ borderRadius: "25px" }}
                  >
                    <CardHeader
                      title="Referrals"
                      titleTypographyProps={{
                        variant: "h4",
                        style: {
                          color: "white",
                          textAlign: "center",
                        },
                      }}
                      className={classes.cardHeader}
                    />
                    <CardContent className={classes.removePadding}>
                      <TextField
                        InputProps={{
                          endAdornment: (
                            // <IconButton
                            //   size="small"
                            //   style={{ color: "#01c9e1" }}
                            // >
                            //   <FileCopyIcon />
                            // </IconButton>
                            <Button
                              style={{ marginLeft: -25, marginRight: -11 }}
                              size="small"
                              // variant="contained"
                              variant="filled"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  currentUser.referralCode
                                )
                              }
                            >
                              <Typography
                                variant="body1"
                                style={{
                                  color: "#01c9e1",
                                  fontWeight: "bold",
                                }}
                              >
                                Copy
                              </Typography>
                            </Button>
                          ),
                          readOnly: true,
                        }}
                        label="Your Code"
                        variant="outlined"
                        size="small"
                        className={classes.codeInput}
                        defaultValue={currentUser.referralCode}
                      />
                    </CardContent>
                    {/* <Divider /> */}
                    <CardActions
                      disableSpacing
                      style={{ justifyContent: "center", marginTop: -18 }}
                    >
                      <TooltipButton
                        icon={true}
                        text={
                          "Refer your friends! They get $10 off their first purchase and you get $10 after their first order. Code is redeemable at registration or on this page."
                        }
                      />
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Layout>
    );
  }
}

Details.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DetailsCSR = (props) => {
  const cardDetailsEligibility = (response_one) => {
    if (response_one) {
      if (response_one.data.message.email) {
        if (response_one.data.message.stripe.regPaymentID != "N/A") {
          return "/api/stripe/getCardDetails";
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  //all hooks need to be ran on every render

  //swr requires a "stable object", so passing in an actual object causes infinite renders
  const params_one = `{ "balance": true }`;
  const { data: response_one, error: error_one } = useSWR(
    ["/api/user/getCurrentUser", params_one],
    GET_SWR
  );

  //fetch card if user has one. wait until: response_one resolves, it returns a logged in user, that user has a payment id
  //if url passed to fetcher is null, swr knows to wait until it's not to start the request
  const { data: response_two, error: error_two } = useSWR(
    cardDetailsEligibility(response_one),
    GET_SWR
  );

  if (error_one || error_two)
    return <h1>{error_one ? error_one.message : error_two.message}</h1>;

  //second conditional takes into account if second req. should have even ran
  if (!response_one || (!response_two && cardDetailsEligibility(response_one)))
    return <h1>loading... (placeholder)</h1>;

  //all necessary data fetched, now use it

  //check for redirect needed due to invalid session, could only be the case if user not logged in (other false successes throw an error in useSWR)
  if (!response_one.data.success) {
    props.router.push(response_one.data.message);
    return <h1>redirecting... (placeholder)</h1>;
  }

  const currentUser = response_one.data.message;

  let cardInfo = {
    brand: "N/A",
    expMonth: "N/A",
    expYear: "N/A",
    lastFour: "N/A",
  };

  if (currentUser.stripe.regPaymentID != "N/A") {
    const card = response_two.data.message.card;

    cardInfo = {
      brand: card.brand.toUpperCase(),
      expMonth: card.exp_month,
      expYear: card.exp_year,
      lastFour: card.last4,
    };
  }

  return (
    <Details
      currentUser={currentUser}
      cardInfo={cardInfo}
      balance={response_one.data.balance}
      {...props}
    />
  );
};

export default compose(withRouter, withStyles(detailsStyles))(DetailsCSR);
