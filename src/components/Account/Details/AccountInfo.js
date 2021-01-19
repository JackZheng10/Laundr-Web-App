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
import { caughtError, showConsoleError } from "../../../helpers/errors";
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
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phone: user.phone,
      showPasswordUpdate: false,
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

  handleUpdatePassword = async () => {
    if (this.handleInputValidation()) {
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
                      className={classes.input}
                      onChange={(event) => {
                        this.handleInputChange("phone", event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      size="medium"
                      variant="contained"
                      className={classes.mainButton}
                      onClick={() => {
                        alert("work in progress");
                      }}
                    >
                      Update
                    </Button>
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

export default withStyles(accountInfoStyles)(AccountInfo);
