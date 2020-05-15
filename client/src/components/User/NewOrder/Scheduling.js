import React, { Component } from "react";
import {
  Grid,
  Typography,
  Button,
  withStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import schedulingStyles from "../../../styles/User/NewOrder/schedulingStyles";

class Scheduling extends Component {
  constructor(props) {
    super(props);

    this.state = { openTime: false };
  }
  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Typography component="h1" variant="h6" gutterBottom>
          What day would you like your order to be picked up?
        </Typography>
        <Dialog
          open={this.state.openTime}
          onClose={() => {
            this.setState({ openTime: false });
          }}
          container={() => document.getElementById("schedulingContainer")}
          aria-labelledby="form-dialog-title"
          style={{ position: "absolute" }}
          BackdropProps={{
            style: {
              position: "absolute",
              backgroundColor: "transparent",
            },
          }}
        >
          <DialogContent>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <TimePicker
                margin="normal"
                variant="static"
                id="time-picker"
                label="Click to select a time"
                onChange={(value) => {
                  this.props.handleTimeChange(value);
                }}
                helperText="*Must be at least 1 hour in advance"
                value={this.props.rawTime}
                PopoverProps={{
                  anchorEl: document.getElementById("orderStatusContainer"),
                }}
              />
            </MuiPickersUtilsProvider>
          </DialogContent>
        </Dialog>
        <Grid
          container
          spacing={3}
          className={classes.container}
          id="schedulingContainer"
        >
          <Grid item xs={12} sm={6}>
            <Button
              disabled={this.props.todaySelected}
              onClick={this.props.handleTodayChange}
              style={{
                backgroundImage:
                  "linear-gradient( 136deg, rgb(102, 255, 255) 0%, rgb(0, 153, 255) 50%, rgb(0, 51, 204) 100%)",
              }}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<CalendarTodayIcon />}
            >
              Today: {this.props.today}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={this.props.tomorrowSelected}
              onClick={this.props.handleTomorrowChange}
              style={{
                backgroundImage:
                  "linear-gradient( 136deg, rgb(102, 255, 255) 0%, rgb(0, 153, 255) 50%, rgb(0, 51, 204) 100%)",
              }}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<CalendarTodayIcon />}
            >
              Tomorrow: {this.props.tomorrow}
            </Button>
          </Grid>
        </Grid>
        <Typography
          component="h1"
          variant="h6"
          gutterBottom
          className={classes.title}
        >
          What's your preferred pickup time?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Click to select a time"
              helperText="*Must be at least 1 hour in advance"
              InputProps={{
                readOnly: true,
              }}
              value={this.props.formattedTime}
              onClick={() => {
                this.setState({ openTime: true });
              }}
            />
            <br />
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
