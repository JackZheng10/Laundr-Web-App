import React, { Component } from "react";
import {
  CardActions,
  Card,
  CardHeader,
  CardMedia,
  Checkbox,
  Typography,
  withStyles,
  Tooltip,
  Fade,
  withWidth,
} from "@material-ui/core";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import TooltipButton from "../../../../../../Driver/OrderTable/components/TooltipButton";
import preferenceCardStyles from "../../../../../../../styles/User/Dashboard/components/NewOrder/components/Preferences/components/preferenceCardStyles";

const BlueCheckbox = withStyles({
  root: {
    color: "#ffffff",
    "&$checked": {
      color: "#ffffff",
    },
  },
})((props) => <Checkbox color="default" {...props} />);

class PreferenceCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      currentImage: this.props.unselectedImage,
    };
  }

  handleSelect = () => {
    const { unselectedImage, selectedImage, handleInputChange } = this.props;

    if (this.state.selected) {
      this.setState(
        {
          selected: false,
          currentImage: unselectedImage,
        },
        () => {
          handleInputChange(this.state.selected);
        }
      );
    } else {
      this.setState({ selected: true, currentImage: selectedImage }, () => {
        handleInputChange(this.state.selected);
      });
    }
  };

  getTitleSize = (width) => {
    switch (width) {
      case "xl":
        return "h5";
      case "lg":
        return "h5";
      case "md":
        return "h5";
      case "sm":
        return "h5";
      case "xs":
        return "body2";
    }
  };

  render() {
    const { classes, title, info, width } = this.props;

    return (
      <Card
        className={classes.root}
        style={{ backgroundColor: this.state.selected ? "#01c9e1" : "#676767" }}
      >
        <CardHeader
          action={<BlueCheckbox onClick={this.handleSelect} />}
          title={
            <Typography
              gutterBottom
              variant={this.getTitleSize(width)}
              style={{ color: "#ffffff" }}
            >
              {title}
            </Typography>
          }
        />
        <CardMedia className={classes.media} image={this.state.currentImage} />
        <CardActions disableSpacing style={{ justifyContent: "center" }}>
          <TooltipButton icon={true} text={info} color="#ffffff" />
        </CardActions>
      </Card>
    );
  }
}

PreferenceCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withWidth(),
  withStyles(preferenceCardStyles)
)(PreferenceCard);
