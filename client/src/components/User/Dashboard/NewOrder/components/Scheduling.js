import React, { Component } from "react";
import { Grid, Typography, Button, withStyles } from "@material-ui/core";
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
      main: "rgb(0, 153, 255)",
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
      rawTime,
      handleInputChange,
    } = this.props;

    return (
      <React.Fragment>
        <Typography component="h1" variant="h6" gutterBottom>
          What day would you like your order to be picked up?
        </Typography>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
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
        <Typography component="h1" variant="h6" className={classes.title}>
          What's your preferred pickup time?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <ThemeProvider theme={timeTheme}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TimePicker
                  margin="normal"
                  variant="inline"
                  label="Click to select a time"
                  onChange={(value) => {
                    handleInputChange("time", value);
                  }}
                  helperText="*Must be at least 1 hour in advance"
                  value={rawTime}
                  onAccept={(value) => {
                    handleInputChange("time", value);
                  }}
                  PopoverProps={{
                    anchorOrigin: { vertical: "bottom", horizontal: "center" },
                    transformOrigin: { vertical: "bottom", horizontal: "left" },
                  }}
                />
              </MuiPickersUtilsProvider>
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
