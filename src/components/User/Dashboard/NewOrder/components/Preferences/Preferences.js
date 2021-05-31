import React, { Component } from "react";
import { Grid, Typography, TextField, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import preferencesStyles from "../../../../../../styles/User/Dashboard/components/NewOrder/components/Preferences/preferencesStyles";
import PreferenceCard from "./components/PreferenceCard";

class Preferences extends Component {
  state = {
    charCount: 0,
  };

  handleCharCount = (text) => {
    const limit = 200;
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
        <Grid
          container
          spacing={3}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <PreferenceCard
              title="Scented (Free)"
              info="Unscented detergent is hypoallergenic."
              unselectedImage="/images/NewOrder/ScentedUnselected.png"
              selectedImage="/images/NewOrder/ScentedSelected.png"
              handleInputChange={(selected) => {
                handleInputChange("scented", selected);
              }}
            />
          </Grid>
          <Grid item>
            <PreferenceCard
              title="Low Temp. Dry (Free)"
              info="A gentle alternative to hang drying. May cause thick fabrics to be slightly damp when returned."
              unselectedImage="/images/NewOrder/LowTempUnselected.png"
              selectedImage="/images/NewOrder/LowTempSelected.png"
              handleInputChange={(selected) => {
                handleInputChange("lowTemp", selected);
              }}
            />
          </Grid>
          <Grid item>
            <PreferenceCard
              title="Separate (+$5)"
              info="Separated clothing is divided into whites and colors. Whites will be bleached."
              unselectedImage="/images/NewOrder/SeparateUnselected.png"
              selectedImage="/images/NewOrder/SeparateSelected.png"
              handleInputChange={(selected) => {
                handleInputChange("separate", selected);
              }}
            />
          </Grid>
          <Grid item>
            <PreferenceCard
              title="Comforter (+$10)"
              info="Large comforters require extra care and a longer dry cycle. Items containing real or synthetic down should not be sent."
              unselectedImage="/images/NewOrder/TowelsUnselected.png"
              selectedImage="/images/NewOrder/TowelsSelected.png"
              handleInputChange={(selected) => {
                handleInputChange("comforter", selected);
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
