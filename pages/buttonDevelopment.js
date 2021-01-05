import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Typography,
  Button,
  TextField,
  makeStyles,
  CircularProgress,
  Fab,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import SaveIcon from "@material-ui/icons/Save";
import clsx from "clsx";
import buttonDevelopmentStyles from "../src/temp/buttonDevelopmentStyles";

class LoadingButton extends Component {
  state = { loading: false, success: false };

  handleButtonClick = () => {
    this.setState({ loading: true }, () => {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 3000);
    });
  };

  render() {
    const { classes } = this.props;

    const buttonClassname = clsx({
      [classes.buttonSuccess]: this.state.success,
      [classes.normalButton]: !this.state.success,
    });

    return (
      <React.Fragment>
        <div className={classes.root}>
          <div className={classes.wrapper}>
            <Fab
              aria-label="save"
              color="primary"
              className={buttonClassname}
              onClick={this.handleButtonClick}
            >
              {this.state.success ? <CheckIcon /> : <SaveIcon />}
            </Fab>
            {this.state.loading && (
              <CircularProgress size={68} className={classes.fabProgress} />
            )}
          </div>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={this.state.loading}
              onClick={this.handleButtonClick}
            >
              Accept terms
            </Button>
            {this.state.loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(buttonDevelopmentStyles)(LoadingButton);
