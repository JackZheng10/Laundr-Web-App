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
import compose from "recompose/compose";
import axios from "axios";
import LoadingButton from "../../src/components/other/LoadingButton";
import loginStyles from "../../src/styles/loginStyles";
import MainAppContext from "../../src/contexts/MainAppContext";

const moment = require("moment");

class PasswordReset extends Component {
  static contextType = MainAppContext;

  state = {
    password: "",
    confirmedPassword: "",
    passwordError: false,
    passwordErrorMsg: "",
  };

  sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  handleInputChange = (property, value) => {
    this.setState({ [property]: value });
  };

  handleResetPassword = async () => {
    if (this.handleInputValidation()) {
      try {
        const response = await axios.post(
          "/api/user/resetPassword",
          {
            password: this.state.password,
            id: this.props.fetch_SSR.id,
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
    const password = this.state.password;
    const confirmedPassword = this.state.confirmedPassword;
    let valid = true;

    if (password.length < 6 || /[A-Z]+/.test(password) === false) {
      this.setState({
        passwordErrorMsg:
          "*Passwords must be at least 6 characters long and contain one capital letter.",
        passwordError: true,
      });
      valid = false;
    } else {
      this.setState({
        passwordErrorMsg: "",
        passwordError: false,
      });
    }

    if (password != confirmedPassword) {
      this.setState({
        confirmedPasswordErrorMsg: "*Passwords do not match.",
        confirmedPasswordError: true,
      });
      valid = false;
    } else {
      this.setState({
        confirmedPasswordErrorMsg: "",
        confirmedPasswordError: false,
      });
    }

    return valid;
  };

  render() {
    const { classes, fetch_SSR } = this.props;

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
                {fetch_SSR.success ? (
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
                ) : (
                  <Typography
                    variant="h4"
                    style={{ textAlign: "center", marginTop: 10 }}
                  >
                    {fetch_SSR.message}
                  </Typography>
                )}
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

export async function getServerSideProps(context) {
  const id = context.query.id;

  const response_one = await getPasswordResetSession(context, id);

  //no need to check for redirect since user shouldnt be logged in
  if (!response_one.data.success) {
    return {
      props: {
        fetch_SSR: {
          success: false,
          message: response_one.data.message,
        },
      },
    };
  }

  //succeeded in fetching
  const session = response_one.data.message;

  //check to see if the session exists
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //check to see if it was used or expired
  if (session.used) {
    return {
      props: {
        fetch_SSR: {
          success: false,
          message:
            "This link has already been used. If this is a mistake, please contact us.",
        },
      },
    };
  } else if (moment(session.expires).isBefore(moment())) {
    return {
      props: {
        fetch_SSR: {
          success: false,
          message: "This link has expired.",
        },
      },
    };
  }

  //session is valid, so proceed
  return {
    props: {
      fetch_SSR: {
        success: true,
        id: id,
      },
    },
  };
}
export default compose(withRouter, withStyles(loginStyles))(PasswordReset);
