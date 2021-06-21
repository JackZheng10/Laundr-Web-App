import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  withStyles,
  Grid,
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Link as MUILink,
} from "@material-ui/core";
import { withRouter } from "next/router";
import { caughtError, showConsoleError } from "../src/helpers/errors";
import {
  LoadingButton,
  ProgressPage,
  ErrorPage,
} from "../src/components/other";
import { limitLength } from "../src/helpers/inputs";
import { GET_SWR } from "../src/helpers/swr";
import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import validator from "validator";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import MainAppContext from "../src/contexts/MainAppContext";
import registerStyles from "../src/styles/registerStyles";
import axios from "../src/helpers/axios";

class Register extends Component {
  static contextType = MainAppContext;

  state = {
    fname: "", //inputs
    lname: "",
    city: "Gainesville",
    email: "",
    password: "",
    phone: "",
    referral: "",
    tos: false, //error tracking
    fnameError: false,
    lnameError: false,
    emailError: false,
    passwordError: false,
    phoneError: false,
    tosError: false,
    fnameErrorMsg: "", //error messages
    lnameErrorMsg: "",
    emailErrorMsg: "",
    passwordErrorMsg: "",
    phoneErrorMsg: "",
    tosErrorMsg: "",
    enteredCode: "", //phone verification
    showVerifyDialog: false,
    referralError: false, //coupon/referral
    referralText: "*Optional",
  };

