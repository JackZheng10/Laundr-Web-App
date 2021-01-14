import React, { Component } from "react";
import { withStyles, Button, CircularProgress } from "@material-ui/core";
import loadingButtonStyles from "../../../src/styles/loadingButtonStyles";

class LoadingButton extends Component {
  state = { loading: false };

  handleButtonClick = (event) => {
    event.preventDefault();

    this.setState({ loading: true }, async () => {
      await this.props.onClick(event);
      this.setState({ loading: false });
      //   setTimeout(() => {
      //     this.setState({ loading: false });
      //   }, 3000);
    });
  };

  render() {
    const { classes, children, ...rest } = this.props;

    return (
      <React.Fragment>
        <Button
          {...rest}
          disabled={this.state.loading}
          onClick={this.handleButtonClick}
          style={{ backgroundColor: this.state.loading ? "#D3D3D3" : "" }}
        >
          {children}
        </Button>
        <div className={classes.wrapper}>
          {this.state.loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(loadingButtonStyles)(LoadingButton);
