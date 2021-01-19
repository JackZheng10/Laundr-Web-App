import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Card,
  CardContent,
  Divider,
  CardActions,
  Button,
  TextField,
  CardHeader,
  Fade,
  Collapse,
} from "@material-ui/core";
import { withRouter } from "next/router";
import { caughtError, showConsoleError } from "../../../helpers/errors";
import { getCurrentUser } from "../../../helpers/session";
import compose from "recompose/compose";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingButton from "../../../components/other/LoadingButton";
import accountInfoStyles from "../../../styles/User/Account/components/accountInfoStyles";
import MainAppContext from "../../../contexts/MainAppContext";

//maybe email + phone on same line

class AccountInfo extends Component {
  static contextType = MainAppContext;

  constructor(props) {
    super(props);

    const user = this.props.user;

    this.state = {
      fname: user.fname, //update details
      fnameError: false,
      fnameErrorMsg: "",
      lname: user.lname,
      lnameError: false,
      lnameErrorMsg: "",
      email: user.email,
      emailError: false,
      emailErrorMsg: "",
      phone: user.phone,
      phoneError: false,
      phoneErrorMsg: "",
      showPasswordUpdate: false, //update password
      password: "",
      confirmedPassword: "",
      passwordError: false,
      passwordErrorMsg: "",
    };
  }

  toggleShowPasswordUpdate = () => {
    this.handleInputChange("password", "");
    this.handleInputChange("confirmedPassword", "");
    this.setState({ showPasswordUpdate: !this.state.showPasswordUpdate });
  };

  handleInputChange = (property, value) => {
    const nameRegex = /^[a-zA-Z][a-zA-Z\s]*$/;
    const phoneRegex = /^[0-9\b]+$/;

    switch (property) {
      case "fname":
        if (value === "" || nameRegex.test(value)) {
          this.setState({ [property]: value });
        }
        break;

      case "lname":
        if (value === "" || nameRegex.test(value)) {
          this.setState({ [property]: value });
        }
        break;

      case "email":
        this.setState({ [property]: value });
        break;

      case "phone":
        if (value === "" || phoneRegex.test(value)) {
          if (value.length > 10) {
            value = value.substr(0, 10);
          }
          this.setState({ [property]: value });
        }
        break;

      case "password":
        this.setState({ [property]: value });
        break;

      case "confirmedPassword":
        this.setState({ [property]: value });
        break;
    }
  };

  handleUpdateDetails = async () => {
    const response = await getCurrentUser();

    if (!response.data.success) {
      if (response.data.redirect) {
        return this.props.router.push(response.data.message);
      } else {
        return this.context.showAlert(response.data.message);
      }
    }

    //or maybe update anyways and dont waste a server request?

    //plan:
    //if details have changed, update them and then check if phone needs to be changed
    //if details havent changed, just check if phone needs to be changed
    //if nothing changed, alert user

    if (this.handleDetailsInputValidation()) {
      try {
        const response = await axios.post(
          "/api/user/updateDetails",
          {
            fname: this.state.fname,
            lname: this.state.lname,
            email: this.state.email,
          },
          { withCredentials: true }
        );

        this.context.showAlert(response.data.message, () => {});
      } catch (error) {
        showConsoleError("jj", error);
        this.context.showAlert(caughtError("jj", error, 99));
      }
    }
  };

  handleDetailsInputValidation = () => {
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
      switch (input.name) {
        case "email":
          if (
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) === false
          ) {
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

        case "phone":
          if (value.length < 10) {
            this.setState({
              [input.name +
              "ErrorMsg"]: "*Please enter a 10-digit phone number.",
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

    return valid;
  };

  handleUpdatePassword = async () => {
    if (this.handlePasswordInputValidation()) {
      try {
        const response = await axios.post(
          "/api/user/updatePassword",
          {
            password: this.state.password,
          },
          { withCredentials: true }
        );

        if (!response.data.success) {
          this.context.showAlert(response.data.message);
        } else {
          this.toggleShowPasswordUpdate();
          this.context.showAlert(response.data.message);
        }
      } catch (error) {
        showConsoleError("resetting password", error);
        this.context.showAlert(caughtError("resetting password", error, 99));
      }
    }
  };

  handlePasswordInputValidation = () => {
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

  renderCardActions = (classes) => {
    if (!this.state.showPasswordUpdate) {
      return (
        <Grid item>
          <Button
            size="medium"
            variant="contained"
            className={classes.mainButton}
            onClick={this.toggleShowPasswordUpdate}
          >
            Update Password
          </Button>
        </Grid>
      );
    } else {
      return (
        <React.Fragment>
          <Grid item>
            <Button
              size="medium"
              variant="contained"
              className={classes.redButton}
              onClick={this.toggleShowPasswordUpdate}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              size="medium"
              variant="contained"
              className={classes.greenButton}
              onClick={this.handleUpdatePassword}
            >
              Confirm
            </LoadingButton>
          </Grid>
        </React.Fragment>
      );
    }
  };

  render() {
    const { classes, user } = this.props;

    return (
      <React.Fragment>
        <Card className={classes.root} elevation={10}>
          <CardHeader
            title="Profile"
            titleTypographyProps={{
              variant: "h4",
              style: {
                color: "white",
              },
            }}
            className={classes.cardHeader}
          />
          <CardContent>
            <Grid //main column
              container
              spacing={2}
              justify="center"
            >
              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="First Name"
                  size="small"
                  value={this.state.fname}
                  error={this.state.fnameError}
                  helperText={this.state.fnameErrorMsg}
                  autoComplete="given-name"
                  className={classes.input}
                  onChange={(event) => {
                    this.handleInputChange("fname", event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last Name"
                  size="small"
                  value={this.state.lname}
                  autoComplete="family-name"
                  error={this.state.lnameError}
                  helperText={this.state.lnameErrorMsg}
                  className={classes.input}
                  onChange={(event) => {
                    this.handleInputChange("lname", event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email Address"
                  size="small"
                  value={this.state.email}
                  autoComplete="email"
                  error={this.state.emailError}
                  helperText={this.state.emailErrorMsg}
                  className={classes.input}
                  onChange={(event) => {
                    this.handleInputChange("email", event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <TextField
                      style={{ width: 110 }}
                      variant="outlined"
                      label="Phone Number"
                      size="small"
                      value={this.state.phone}
                      autoComplete="tel-national"
                      error={this.state.phoneError}
                      helperText={this.state.phoneErrorMsg}
                      className={classes.input}
                      onChange={(event) => {
                        this.handleInputChange("phone", event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      size="medium"
                      variant="contained"
                      className={classes.mainButton}
                      onClick={this.handleUpdateDetails}
                    >
                      Update
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          {/* <Divider /> */}
          <CardActions className={classes.cardFooter}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              {this.renderCardActions(classes)}
            </Grid>
          </CardActions>
          <Collapse
            in={this.state.showPasswordUpdate}
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <TextField
                variant="filled"
                margin="normal"
                fullWidth
                size="small"
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
                size="small"
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
            </CardContent>
          </Collapse>
        </Card>
      </React.Fragment>
    );
  }
}

AccountInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withRouter, withStyles(accountInfoStyles))(AccountInfo);
