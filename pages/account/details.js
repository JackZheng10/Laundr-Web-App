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
import {
  getCurrentUser_SSR,
  fetchCardDetails_SSR,
} from "../../src/helpers/ssr";
import { limitLength } from "../../src/helpers/inputs";
import compose from "recompose/compose";
import axios from "axios";
import validator from "validator";
import LoadingButton from "../../src/components/other/LoadingButton";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import TooltipButton from "../../src/components/Driver/OrderTable/components/TooltipButton";
import PropTypes from "prop-types";
import MainAppContext from "../../src/contexts/MainAppContext";
import AccountInfo from "../../src/components/Account/Details/AccountInfo";
import PaymentInfo from "../../src/components/Account/Details/PaymentInfo";
import detailsStyles from "../../src/styles/User/Account/detailsStyles";

//todo: need to show payment info to only some users? (not admins/drivers/washers?)

class Details extends Component {
  static contextType = MainAppContext;

  state = { code: "", codeError: false, codeErrorMsg: "" };

  componentDidMount = async () => {
    const { fetch_SSR } = this.props;

    if (!fetch_SSR.success) {
      this.context.showAlert(fetch_SSR.message);
    }
  };

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
    const { classes, fetch_SSR } = this.props;
    //const referralCodeArea = typeof window !== "unefined" ? React.createRef() : null;

    return (
      <Layout currentUser={fetch_SSR.success ? fetch_SSR.userInfo : null}>
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
                  {fetch_SSR.success ? (
                    <AccountInfo user={fetch_SSR.userInfo} />
                  ) : null}
                </Grid>
                <Grid item>
                  {fetch_SSR.success ? (
                    <PaymentInfo
                      user={fetch_SSR.userInfo}
                      card={fetch_SSR.cardInfo}
                    />
                  ) : null}
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
                  {fetch_SSR.success ? (
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
                            {fetch_SSR.balance}
                          </Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  ) : null}
                </Grid>
                <Grid item>
                  {fetch_SSR.success && (
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
                                    fetch_SSR.userInfo.referralCode
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
                          defaultValue={fetch_SSR.userInfo.referralCode}
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
                  )}
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

  //any user can access this page
  const currentUser = response_one.data.message;

  //fetch card if user has one
  let cardInfo;

  if (currentUser.stripe.regPaymentID != "N/A") {
    const response_two = await fetchCardDetails_SSR(context, currentUser);

    //check for error in fetching (***will throw an error if payment method ID is incorrect)
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
    } else {
      //if successful, return the correct card info
      const card = response_two.data.message.card;

      cardInfo = {
        brand: card.brand.toUpperCase(),
        expMonth: card.exp_month,
        expYear: card.exp_year,
        lastFour: card.last4,
      };
    }
  } else {
    //no card fetch needed? just return a default dummy card instead
    cardInfo = {
      brand: "N/A",
      expMonth: "N/A",
      expYear: "N/A",
      lastFour: "N/A",
    };
  }

  return {
    props: {
      fetch_SSR: {
        success: true,
        userInfo: currentUser,
        cardInfo: cardInfo,
        balance: response_one.data.balance,
      },
    },
  };
}

export default compose(withRouter, withStyles(detailsStyles))(Details);
