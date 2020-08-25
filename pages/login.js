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
} from "@material-ui/core";
import { withRouter } from "next/router";
import { caughtError, showConsoleError } from "../src/helpers/errors";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import MainAppContext from "../src/contexts/MainAppContext";
import loginStyles from "../src/styles/loginStyles";
import axios from "axios";

//todo: forgot password functionality
//todo: change button colors to match logo/stuff
//todo: change textbox + moving word to laundr colors, buttons to colors as well (WIP)
//todo: big thing is to verify token on each page and redirect if necessary
//todo: login with phone # since thats what they verify?
//todo: this is written very badly lol. will make much better.
//todo: add cssbaseline to layout, dont need on every pg
//todo: alert in app.js is off centered because login is desktop and "sidebar" would be showing if layout present
//todo: learn to customize mui components more!

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
    loggedIn: false,
    isWasher: false,
    isDriver: false,
    isAdmin: false,
  };

  handleInputChange = (property, value) => {
    this.setState({ [property]: value });
  };

  handleLogin = async (event) => {
    event.preventDefault();

    if (this.handleInputValidation()) {
      try {
        const response = await axios.post("/api/user/login", {
          email: this.state.email,
          password: this.state.password,
        });

        if (response.data.success) {
          const token = response.data.token;

          localStorage.setItem("token", token);

          const data = jwtDecode(token);

          this.setState({
            loggedIn: true,
            isWasher: data.isWasher,
            isDriver: data.isDriver,
            isAdmin: data.isAdmin,
          });
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

  handleLoginRedirect = () => {
    if (this.state.isWasher) {
      this.props.router.push("/washer/assigned");
    } else if (this.state.isDriver) {
      this.props.router.push("/driver/available");
    } else if (this.state.isAdmin) {
      // return <Redirect push to="/placeholder" />;
    } else {
      this.props.router.push("/user/dashboard");
    }
  };

  toggleDialog = () => {
    this.setState({ showErrorDialog: !this.state.showErrorDialog });
  };

  render() {
    if (this.state.loggedIn) {
      this.handleLoginRedirect();
    }

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
              <Grid item>
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submit}
                  onClick={this.handleLogin}
                >
                  Sign In
                </Button>
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

export default compose(withRouter, withStyles(loginStyles))(Login);
