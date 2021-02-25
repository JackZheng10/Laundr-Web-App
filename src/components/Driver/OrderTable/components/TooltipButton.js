import React, { Component } from "react";
import {
  Button,
  withStyles,
  Fade,
  Tooltip,
  IconButton,
  Typography,
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

class PopoverButton extends Component {
  state = { open: false };

  togglePopover = () => {
    this.setState({ open: !this.state.open });
  };

  renderTrigger = (icon, className, size, buttonText) => {
    if (icon) {
      return (
        <IconButton
          onClick={this.togglePopover}
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
          onClick={this.togglePopover}
          size={size || "medium"}
        >
          {buttonText}
        </Button>
      );
    }
  };

  render() {
    const { className, text, buttonText, size, icon } = this.props;

    return (
      <React.Fragment>
        <LightTooltip
          disableHoverListener
          disableTouchListener
          title={<Typography variant="body1">{text}</Typography>}
          open={this.state.open}
          placement="bottom"
          TransitionComponent={Fade}
          onClose={this.togglePopover}
          arrow
        >
          {this.renderTrigger(icon, className, size, buttonText)}
        </LightTooltip>
      </React.Fragment>
    );
  }
}

export default PopoverButton;
