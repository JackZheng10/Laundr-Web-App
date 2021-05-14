import React, { Component } from "react";
import {
  Grid,
  Typography,
  Button,
  withStyles,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  ButtonGroup
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import TooltipButton from "../../../../other/TooltipButton";
import schedulingStyles from "../../../../../styles/User/Dashboard/components/NewOrder/components/schedulingStyles";

//REMEMBER: moment objects are mutable. creating one and then reusing it will change the original object (ex: if you do obj.add)

const timeTheme = createMuiTheme({
  // overrides: {
  //   MuiDialogActions: {
  //     root: {
  //       display: "none",
  //     },
  //   },
  // },
  palette: {
    primary: {
      main: "rgb(1, 203, 225)",
    },
  },
});

class Scheduling extends Component {
  render() {
    const {
      classes,
      handleInputChange,
      getTimeAvailability,
      selectValue,
      laundrDayOfWeek,
      recurringPeriod,
      nextDayOfWeek
    } = this.props;

    const timeAvailability = getTimeAvailability();
    const availableTimes = timeAvailability.availableTimes;
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleTimeSelect = (event) => {
      const index = event.target.value;

      handleInputChange("time", {
        lowerBound: availableTimes[index].lowerBound,
        upperBound: availableTimes[index].upperBound,
        string: availableTimes[index].string,
        selectValue: index,
      });
    };

    const handleRecurringPeriodSelect = (event) => {
      handleInputChange("recurringPeriod", event.target.value);
    }

    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          What day would you like your order to be picked up?
        </Typography>
        <Grid container direction='column' spacing={2} className={classes.container}>
          <Grid item xs={12} sm={6}>
              <ButtonGroup variant="contained" style={{ backgroundColor: "#d5d5d5", color: "white" }}> 
                 <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", 0);
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === 0 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  S
                </Button>
                <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", 1);
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === 1 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  M
                </Button>
                <Button
                    onClick={() => {
                      handleInputChange("laundrDayOfWeek", 2);
                    }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === 2 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  T
                </Button>
                <Button
                 onClick={() => {
                  handleInputChange("laundrDayOfWeek", 3);
                }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === 3
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  W
                </Button>
                <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", 4);
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === 4
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  TH
                </Button>
                <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", 5);
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === 5
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  F
                </Button>
                <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", 6);
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === 6 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  S
                </Button>
              </ButtonGroup>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" gutterBottom>
              Your first Laundr Day is {daysOfWeek[laundrDayOfWeek]}, {nextDayOfWeek(laundrDayOfWeek)}.
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="h5" className={classes.title}>
          What's your preferred pickup time?
        </Typography>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item>
            <ThemeProvider theme={timeTheme}>
              <FormControl className={classes.formControl}>
                <Select
                  labelId="times"
                  displayEmpty
                  variant="outlined"
                  value={selectValue}
                  onChange={handleTimeSelect}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {availableTimes.map((time, index) => {
                    return (
                      <MenuItem value={index} key={index}>
                        {time.string}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>*Please select a day of the week first.</FormHelperText>
              </FormControl>
            </ThemeProvider>
            <TooltipButton
              icon={true}
              style={{ marginTop: 20, marginLeft: 5 }}
              text="Operating times are 10 AM to 8 PM, Monday to Friday. You'll be able to schedule a delivery time after your clothes are weighed by the driver."
            />
              <div>
                <Typography variant="h5" className={classes.title}>
                  How often do you want this order placed?
                </Typography>
                <ThemeProvider theme={timeTheme}>
              <FormControl className={classes.formControl}>
                <Select
                  labelId="recurringPeriod"
                  variant="outlined"
                  value={recurringPeriod}
                  onChange={handleRecurringPeriodSelect}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  <MenuItem value={"Every 1 week"}>
                    Every 1 week
                  </MenuItem>
                  <MenuItem value={"Every 2 weeks"}>
                    Every 2 weeks
                  </MenuItem>
                  <MenuItem value={"Every 1 month"}>
                    Every 1 month
                  </MenuItem>
                </Select>
              </FormControl>
            </ThemeProvider>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Scheduling.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(schedulingStyles)(Scheduling);
