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
} from "@material-ui/core";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import schedulingStyles from "../../../../../styles/User/Dashboard/components/NewOrder/components/schedulingStyles";

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
      todaySelected,
      today,
      tomorrowSelected,
      tomorrow,
      rawTime,
      handleInputChange,
      getTimeAvailability,
    } = this.props;

    let timeAvailability = getTimeAvailability();
    let todayNotAvailable = timeAvailability.todayNotAvailable;
    let availableTimes = timeAvailability.availableTimes;

    const handleTimeSelect = (event) => {
      let index = event.target.value;
      handleInputChange("time", {
        time: availableTimes[index].time,
        string: availableTimes[index].string,
      });
    };

    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          What day would you like your order to be picked up?
        </Typography>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            {todayNotAvailable && (
              <Tooltip
                title={
                  <React.Fragment>
                    {"Pickup today is not available after 8 PM."}
                  </React.Fragment>
                }
                arrow
              >
                <span>
                  <Button
                    disabled="true"
                    variant="contained"
                    style={{ backgroundColor: "#d5d5d5", color: "white" }}
                    fullWidth
                    size="large"
                    startIcon={<CalendarTodayIcon />}
                  >
                    Today: {today}
                  </Button>
                </span>
              </Tooltip>
            )}
            {!todayNotAvailable && (
              <Button
                disabled={todaySelected}
                onClick={() => {
                  handleInputChange("today");
                }}
                variant="contained"
                style={
                  todaySelected
                    ? { backgroundColor: "#01c9e1", color: "white" }
                    : { backgroundColor: "white", color: "#01c9e1" }
                }
                fullWidth
                size="large"
                startIcon={<CalendarTodayIcon />}
              >
                Today: {today}
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={tomorrowSelected}
              onClick={() => {
                handleInputChange("tomorrow");
              }}
              variant="contained"
              style={
                tomorrowSelected
                  ? { backgroundColor: "#01c9e1", color: "white" }
                  : { backgroundColor: "white", color: "#01c9e1" }
              }
              fullWidth
              size="large"
              startIcon={<CalendarTodayIcon />}
            >
              Tomorrow: {tomorrow}
            </Button>
          </Grid>
        </Grid>
        <Typography variant="h5" className={classes.title}>
          What's your preferred pickup time?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <ThemeProvider theme={timeTheme}>
              <FormControl className={classes.formControl}>
                <Select
                  labelId="times"
                  displayEmpty
                  onChange={handleTimeSelect}
                >
                  {availableTimes.map((time, index) => {
                    return <MenuItem value={index}>{time.string}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </ThemeProvider>
          </Grid>
        </Grid>
        <Typography variant="h6">Please note:</Typography>
        <Typography variant="h6">
          •Operating times are 10 AM to 7 PM, Monday to Friday
        </Typography>
        <Typography variant="h6" gutterBottom>
          •You will be able to schedule a delivery time after your clothes are
          weighed by the driver
        </Typography>
      </React.Fragment>
    );
  }
}

Scheduling.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(schedulingStyles)(Scheduling);
