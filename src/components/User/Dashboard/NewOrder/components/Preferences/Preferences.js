import React, { Component } from "react";
import { Grid, Typography, TextField, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import preferencesStyles from "../../../../../../styles/User/Dashboard/components/NewOrder/components/Preferences/preferencesStyles";
import PreferenceCard from "./components/PreferenceCard";

//todo: make the damn cards center. redo the layouts of everything based on how i would do it (ie personal site)
//todo: make the tooltip clicking, not hover

class Preferences extends Component {
  state = {
    charCount: 0,
  };

  handleCharCount = (text) => {
    let limit = 200;
    let count;

    if (text.length > limit) {
      count = 200;
    } else {
      count = text.length;
    }

    this.setState({ charCount: count });
  };

  render() {
    const { classes, washerPreferences, handleInputChange } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Would you like any of these options?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <PreferenceCard
              title="Scented"
              info="Unscented detergent is hypoallergenic."
              unselectedImage="/images/NewOrder/ScentedUnselected.png"
              selectedImage="/images/NewOrder/ScentedSelected.png"
              handleInputChange={(selected) => {
                handleInputChange("scented", selected);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PreferenceCard
              title="Delicates"
              info="Delicate clothing is washed in a mesh bag and dried on low heat."
              unselectedImage="/images/NewOrder/DelicatesUnselected.png"
              selectedImage="/images/NewOrder/DelicatesSelected.png"
              handleInputChange={(selected) => {
                handleInputChange("delicates", selected);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PreferenceCard
              title="Separate"
              info="Separated clothing is divided into whites and colors."
              unselectedImage="/images/NewOrder/SeparateUnselected.png"
              selectedImage="/images/NewOrder/SeparateSelected.png"
              handleInputChange={(selected) => {
                handleInputChange("separate", selected);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PreferenceCard
              title="Towels and Sheets"
              info="Towels and sheets are washed separately and dried on high heat."
              unselectedImage="/images/NewOrder/TowelsUnselected.png"
              selectedImage="/images/NewOrder/TowelsSelected.png"
              handleInputChange={(selected) => {
                handleInputChange("towelsSheets", selected);
              }}
            />
          </Grid>
        </Grid>
        <Typography variant="h5" gutterBottom className={classes.title}>
          Do you have any special instructions for our washers?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Special Instructions"
              fullWidth
              multiline
              helperText={`${this.state.charCount}/200`}
              variant="outlined"
              value={washerPreferences}
              onChange={(event) => {
                handleInputChange("washerPreferences", event.target.value);
                this.handleCharCount(event.target.value);
              }}
              className={classes.input}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Preferences.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(preferencesStyles)(Preferences);
