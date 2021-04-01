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
    } = this.props;

    const timeAvailability = getTimeAvailability();
    const todayNotAvailable = timeAvailability.todayNotAvailable;
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
                  <Typography
                    variant="body1"
                    style={{ color: "white", textAlign: "center" }}
                  >
                    Sorry! Our last pickup window today has passed. Please
                    choose a time for tomorrow.
                  </Typography>
                }
                arrow
                enterTouchDelay={100}
                leaveTouchDelay={5000}
              >
                <div>
                  <Button
                    disabled
                    variant="contained"
                    style={{ backgroundColor: "#d5d5d5", color: "white" }}
                    fullWidth
                    size="large"
                    startIcon={<CalendarTodayIcon />}
                  >
                    Today: {today}
                  </Button>
                </div>
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
                  disabled={!todaySelected && !tomorrowSelected}
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
                {!todaySelected && !tomorrowSelected && (
                  <FormHelperText>*Please select a date first.</FormHelperText>
                )}
              </FormControl>
            </ThemeProvider>
            <TooltipButton
              icon={true}
              style={{ marginTop: 20, marginLeft: 5 }}
              text="Operating times are 10 AM to 8 PM, Monday to Friday. You'll be able to schedule a delivery time after your clothes are weighed by the driver."
            />
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
