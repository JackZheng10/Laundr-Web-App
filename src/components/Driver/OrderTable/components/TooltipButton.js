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

class TooltipButton extends Component {
  state = { open: false };

  togglePopover = () => {
    this.setState({ open: !this.state.open });
  };

  renderTrigger = (icon, className, size, buttonText, color, style) => {
    if (icon) {
      return (
        <IconButton
          onClick={this.togglePopover}
          size="small"
          style={Object.assign({ color: color || "#01c9e1" }, style)}
        >
          <InfoIcon />
        </IconButton>
      );
    } else {
      return (
        <Button
          variant="contained"
          className={className}
          style={style}
          onClick={this.togglePopover}
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
      text,
      buttonText,
      size,
      icon,
      color,
      placement,
      style,
    } = this.props;

    return (
      <React.Fragment>
        {/* <LightTooltip
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
        </LightTooltip> //this is the white background, laundr blue arrow tooltip. kinda clashes. */}
        <Tooltip
          disableHoverListener
          disableTouchListener
          title={
            <Typography
              variant="body1"
              style={{ color: "white", textAlign: "center" }}
            >
              {text}
            </Typography>
          }
          open={this.state.open}
          placement={placement || "bottom"}
          onClose={this.togglePopover}
          arrow
        >
          {this.renderTrigger(icon, className, size, buttonText, color, style)}
        </Tooltip>
      </React.Fragment>
    );
  }
}

export default TooltipButton;
