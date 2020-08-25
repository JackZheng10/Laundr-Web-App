import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  withStyles,
  Link,
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
} from "@material-ui/core";
import { withRouter } from "next/router";
import { caughtError, showConsoleError } from "../src/helpers/errors";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import MainAppContext from "../src/contexts/MainAppContext";
import registerStyles from "../src/styles/registerStyles";
import axios from "axios";

//todo: referral code functionality when possible
//todo: get city dropdown to have hover effect rather than native dropdown if possible
//todo: get loading from resending code to hover rather than appear?
//todo: change token time to infinite(?) when implementing
//todo: logo cut off on s5/smaller iphones??
//todo: add back <form> so can press enter to submit
//todo: give error msg when wrong phone number entered (you get an error code from twilio controller) and disable verification dialog popup

//todo: change underline:after during error to be red again, not the blue. check the new class thats applied?
//todo: make city selector background white when clicked on
//todo: study how the MuiOutlinedInput-root selector works with more specific fields

//in backend, caught errors = return error.code and success false. in frontend, if success is false, print error: message from the response which should be said code
//in frontend, caught errors = use error itself and alert error: error

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
    generatedCode: "N/A", //phone verification
    enteredCode: "",
    showGeneralDialog: false, //dialogs
    generalDialogMsg: "",
    showVerifyDialog: false,
    registered: false, //redirect
  };

  handleVerification = async (event) => {
    event.preventDefault();

    if (this.handleInputValidation()) {
      try {
        const response = await axios.post("/api/user/checkDuplicate", {
          email: this.state.email.toLowerCase(),
          phone: this.state.phone,
        });

        if (response.data.success) {
          switch (response.data.message) {
            case 0:
              try {
                const response = await axios.post("/api/twilio/verifyPhone", {
                  to: this.state.phone,
                });

                if (response.data.success) {
                  this.setState(
                    { generatedCode: response.data.message },
                    () => {
                      this.toggleVerifyDialog();
                    }
                  );
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
              this.setState({
                showGeneralDialog: true,
                generalDialogMsg:
                  "Email address is already in use. Please try again.",
              });
              break;

            case 2:
              this.setState({
                showGeneralDialog: true,
                generalDialogMsg:
                  "Phone number is already in use. Please try again.",
              });
              break;

            case 3:
              this.setState({
                showGeneralDialog: true,
                generalDialogMsg:
                  "Email address and phone number are already in use. Please try again.",
              });
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

  handleInputValidation = () => {
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

        case "password":
          if (
            value.length < 6 ||
            /[A-Z]+/.test(value) === false ||
            /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g.test(value) ===
              false
          ) {
            this.setState({
              [input.name +
              "ErrorMsg"]: "*Passwords must be at least 6 characters long, contain one capital letter, and contain one special character.",
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

    return valid;
  };

  //todo: limit character inputs. you dont want 1000 character names mayn.
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

      case "city":
        this.setState({ [property]: value });
        break;

      case "email":
        this.setState({ [property]: value });
        break;

      case "password":
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

      case "referral":
        this.setState({ [property]: value });
        break;

      case "tos":
        this.setState({ [property]: !this.state.tos });
        break;

      case "enteredCode":
        this.setState({ [property]: value });
        break;
    }
  };

  handleRegister = async () => {
    if (this.state.generatedCode === this.state.enteredCode) {
      try {
        const response = await axios.post("/api/user/register", {
          email: this.state.email.toLowerCase(),
          fname: this.state.fname,
          lname: this.state.lname,
          city: this.state.city,
          phone: this.state.phone,
          password: this.state.password,
          referral: this.state.referral,
        });

        if (response.data.success) {
          this.setState(
            {
              showVerifyDialog: false,
              generatedCode: "N/A",
              enteredCode: "",
            },
            () => {
              this.context.showAlert(response.data.message);
            }
          );
        } else {
          this.context.showAlert(response.data.message);
        }
      } catch (error) {
        showConsoleError("registering", error);
        this.context.showAlert(caughtError("registering", error, 99));
      }
    }
  };

  handleResendCode = () => {
    alert("code will be resent");
  };

  toggleVerifyDialog = () => {
    //to prevent generated code from being reset
    if (this.state.showVerifyDialog) {
      this.setState({
        showVerifyDialog: !this.state.showVerifyDialog,
        generatedCode: "N/A",
        enteredCode: "",
      });
    } else {
      this.setState({ showVerifyDialog: !this.state.showVerifyDialog });
    }
  };

  render() {
    //todo: dont set registered as soon as they verify phone because itll redirect before they can click "ok"
    //use new callback prop for showAlert
    // if (this.state.registered) {
    //   this.props.router.push("/login");
    // }

    const classes = this.props.classes;

    return (
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
              To finish registering, please enter the verification code we just
              sent to your phone. If you didn't receive a code, make sure your
              entered phone number is correct and sign up again. Your code will
              expire upon closing this popup.
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
          </DialogContent>
          <DialogActions>
            <Grid item xs={12} align="left">
              <Button
                onClick={this.toggleVerifyDialog}
                variant="contained"
                className={classes.secondaryButton}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} align="right">
              <Button
                onClick={this.handleResendCode}
                variant="contained"
                className={classes.secondaryButton}
                style={{ marginRight: 10 }}
              >
                Resend
              </Button>
              <Button
                onClick={this.handleRegister}
                variant="contained"
                className={classes.mainButton}
              >
                Submit
              </Button>
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
                  Register
                </Typography>
              </Paper>
              <Grid item>
                <Grid container justify="center">
                  <Grid item xs={6} sm={6} style={{ paddingRight: 10 }}>
                    <TextField
                      variant="filled"
                      margin="normal"
                      fullWidth
                      label="First Name"
                      autoComplete="fname"
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
                      autoComplete="lname"
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
                          this.handleInputChange("city", event.target.value);
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
                      autoComplete="current-password"
                      error={this.state.passwordError}
                      value={this.state.password}
                      helperText={this.state.passwordErrorMsg}
                      onChange={(event) => {
                        this.handleInputChange("password", event.target.value);
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
                      label="Referral Code"
                      helperText="*Optional"
                      fullWidth
                      value={this.state.referral}
                      onChange={(event) => {
                        this.handleInputChange("referral", event.target.value);
                      }}
                      classes={{ root: classes.coloredField }}
                    />
                  </Grid>
                  <Grid align="center" item xs={12}>
                    <Paper style={{ padding: 10 }}>
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
                        <Link
                          href="/login"
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
                        </Link>
                        <div className={classes.error}>
                          {this.state.tosErrorMsg}
                        </div>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className={classes.submit}
                      onClick={this.handleVerification}
                    >
                      Create Account
                    </Button>
                  </Grid>
                  <Grid item style={{ paddingBottom: 50 }}>
                    <Link
                      href="/login"
                      variant="h6"
                      style={{ color: "#01c9e1", textAlign: "center" }}
                    >
                      Already have an account?
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

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withRouter, withStyles(registerStyles))(Register);

{
  /* <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <img
            alt="Company Logo"
            src="/images/LogRegLogo.png"
            style={{
              width: 400,
              height: 160,
            }}
          />
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Dialog
            open={this.state.showVerifyDialog}
            onClose={this.toggleVerifyDialog}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Verification</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To finish registering, please enter the verification code we
                just sent to your phone. If you didn't receive a code, make sure
                your entered phone number is correct and sign up again. Your
                code will expire upon closing this popup.
              </DialogContentText>
              <Grid item xs={12} align="center">
                <Grid item xs={12} align="center">
                  {this.state.showResentLoad && <CircularProgress />}
                </Grid>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Code"
                  disabled={this.state.disableCode}
                  style={{ width: 100 }}
                  value={this.state.enteredCode}
                  onChange={(event) => {
                    this.handleInputChange("enteredCode", event.target.value);
                  }}
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              <Grid item xs={12} align="left">
                <Button onClick={this.toggleVerifyDialog} color="primary">
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} align="right">
                <Button onClick={this.handleResendCode} color="primary">
                  Resend
                </Button>
                <Button onClick={this.handleRegister} color="primary">
                  Submit
                </Button>
              </Grid>
            </DialogActions>
          </Dialog>
          <form onSubmit={this.handleVerification} className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="First Name"
                  autoComplete="fname"
                  error={this.state.fnameError}
                  helperText={this.state.fnameErrorMsg}
                  value={this.state.fname}
                  onChange={(event) => {
                    this.handleInputChange("fname", event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Last Name"
                  autoComplete="lname"
                  error={this.state.lnameError}
                  helperText={this.state.lnameErrorMsg}
                  value={this.state.lname}
                  onChange={(event) => {
                    this.handleInputChange("lname", event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>City</InputLabel>
                  <Select
                    native
                    label="City"
                    value={this.state.city}
                    onChange={(event) => {
                      this.handleInputChange("city", event.target.value);
                    }}
                  >
                    <option>Gainesville</option>
                  </Select>
                </FormControl>
                <FormHelperText>
                  *We currently only serve Gainesville.
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  error={this.state.emailError}
                  helperText={this.state.emailErrorMsg}
                  value={this.state.email}
                  onChange={(event) => {
                    this.handleInputChange("email", event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={this.state.passwordError}
                  value={this.state.password}
                  helperText={this.state.passwordErrorMsg}
                  onChange={(event) => {
                    this.handleInputChange("password", event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={7}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Phone Number"
                  error={this.state.phoneError}
                  helperText={this.state.phoneErrorMsg}
                  value={this.state.phone}
                  onChange={(event) => {
                    this.handleInputChange("phone", event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={5} sm={5}>
                <TextField
                  variant="outlined"
                  label="Referral Code"
                  helperText="*Optional"
                  fullWidth
                  value={this.state.referral}
                  onChange={(event) => {
                    this.handleInputChange("referral", event.target.value);
                  }}
                />
              </Grid>
              <Grid align="center" item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => {
                        this.handleInputChange("tos", null);
                      }}
                      value={this.state.tos}
                      color="primary"
                    />
                  }
                  label="I have read and agree to the Terms of Service."
                />
                <Grid align="center" item xs={11}>
                  <div className={classes.error}>{this.state.tosErrorMsg}</div>
                </Grid>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  <Link
                    align="center"
                    color="primary"
                    target="_blank"
                    rel="noopener"
                    href="https://www.laundr.io/termsofservice/"
                  >
                    Terms of Service
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleVerification}
            >
              Create Account
            </Button>
            <Grid container justify="center">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container> */
}
