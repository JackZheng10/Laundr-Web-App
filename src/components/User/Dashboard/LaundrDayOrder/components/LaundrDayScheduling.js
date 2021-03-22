import React, { Component } from "react";
import {
  Grid,
  Typography,
  Button,
  withStyles,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  FormHelperText,
  ButtonGroup
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import PropTypes from "prop-types";
import TooltipButton from "../../../../Driver/OrderTable/components/TooltipButton";
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
  state = { openTime: false };

  render() {
    const {
      classes,
      todaySelected,
      today,
      tomorrowSelected,
      tomorrow,
      handleInputChange,
      getTimeAvailability,
      selectValue,
      laundrDayOfWeek,
      recurringPeriod
    } = this.props;

    const timeAvailability = getTimeAvailability();
    const availableTimes = timeAvailability.availableTimes;

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
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
              <ButtonGroup variant="contained" style={{ backgroundColor: "#d5d5d5", color: "white" }}> 
                 <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", "Sunday");
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === "Sunday" 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  S
                </Button>
                <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", "Monday");
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === "Monday" 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  M
                </Button>
                <Button
                    onClick={() => {
                      handleInputChange("laundrDayOfWeek", "Tuesday");
                    }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === "Tuesday" 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  T
                </Button>
                <Button
                 onClick={() => {
                  handleInputChange("laundrDayOfWeek", "Wednesday");
                }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === "Wednesday" 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  W
                </Button>
                <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", "Thursday");
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === "Thursday" 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  TH
                </Button>
                <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", "Friday");
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === "Friday" 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  F
                </Button>
                <Button
                  onClick={() => {
                    handleInputChange("laundrDayOfWeek", "Saturday");
                  }}
                  variant="contained"
                  style={
                    laundrDayOfWeek === "Saturday" 
                      ? { backgroundColor: "#01c9e1", color: "white" }
                      : { backgroundColor: "white", color: "#01c9e1" }
                  }
                  fullWidth
                >
                  S
                </Button>
              </ButtonGroup>
          </Grid>
        </Grid>
        <Typography variant="h5" className={classes.title}>
          What's your preferred pickup time?
          {/* <TooltipButton
            icon={true}
            style={{ marginTop: -8, marginBottom: -5 }}
            text="Operating times are 10 AM to 8 PM, Monday to Friday. You will be able to schedule a delivery time after your clothes are weighed by the driver."
          /> */}
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
          {/* <Grid item style={{ marginLeft: 5 }}>
            <TooltipButton
              icon={true}
              style={{ marginTop: -8, marginBottom: -5 }}
              text="Operating times are 10 AM to 8 PM, Monday to Friday. You'll be able to schedule a delivery time after your clothes are weighed by the driver."
            />
          </Grid> */}
        </Grid>
      </React.Fragment>
    );
  }
}

Scheduling.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(schedulingStyles)(Scheduling);
