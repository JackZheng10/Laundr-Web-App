import React, { Component } from "react";
import {
  Button,
  TextField,
  Grid,
  Dialog,
  Typography,
  withStyles,
  Paper,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { withRouter } from "next/router";
import { caughtError, showConsoleError } from "../src/helpers/errors";
import { GetServerSideProps } from "next";
import { limitLength } from "../src/helpers/inputs";
import {
  LoadingButton,
  ProgressPage,
  ErrorPage,
} from "../src/components/other";
import { GET_SWR } from "../src/helpers/swr";
import Link from "next/link";
import useSWR, { cache, mutate } from "swr";
import Head from "next/head";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import validator from "validator";
import MainAppContext from "../src/contexts/MainAppContext";
import loginStyles from "../src/styles/loginStyles";
import axios from "../src/helpers/axios";

//todo: add back revalidate on focus

class Login extends Component {
  static contextType = MainAppContext;

  state = {
    email: "",
    password: "",
    emailError: false,
    passwordError: false,
    showErrorDialog: false,
    errorDialogMsg: "",
    emailErrorMsg: "",
    passwordErrorMsg: "",
    showResetDialog: false,
    enteredPhone: "",
  };

  handleInputChange = (property, value) => {
    switch (property) {
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

      case "enteredPhone":
        if (validator.isNumeric(value)) {
          value = limitLength(value, 10);
          this.setState({ [property]: value });
        }
        break;
    }
  };

  handleLogin = async (event) => {
    event.preventDefault();

    if (this.handleInputValidation()) {
      try {
        const response = await axios.post(
          "/api/user/login",
          {
            email: this.state.email.toLowerCase(),
            password: this.state.password,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          await mutate();
          this.props.router.push(response.data.message);
        } else {
          this.context.showAlert(response.data.message);
        }
      } catch (error) {
        showConsoleError("logging in", error);
        this.context.showAlert(caughtError("logging in", error, 99));
      }
    }
  };

  handleInputValidation = () => {
    let valid = true;

    const inputs = [
      {
        name: "email",
        whitespaceMsg: "*Please enter a valid email.",
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
      if (input.name === "email") {
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
      }
    }

    return valid;
  };

  toggleResetDialog = () => {
    this.setState({
      showResetDialog: !this.state.showResetDialog,
      enteredPhone: "",
    });
  };

  handlePasswordReset = async () => {
    if (this.state.enteredPhone.length < 10) {
      return this.context.showAlert("Please enter a valid phone number.");
    }

    try {
      const response = await axios.post(
        "/api/user/sendPasswordReset",
        {
          phone: this.state.enteredPhone,
        },
        { withCredentials: true }
      );

      this.setState({ showResetDialog: false }, () => {
        this.context.showAlert(response.data.message);
      });
    } catch (error) {
      showConsoleError("sending password reset link", error);
      this.context.showAlert(
        caughtError("sending password reset link", error, 99)
      );
    }
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Head>
          {/* <meta
          name="description"
          content="Login to your Laundr account."
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
            open={this.state.showResetDialog}
            onClose={this.toggleResetDialog}
            style={{ zIndex: 19 }}
          >
            <DialogTitle disableTypography>
              <Typography variant="h4" style={{ color: "#01c9e1" }}>
                Reset Password
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography
                variant="body1"
                style={{ textAlign: "center" }}
                gutterBottom
              >
                Enter your phone number and we'll text you a link to rest your
                password.
              </Typography>
              <div style={{ textAlign: "center" }}>
                <TextField
                  variant="outlined"
                  label="Phone"
                  size="small"
                  autoComplete="tel-national"
                  value={this.state.enteredPhone}
                  onChange={(event) => {
                    this.handleInputChange("enteredPhone", event.target.value);
                  }}
                  className={classes.input}
                  style={{ width: 110 }}
                />
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
                    onClick={this.toggleResetDialog}
                    variant="contained"
                    className={classes.secondaryButton}
                    style={{ marginRight: 10 }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <LoadingButton
                    onClick={this.handlePasswordReset}
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
                    Login
                  </Typography>
                </Grid>
                <Grid item>
                  <form>
                    <TextField
                      variant="filled"
                      margin="normal"
                      fullWidth
                      label="Email Address"
                      autoComplete="email"
                      error={this.state.emailError}
                      helperText={this.state.emailErrorMsg}
                      onChange={(event) => {
                        this.handleInputChange("email", event.target.value);
                      }}
                      value={this.state.email}
                      className={classes.coloredField}
                    />
                    <TextField
                      variant="filled"
                      margin="normal"
                      fullWidth
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                      error={this.state.passwordError}
                      helperText={this.state.passwordErrorMsg}
                      onChange={(event) => {
                        this.handleInputChange("password", event.target.value);
                      }}
                      value={this.state.password}
                      classes={{ root: classes.coloredField }}
                    />
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      className={classes.submit}
                      onClick={this.handleLogin}
                    >
                      Sign In
                    </LoadingButton>
                  </form>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  style={{ paddingBottom: 50 }}
                >
                  <Grid item>
                    <Typography
                      onClick={this.toggleResetDialog}
                      variant="h6"
                      style={{
                        color: "#01c9e1",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      Forgot password?
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Link href="/register" passHref={true}>
                      <Typography
                        variant="h6"
                        style={{
                          color: "#01c9e1",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        Don't have an account?
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        {/* <Footer /> */}
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

/*
https://swr.vercel.app/
https://swr.vercel.app/docs/data-fetching#axios
https://swr.vercel.app/getting-started
https://nextjs.org/docs/basic-features/data-fetching
https://nextjs.org/docs/authentication
to-do:
-configure properly (retrying, cache, etc...)
-make reusable where possible
-loading screen
-clean up class code that hides elements if error fetching
-handle errors and redirects
-clean out ssr file
-combine what you need?
-clean up stuff
*/

const LoginCSR = (props) => {
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

  return <Login {...props} />;
};

export default compose(withRouter, withStyles(loginStyles))(LoginCSR);
