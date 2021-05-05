import React, { Component } from "react";
import {
  withStyles,
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import loadingButtonStyles from "../../../src/styles/loadingButtonStyles";

//optional props:
//timer = true, time = seconds -> countdown until button is re-enabled
class LoadingButton extends Component {
  state = { loading: false, secondsLeft: 0 };

  sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  handleButtonClick = (event) => {
    event.preventDefault();

    this.setState({ loading: true }, async () => {
      const { onClick, timer, time } = this.props;

      await onClick(event);

      if (timer) {
        this.startCountdown(time);
      } else {
        this.setState({ loading: false });
      }
    });
  };

  startCountdown = (time) => {
    this.setState({ secondsLeft: time });

    const interval = setInterval(() => {
      this.setState({ secondsLeft: this.state.secondsLeft - 1 });

      if (this.state.secondsLeft <= 0) {
        clearInterval(interval);
        this.setState({ loading: false });
      }
    }, 1000);
  };

  render() {
    const { classes, children, style, ...rest } = this.props;

    return (
      <Button
        {...rest}
        disabled={this.state.loading}
        onClick={this.handleButtonClick}
        style={Object.assign(
          {
            backgroundColor:
              this.state.loading && this.state.secondsLeft <= 0
                ? "#D3D3D3"
                : "",
            position: "relative",
          },
          style
        )}
      >
        {children}
        {this.state.loading && this.state.secondsLeft <= 0 && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        {!(this.state.secondsLeft <= 0) && (
          <Typography className={classes.countdownProgress}>
            {this.state.secondsLeft}
          </Typography>
        )}
      </Button>
    );
  }
}

export default withStyles(loadingButtonStyles)(LoadingButton);
