import React, { Component } from "react";
import { Button, withStyles, Fade, Tooltip } from "@material-ui/core";

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

  render() {
    const { className, text, buttonText } = this.props;

    return (
      <React.Fragment>
        <LightTooltip
          disableHoverListener
          disableTouchListener
          title={text}
          open={this.state.open}
          placement="bottom"
          TransitionComponent={Fade}
          onClose={this.togglePopover}
          arrow
        >
          <Button
            variant="contained"
            className={className}
            onClick={this.togglePopover}
          >
            {buttonText}
          </Button>
        </LightTooltip>
      </React.Fragment>
    );
  }
}

export default PopoverButton;
