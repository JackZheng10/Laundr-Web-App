import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";

//todo: detect when user stops typing, and then update the map? in addition to selection and clearing updates?
//so when they update the map on select, but type new address w/o selecting, it doesnt show the old selection

const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

const PlacesAutocomplete = (props) => {
  const {
    address,
    handleInputChange,
    handleAddressSelect,
    addressClasses,
  } = props;

  const classes = useStyles();
  const [options, setOptions] = React.useState([]);

  const handleChange = (event) => {
    handleInputChange("address", event.target.value);
  };

  const handleAutocompleteChange = (event, value, reason) => {
    if (reason === "select-option") {
      //console.log(value);
      handleAddressSelect(value.description);
    } else if (reason === "clear") {
      //value is null if cleared
      console.log(value || "");
      handleAddressSelect("");
    }
  };

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (address === "") {
      setOptions([]);
      return undefined;
    }

    fetch({ input: address }, (results) => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [address, fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      style={{ width: "100%" }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      noOptionsText={"Type to search for a location"}
      // filterOptions={(x) => x}
      options={options}
      inputValue={address}
      autoComplete
      includeInputInList
      freeSolo
      onChange={handleAutocompleteChange}
      getOptionSelected={(option, value) =>
        option.description === value.description
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Address"
          variant="outlined"
          fullWidth
          // value={address}
          onChange={handleChange}
          className={addressClasses.input}
        />
      )}
      renderOption={(option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon
                className={classes.icon}
                style={{ color: "rgb(1, 201, 226)" }}
              />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}
              <Typography variant="body2">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default PlacesAutocomplete;
