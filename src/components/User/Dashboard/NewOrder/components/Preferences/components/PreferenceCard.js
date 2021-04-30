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
} from "@material-ui/core";
import PropTypes from "prop-types";
import InfoIcon from "@material-ui/icons/Info";
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

  render() {
    const { classes, title, info } = this.props;

    return (
      <Card
        className={classes.root}
        style={{ backgroundColor: this.state.selected ? "#01c9e1" : "#676767" }}
      >
        <CardHeader
          action={<BlueCheckbox onClick={this.handleSelect} />}
          title={
            <Typography gutterBottom variant="h5" style={{ color: "#ffffff" }}>
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

export default withStyles(preferenceCardStyles)(PreferenceCard);
