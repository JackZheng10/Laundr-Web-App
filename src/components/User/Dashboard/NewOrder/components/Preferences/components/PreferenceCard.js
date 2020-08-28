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
    color: "#01c9e1",
    "&$checked": {
      color: "#01c9e1",
    },
  },
})((props) => <Checkbox color="default" {...props} />);

class PreferenceCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openExpand: false,
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
      <Card className={classes.root}>
        <CardHeader
          action={<BlueCheckbox onClick={this.handleSelect} />}
          title={
            <Typography gutterBottom variant="h6" component="h2">
              {title}
            </Typography>
          }
        />
        <CardMedia className={classes.media} image={this.state.currentImage} />
        <CardActions disableSpacing style={{ justifyContent: "center" }}>
          <TooltipButton icon={true} text={info} />
        </CardActions>
      </Card>
    );
  }
}

PreferenceCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(preferenceCardStyles)(PreferenceCard);
