import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  withStyles,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Grid,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import CheckIcon from "@material-ui/icons/Check";
import RoomIcon from "@material-ui/icons/Room";
import LocalDrinkIcon from "@material-ui/icons/LocalDrink";
import progressBarStyles from "../../../../../styles/User/Dashboard/components/OrderStatus/components/progressBarStyles";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      // backgroundImage:
      //   "linear-gradient( 95deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
      backgroundColor: "#01C9E1",
    },
  },
  completed: {
    "& $line": {
      // backgroundImage:
      //   "linear-gradient( 95deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
      backgroundColor: "#01C9E1",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    // backgroundImage:
    //   "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    backgroundColor: "#01C9E1",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    // backgroundImage:
    //   "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    backgroundColor: "#01C9E1",
  },
});

const ColorlibStepIcon = (props) => {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <AssignmentTurnedInIcon />,
    2: <DirectionsCarIcon />,
    3: <RoomIcon />,
    4: <LocalDrinkIcon />,
    5: <DirectionsCarIcon />,
    6: <CheckIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
};

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = [
  "Order placed",
  "Picked up by driver",
  "Dropped off to washer",
  "Done washing",
  "Picked up from washer",
  "Delivered",
];

class ProgressBar extends Component {
  renderStep = (status) => {
    if (status === 0 || status === 1) {
      return 0;
    } else {
      return status - 1;
    }
  };

  render() {
    const { classes, status } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Stepper
            alternativeLabel
            activeStep={this.renderStep(status)}
            connector={<ColorlibConnector />}
            style={{ backgroundColor: "transparent" }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <div className={classes.secondaryStepper}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <ColorlibStepIcon active icon={this.renderStep(status) + 1} />
            </Grid>
            <Grid item>
              <Typography variant="h4" className={classes.secondaryStepText}>
                {steps[this.renderStep(status)]}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

ProgressBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(progressBarStyles)(ProgressBar);
