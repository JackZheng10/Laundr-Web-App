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
import preferenceCardStyles from "../../../../../../../styles/User/Dashboard/components/NewOrder/components/Preferences/components/preferenceCardStyles";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
  arrow: {
    color: theme.palette.common.grey,
  },
}))(Tooltip);

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
          action={
            <Checkbox
              inputProps={{ "aria-label": "secondary checkbox" }}
              onClick={this.handleSelect}
              /*todo: change color to dat blue*/
            />
          }
          title={
            <Typography gutterBottom variant="h6" component="h2">
              {title}
            </Typography>
          }
        />
        <CardMedia className={classes.media} image={this.state.currentImage} />
        <CardActions disableSpacing style={{ justifyContent: "center" }}>
          {/*todo: change arrow color to "#01c9e1"*/}
          <LightTooltip title={info} TransitionComponent={Fade} arrow>
            <InfoIcon
              color="primary"
              style={{
                cursor: "pointer",
                color: "#01c9e1",
              }}
            />
          </LightTooltip>
        </CardActions>
      </Card>
    );
  }
}

PreferenceCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(preferenceCardStyles)(PreferenceCard);
