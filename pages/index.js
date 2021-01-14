import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  withStyles,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { withRouter } from "next/router";
import { caughtError, showConsoleError } from "../src/helpers/errors";
import { GetServerSideProps } from "next";
import { getExistingOrder_SSR, getCurrentUser_SSR } from "../src/helpers/ssr";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import LoadingButton from "../src/components/other/LoadingButton";
import MainAppContext from "../src/contexts/MainAppContext";
import loginStyles from "../src/styles/loginStyles";
import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("../src/config").baseURL;

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        target="_blank"
        rel="noopener"
        href="https://laundr.io/"
      >
        Laundr LLC
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

//todo: make login not case sensitive (typing W1@gmail.com) doesnt work (done, just test)
//limit input length for login + registration

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
  };

  handleInputChange = (property, value) => {
    this.setState({ [property]: value });
  };

  handleLogin = async (event) => {
    event.preventDefault();

    if (this.handleInputValidation()) {
      try {
        //this.context.showLoading();
        const response = await axios.post(
          "/api/user/login",
          {
            email: this.state.email.toLowerCase(),
            password: this.state.password,
          },
          { withCredentials: true }
        );
        //this.context.hideLoading();

        if (response.data.success) {
          this.props.router.push(response.data.message);
        } else {
          this.context.showAlert(response.data.message);
        }
      } catch (error) {
        this.context.hideLoading();
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
      if (!value.replace(/\s/g, "").length) {
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
        if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) === false) {
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

  toggleDialog = () => {
    this.setState({ showErrorDialog: !this.state.showErrorDialog });
  };

  render() {
    const classes = this.props.classes;

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.pageContainer}
      >
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
                  className={classes.logo}
                />
              </Grid>
              <Grid item>
                <Paper elevation={0}>
                  <Typography
                    variant="h1"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                      padding: 10,
                    }}
                  >
                    Login
                  </Typography>
                </Paper>
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
              <Grid container>
                <Grid item xs style={{ paddingBottom: 10 }}>
                  <Link
                    href="#"
                    variant="h6"
                    style={{ color: "#01c9e1", textAlign: "center" }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item style={{ paddingBottom: 50 }}>
                  <Link
                    href="/register"
                    variant="h6"
                    style={{ color: "#01c9e1", textAlign: "center" }}
                  >
                    Don't have an account?
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export async function getServerSideProps(context) {
  //fetch current user if there exists one
  const response_one = await getCurrentUser_SSR(context);

  //console.log(context);

  //check for redirect needed due to a currently logged in user
  if (response_one.data.success) {
    const currentUser = response_one.data.message;
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

    return {
      redirect: {
        destination: redirectDestination,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default compose(withRouter, withStyles(loginStyles))(Login);
