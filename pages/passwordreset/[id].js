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
  sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  handleResetPassword = async () => {
    await this.sleep(1000);
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
                    //error={this.state.emailError}
                    //helperText={this.state.emailErrorMsg}
                    // onChange={(event) => {
                    //   this.handleInputChange("email", event.target.value);
                    // }}
                    //value={this.state.email}
                    className={classes.coloredField}
                  />
                  <TextField
                    variant="filled"
                    margin="normal"
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    // error={this.state.passwordError}
                    // helperText={this.state.passwordErrorMsg}
                    // onChange={(event) => {
                    //   this.handleInputChange("password", event.target.value);
                    // }}
                    // value={this.state.password}
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
