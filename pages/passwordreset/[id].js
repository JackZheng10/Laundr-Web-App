import React, { Component } from "react";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Button,
  TextField,
  Link,
  Grid,
  Typography,
  Container,
  withStyles,
  Paper,
} from "@material-ui/core";
import { getPasswordResetSession } from "../../src/helpers/ssr";
import { limitLength } from "../../src/helpers/inputs";
import { GET_SWR, getFilterConfig, hasPageAccess } from "../../src/helpers/swr";
import useSWR from "swr";
import validator from "validator";
import compose from "recompose/compose";
import axios from "axios";
import LoadingButton from "../../src/components/other/LoadingButton";
import loginStyles from "../../src/styles/loginStyles";
import MainAppContext from "../../src/contexts/MainAppContext";

const moment = require("moment-timezone");
moment.tz.setDefault("America/New_York");

class PasswordReset extends Component {
  static contextType = MainAppContext;

  state = {
    password: "",
    confirmedPassword: "",
    passwordError: false,
    passwordErrorMsg: "",
    confirmedPasswordError: false,
    confirmedPasswordErrorMsg: "",
  };

  sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  handleInputChange = (property, value) => {
    switch (property) {
      case "password":
        if (!validator.contains(value, " ")) {
          value = limitLength(value, 64);
          this.setState({ [property]: value });
        }
        break;

      case "confirmedPassword":
        if (!validator.contains(value, " ")) {
          value = limitLength(value, 64);
          this.setState({ [property]: value });
        }
        break;
    }
  };

  handleResetPassword = async () => {
    if (this.handleInputValidation()) {
      try {
        const response = await axios.post(
          "/api/user/resetPassword",
          {
            password: this.state.password,
            id: this.props.id,
          },
          { withCredentials: true }
        );

        if (!response.data.success) {
          this.context.showAlert(response.data.message);
        } else {
          this.context.showAlert(response.data.message, () => {
            this.props.router.push("/");
          });
        }
      } catch (error) {
        showConsoleError("resetting password", error);
        this.context.showAlert(caughtError("resetting password", error, 99));
      }
    }
  };

  handleInputValidation = () => {
    let valid = true;

    const inputs = [
      {
        name: "password",
        whitespaceMsg: "*Please enter a password.",
      },
      {
        name: "confirmedPassword",
        whitespaceMsg: "*Please confirm your password.",
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
        case "password":
          if (value.length < 6 || !/[A-Z]+/.test(value)) {
            this.setState({
              [input.name +
              "ErrorMsg"]: "*Passwords must be at least 6 characters long and contain one capital letter.",
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

        case "confirmedPassword":
          if (value.length > 0 && value != this.state.password) {
            this.setState({
              [input.name + "ErrorMsg"]: "*Passwords must match.",
              [input.name + "Error"]: true,
            });
            valid = false;
          }
      }
    }

    return valid;
  };

  render() {
    const { classes } = this.props;

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
                    Reset Password
                  </Typography>
                </Paper>
              </Grid>
              <Grid item>
                <form>
                  <TextField
                    variant="filled"
                    margin="normal"
                    fullWidth
                    label="New Password"
                    type="password"
                    autoComplete="new-password"
                    error={this.state.passwordError}
                    helperText={this.state.passwordErrorMsg}
                    onChange={(event) => {
                      this.handleInputChange("password", event.target.value);
                    }}
                    value={this.state.password}
                    className={classes.coloredField}
                  />
                  <TextField
                    variant="filled"
                    margin="normal"
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    error={this.state.confirmedPasswordError}
                    helperText={this.state.confirmedPasswordErrorMsg}
                    onChange={(event) => {
                      this.handleInputChange(
                        "confirmedPassword",
                        event.target.value
                      );
                    }}
                    value={this.state.confirmedPassword}
                    className={classes.coloredField}
                  />
                  <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.submit}
                    onClick={this.handleResetPassword}
                  >
                    Reset
                  </LoadingButton>
                </form>

                {/* <Typography
                    variant="h4"
                    style={{ textAlign: "center", marginTop: 10 }}
                  >
                    {fetch_SSR.message}
                  </Typography> */}
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    );
  }
}

PasswordReset.propTypes = {
  classes: PropTypes.object.isRequired,
};

const PasswordResetCSR = (props) => {
  const getWindowEligibility = () => {
    if (typeof window === "undefined") {
      return null;
    } else {
      return window.location.pathname.split("/")[2];
    }
  };

  const { data: response, error } = useSWR(
    `/api/user/getPasswordResetSession?id=${getWindowEligibility()}`,
    GET_SWR
  );

  if (error) return <h1>{error.message}</h1>;
  if (!response) return <h1>loading... (placeholder)</h1>;

  //render or use data
  const session = response.data.message;

  //check to see if the session exists
  if (!session) {
    props.router.push("/");
    return <h1>redirecting... (placeholder)</h1>;
  }

  //check to see if it was used or expired
  if (session.used) {
    return (
      <h1>
        error: This link has already been used. If this is a mistake, please
        contact us.
      </h1>
    );
  } else if (
    moment(session.expires).isBefore(moment()) //todo: test with deployed
  ) {
    return <h1>error: this link has expired</h1>;
  }

  return <PasswordReset id={getWindowEligibility()} {...props} />;
};

export default compose(withRouter, withStyles(loginStyles))(PasswordResetCSR);
