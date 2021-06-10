import React, { Component } from "react";
import {
  Grid,
  Typography,
  withStyles,
  TextField,
  Icon,
  Box,
} from "@material-ui/core";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import PlacesAutocomplete from "./components/PlacesAutocomplete";
import PropTypes from "prop-types";
import addressStyles from "../../../../../../styles/User/Dashboard/components/NewOrder/components/addressStyles";

const apiKEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
  require("../../../../../../config").google.mapsKEY;

const libraries = ["places"];

class Address extends Component {
  state = { charCount: 0 };

  renderMarker = () => {
    const { renderMarker, center } = this.props;

    if (renderMarker) {
      return (
        <Marker
          position={{
            lat: center.lat,
            lng: center.lng,
          }}
          style={{
            textAlign: "center",
            transform: "translate(-50%, -50%)",
            position: "absolute",
          }}
          icon="/images/NewOrder/Marker.png"
        />
      );
    }
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
    const {
      classes,
      center,
      zoom,
      handleInputChange,
      handleAddressSelect,
      addressPreferences,
      address,
    } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          What's your address?
        </Typography>
        <LoadScript googleMapsApiKey={apiKEY} libraries={libraries}>
          <Box
            bgcolor="background.paper"
            borderColor="grey.400"
            border={1}
            style={{ marginBottom: 20 }}
          >
            <GoogleMap
              mapContainerStyle={{ height: "40vh", width: "100%" }}
              center={center}
              zoom={zoom}
            >
              {this.renderMarker()}
            </GoogleMap>
          </Box>
          <Grid container>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <PlacesAutocomplete
                  address={address}
                  handleInputChange={handleInputChange}
                  handleAddressSelect={handleAddressSelect}
                  addressClasses={classes}
                />
              </div>
            </Grid>
          </Grid>
          <Typography variant="h5" gutterBottom className={classes.title}>
            Do you have any special instructions for our drivers? (ex: building
            number, unit, directions, etc.)
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                label="Special Instructions"
                fullWidth
                multiline
                variant="outlined"
                helperText={`${this.state.charCount}/200`}
                value={addressPreferences}
                onChange={(event) => {
                  handleInputChange("addressPreferences", event.target.value);
                  this.handleCharCount(event.target.value);
                }}
                className={classes.input}
              />
            </Grid>
          </Grid>
        </LoadScript>
      </React.Fragment>
    );
  }
}

Address.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(addressStyles)(Address);
