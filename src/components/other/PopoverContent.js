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

//open/close logic handled by you
class PopoverContent extends Component {
  renderTrigger = (icon, className, size, buttonText, onClick) => {
    if (icon) {
      return (
        <IconButton onClick={onClick} size="small" style={{ color: "#01c9e1" }}>
          <InfoIcon />
        </IconButton>
      );
    } else {
      return (
        <Button
          variant="contained"
          className={className}
          onClick={onClick}
          size={size || "medium"}
        >
          {buttonText}
        </Button>
      );
    }
  };

  render() {
    const {
      className,
      buttonText,
      size,
      icon,
      content,
      open,
      onClose,
      anchor,
      onClick,
    } = this.props;

    return (
      <React.Fragment>
        {this.renderTrigger(icon, className, size, buttonText, onClick)}
        <Popover
          open={open}
          anchorEl={anchor}
          onClose={onClose}
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

export default PopoverContent;
