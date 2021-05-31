import React, { Component } from "react";
import {
  Button,
  withStyles,
  Typography,
  Tooltip,
  IconButton,
  Popover,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "black",
    boxShadow: theme.shadows[1],
    fontSize: 12,
    maxWidth: 275,
    justifyContent: "center",
    textAlign: "center",
  },
  arrow: {
    color: "#01c9e1",
  },
}))(Tooltip);

//handles own open/close logic
class PopoverButton extends Component {
  state = { open: false, anchor: null };

  openPopover = (event) => {
    this.setState({ open: true, anchor: event.currentTarget });
  };

  closePopover = () => {
    this.setState({ open: false, anchor: null });
  };

  renderTrigger = (icon, className, size, buttonText) => {
    if (icon) {
      return (
        <IconButton
          onClick={this.openPopover}
          size="small"
          style={{ color: "#01c9e1" }}
        >
          <InfoIcon />
        </IconButton>
      );
    } else {
      return (
        <Button
          variant="contained"
          className={className}
          onClick={this.openPopover}
          size={size || "medium"}
        >
          {buttonText}
        </Button>
      );
    }
  };

  render() {
    const { className, buttonText, size, icon, content } = this.props;

    return (
      <React.Fragment>
        {this.renderTrigger(icon, className, size, buttonText)}
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchor}
          onClose={this.closePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          {content}
        </Popover>
      </React.Fragment>
    );
  }
}

export default PopoverButton;