  handleSendVerification = async (event) => {
    event.preventDefault();

    if (await this.handleInputValidation()) {
      try {
        const response = await axios.post(
          "/api/user/checkDuplicate",
          {
            email: this.state.email.toLowerCase(),
            phone: this.state.phone,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          switch (response.data.message) {
            case 0:
              try {
                const response = await axios.post(
                  "/api/twilio/sendVerification",
                  {
                    to: this.state.phone,
                  },
                  { withCredentials: true }
                );

                if (response.data.success) {
                  this.toggleVerifyDialog();
                } else {
                  this.context.showAlert(response.data.message);
                }
              } catch (error) {
                showConsoleError("sending verification code", error);
                this.context.showAlert(
                  caughtError("sending verification code", error, 99)
                );
              }
              break;

            case 1:
              this.context.showAlert(
                "Email address is already in use. Please try again."
              );
              break;

            case 2:
              this.context.showAlert(
                "Phone number is already in use. Please try again."
              );
              break;

            case 3:
              this.context.showAlert(
                "Email address and phone number are already in use. Please try again."
              );
              break;
          }
        } else {
          this.context.showAlert(response.data.message);
        }
      } catch (error) {
        showConsoleError("checking for duplicate phone/email", error);
        this.context.showAlert(
          caughtError("checking for duplicate phone/email", error, 99)
        );
      }
    }
  };

  handleRegister = async () => {
    try {
      if (this.state.enteredCode.length < 4) {
        //since codes must be at least 4 long
        return this.context.showAlert(
          "Verification code is incorrect. Please try again."
        );
      }

      const response = await axios.post(
        "/api/user/register",
        {
          to: this.state.phone, //verification code stuff, to check along the way
          enteredCode: this.state.enteredCode,
          email: this.state.email.toLowerCase(),
          fname: this.state.fname,
          lname: this.state.lname,
          city: this.state.city,
          password: this.state.password,
          referral: this.state.referral,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        this.setState(
          {
            showVerifyDialog: false,
            enteredCode: "",
          },
          () => {
            this.context.showAlert(response.data.message, () => {
              this.props.router.push("/");
            });
          }
        );
      } else {
        this.context.showAlert(response.data.message);
      }
    } catch (error) {
      showConsoleError("registering", error);
      this.context.showAlert(caughtError("registering", error, 99));
    }
  };

  handleInputValidation = async () => {
    let valid = true;

    const inputs = [
      {
        name: "fname",
        whitespaceMsg: "*Please enter a first name.",
      },
      {
        name: "lname",
        whitespaceMsg: "*Please enter a last name.",
      },
      {
        name: "email",
        whitespaceMsg: "*Please enter a valid email.",
      },
      {
        name: "phone",
        whitespaceMsg: "*Please enter a 10-digit phone number.",
      },
      {
        name: "password",
        whitespaceMsg: "*Please enter a password.",
      },
    ];

    for (let input of inputs) {
      const value = this.state[input.name];

      //whitespace checks
      if (validator.isEmpty(value)) {
        this.setState({
          [input.name + "ErrorMsg"]: input.whitespaceMsg,
          [input.name + "Error"]: true,
        });
        valid = false;
        continue;
      } else {
        this.setState({
          [input.name + "ErrorMsg"]: "",
          [input.name + "Error"]: false,
        });
      }

      //input-specific checks
      switch (input.name) {
        case "email":
          if (!validator.isEmail(value)) {
            this.setState({
              [input.name + "ErrorMsg"]: "*Please enter a valid email.",
              [input.name + "Error"]: true,
            });
            valid = false;
          } else {
            this.setState({
              [input.name + "ErrorMsg"]: "",
              [input.name + "Error"]: false,
            });
          }
          break;

        case "password":
          if (value.length < 6 || !/[A-Z]+/.test(value)) {
            this.setState({
              [input.name + "ErrorMsg"]:
                "*Passwords must be at least 6 characters long and contain one capital letter.",
              [input.name + "Error"]: true,
            });
            valid = false;
          } else {
            this.setState({
              [input.name + "ErrorMsg"]: "",
              [input.name + "Error"]: false,
            });
          }
          break;

        case "phone":
          if (value.length < 10) {
            this.setState({
              [input.name + "ErrorMsg"]:
                "*Please enter a 10-digit phone number.",
              [input.name + "Error"]: true,
            });
            valid = false;
          } else {
            this.setState({
              [input.name + "ErrorMsg"]: "",
              [input.name + "Error"]: false,
            });
          }
          break;
      }
    }

    //tos check
    if (!this.state.tos) {
      valid = false;
      this.setState({
        tosErrorMsg: "*Please accept the Terms of Service.",
      });
    } else {
      this.setState({
        tosErrorMsg: "",
      });
    }

    //check for valid referral/coupon code
    if (!validator.isEmpty(this.state.referral)) {
      try {
        const response = await axios.get("/api/user/checkCode", {
          params: {
            code: this.state.referral,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          this.setState({ referralError: false, referralText: "*Optional" });
        } else {
          if (response.data.reason === "invalid") {
            this.setState({
              referralError: true,
              referralText: "*Please enter a valid code.",
            });
            valid = false;
          } else if (response.data.reason === "no_uses") {
            this.setState({
              referralError: true,
              referralText: "*Coupon has no uses left.",
            });
            valid = false;
          } else {
            this.context.showAlert(response.data.message);
            valid = false;
          }
        }
      } catch (error) {
        showConsoleError("verifying referral/coupon", error);
        this.context.showAlert(
          caughtError("verifying referral/coupon", error, 99)
        );
      }
    }

    return valid;
  };

  handleInputChange = (property, value) => {
    switch (property) {
      case "fname":
        if (validator.isAlpha(value) || value === "") {
          value = limitLength(value, 20);
          this.setState({ [property]: value });
        }
        break;

      case "lname":
        if (validator.isAlpha(value) || value === "") {
          value = limitLength(value, 20);
          this.setState({ [property]: value });
        }
        break;

      case "city":
        this.setState({ [property]: value });
        break;

      case "email":
        if (!validator.contains(value, " ")) {
          value = limitLength(value, 64);
          this.setState({ [property]: value });
        }
        break;

      case "password":
        if (!validator.contains(value, " ")) {
          value = limitLength(value, 64);
          this.setState({ [property]: value });
        }
        break;

      case "phone":
        if (validator.isNumeric(value) || value === "") {
          value = limitLength(value, 10);
          this.setState({ [property]: value });
        }
        break;

      case "referral":
        if (!validator.contains(value, " ")) {
          value = limitLength(value, 15);
          this.setState({ [property]: value });
        }
        break;

      case "tos":
        this.setState({ [property]: !this.state.tos });
        break;

      case "enteredCode":
        if (!validator.contains(value, " ")) {
          value = limitLength(value, 6);
          this.setState({ [property]: value });
        }
        break;
    }
  };

  handleResendCode = async () => {
    try {
      const response = await axios.post(
        "/api/twilio/sendVerification",
        {
          to: this.state.phone,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        this.context.showAlert("Verification code resent.");
      } else {
        this.context.showAlert(response.data.message);
      }
    } catch (error) {
      showConsoleError("sending verification code", error);
      this.context.showAlert(
        caughtError("sending verification code", error, 99)
      );
    }
  };

  toggleVerifyDialog = () => {
    this.setState({
      showVerifyDialog: !this.state.showVerifyDialog,
      enteredCode: "",
    });
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Head>
          {/* <meta
          name="description"
          content="Register for a Laundr account."
        /> */}
          {/* <link rel="canonical" href="" /> */}
        </Head>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.pageContainer}
        >
          <Dialog
            open={this.state.showVerifyDialog}
            onClose={this.toggleVerifyDialog}
            style={{ zIndex: 19 }}
          >
            <DialogTitle disableTypography>
              <Typography variant="h4" style={{ color: "#01c9e1" }}>
                Verification
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography
                variant="body1"
                style={{ textAlign: "center" }}
                gutterBottom
              >
                To finish registering, please enter the verification code we
                just sent to your phone. If you didn't receive a code, make sure
                your entered phone number is correct and sign up again.
              </Typography>
              <div style={{ textAlign: "center" }}>
                <TextField
                  variant="outlined"
                  label="Code"
                  size="small"
                  value={this.state.enteredCode}
                  onChange={(event) => {
                    this.handleInputChange("enteredCode", event.target.value);
                  }}
                  className={classes.input}
                  style={{ width: 100 }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <LoadingButton
                  onClick={this.handleResendCode}
                  variant="contained"
                  className={classes.secondaryButton}
                  timer={true}
                  time={60}
                >
                  Resend
                </LoadingButton>
              </div>
            </DialogContent>
            <DialogActions>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    onClick={this.toggleVerifyDialog}
                    variant="contained"
                    className={classes.secondaryButton}
                    style={{ marginRight: 10 }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <LoadingButton
                    onClick={this.handleRegister}
                    variant="contained"
                    className={classes.mainButton}
                  >
                    Submit
                  </LoadingButton>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
          <Grid item style={{ maxHeight: "100%" }}>
            <div className={classes.layout}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <img
                    alt="Company Logo"
                    src="/images/LogRegLogo.png"
                    //src="/images/Topbar/LaundrLogo_Blue.png"
                    className={classes.logo}
                  />
                </Grid>
                {/* <Card>
                  <CardContent> */}
                <Grid item>
                  <Typography
                    variant="h1"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                      padding: 10,
                      fontSize: 45,
                      // textDecorationLine: "underline",
                      // textUnderlineOffset: 10,
                      // textDecorationColor: "#FFB600",
                    }}
                  >
                    Register
                  </Typography>
                </Grid>
                <Grid item>
                  <form>
                    <Grid container justify="center">
                      <Grid item xs={6} sm={6} style={{ paddingRight: 10 }}>
                        <TextField
                          variant="filled"
                          margin="normal"
                          fullWidth
                          label="First Name"
                          autoComplete="given-name"
                          error={this.state.fnameError}
                          helperText={this.state.fnameErrorMsg}
                          value={this.state.fname}
                          onChange={(event) => {
                            this.handleInputChange("fname", event.target.value);
                          }}
                          classes={{ root: classes.coloredField }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ paddingLeft: 10 }}>
                        <TextField
                          variant="filled"
                          margin="normal"
                          fullWidth
                          label="Last Name"
                          autoComplete="family-name"
                          error={this.state.lnameError}
                          helperText={this.state.lnameErrorMsg}
                          value={this.state.lname}
                          onChange={(event) => {
                            this.handleInputChange("lname", event.target.value);
                          }}
                          classes={{ root: classes.coloredField }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          variant="filled"
                          margin="normal"
                          classes={{ root: classes.coloredField }}
                        >
                          <InputLabel>City</InputLabel>
                          <Select
                            native
                            label="City"
                            value={this.state.city}
                            onChange={(event) => {
                              this.handleInputChange(
                                "city",
                                event.target.value
                              );
                            }}
                          >
                            <option>Gainesville</option>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="filled"
                          margin="normal"
                          fullWidth
                          label="Email Address"
                          autoComplete="email"
                          error={this.state.emailError}
                          helperText={this.state.emailErrorMsg}
                          value={this.state.email}
                          onChange={(event) => {
                            this.handleInputChange("email", event.target.value);
                          }}
                          classes={{ root: classes.coloredField }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="filled"
                          margin="normal"
                          fullWidth
                          label="Password"
                          type="password"
                          autoComplete="new-password"
                          error={this.state.passwordError}
                          value={this.state.password}
                          helperText={this.state.passwordErrorMsg}
                          onChange={(event) => {
                            this.handleInputChange(
                              "password",
                              event.target.value
                            );
                          }}
                          classes={{ root: classes.coloredField }}
                        />
                      </Grid>
                      <Grid item xs={7} sm={7} style={{ paddingRight: 10 }}>
                        <TextField
                          variant="filled"
                          margin="normal"
                          fullWidth
                          label="Phone Number"
                          autoComplete="tel-national"
                          error={this.state.phoneError}
                          helperText={this.state.phoneErrorMsg}
                          value={this.state.phone}
                          onChange={(event) => {
                            this.handleInputChange("phone", event.target.value);
                          }}
                          classes={{ root: classes.coloredField }}
                        />
                      </Grid>
                      <Grid item xs={5} sm={5} style={{ paddingLeft: 10 }}>
                        <TextField
                          variant="filled"
                          margin="normal"
                          label="Referral/Coupon"
                          error={this.state.referralError}
                          helperText={this.state.referralText}
                          fullWidth
                          value={this.state.referral}
                          onChange={(event) => {
                            this.handleInputChange(
                              "referral",
                              event.target.value
                            );
                          }}
                          InputLabelProps={{
                            className: classes.referralInput,
                          }}
                          classes={{ root: classes.coloredField }}
                        />
                      </Grid>
                      <Grid align="center" item xs={12}>
                        <Paper
                          style={{
                            paddingLeft: 15,
                            paddingTop: 10,
                            paddingBottom: 10,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() => {
                                  this.handleInputChange("tos", null);
                                }}
                                value={this.state.tos}
                                style={{ color: "#01c9e1" }}
                              />
                            }
                            label="I have read and agree to the Terms of Service."
                          />
                          <Grid item>
                            <MUILink
                              variant="h6"
                              target="_blank"
                              rel="noopener"
                              href="https://www.laundr.io/termsofservice/"
                              style={{
                                color: "#01c9e1",
                                textAlign: "center",
                              }}
                            >
                              Terms of Service
                            </MUILink>
                            <Typography
                              variant="body2"
                              className={classes.error}
                            >
                              {this.state.tosErrorMsg}
                            </Typography>
                          </Grid>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <LoadingButton
                          type="submit"
                          fullWidth
                          variant="contained"
                          className={classes.submit}
                          onClick={this.handleSendVerification}
                        >
                          Create Account
                        </LoadingButton>
                      </Grid>
                      <Grid item style={{ paddingBottom: 50 }}>
                        <Link href="/" passHref={true}>
                          <Typography
                            variant="h6"
                            style={{
                              color: "#01c9e1",
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          >
                            Already have an account?
                          </Typography>
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
                {/* </CardContent>
                </Card> */}
              </Grid>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

const RegisterCSR = (props) => {
  const { data: response, error } = useSWR(
    "/api/user/getCurrentUser",
    GET_SWR
    // { revalidateOnFocus: false }
  );

  if (error) return <ErrorPage text={error.message} />;
  if (!response) return <ProgressPage />;

  //render or use data
  //if there's a logged in user
  if (response.data.success) {
    const currentUser = response.data.message;
    let redirectDestination;

    if (currentUser.isDriver) {
      redirectDestination = "/driver/available";
    } else if (currentUser.isWasher) {
      redirectDestination = "/washer/assigned";
    } else if (currentUser.isAdmin) {
      redirectDestination = "/admin/placeholder";
    } else {
      redirectDestination = "/user/dashboard";
    }

    props.router.push(redirectDestination);

    //since it takes a second before url is pushed
    return <ProgressPage />;
  }

  return <Register {...props} />;
};

export default compose(withRouter, withStyles(registerStyles))(RegisterCSR);
