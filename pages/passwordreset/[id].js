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
import compose from "recompose/compose";
import LoadingButton from "../../src/components/other/LoadingButton";
import loginStyles from "../../src/styles/loginStyles";

class PasswordReset extends Component {
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
    await this.sleep(1000);
    console.log(this.handleInputValidation());
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
