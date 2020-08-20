import React, { Component } from "react";
import {
  Grid,
  Typography,
  Button,
  withStyles,
  Slider,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import PropTypes from "prop-types";
import pricingStyles from "../../../../../styles/User/Dashboard/components/NewOrder/components/pricingStyles";

const CustomSlider = withStyles({
  root: {
    color: "#01c9e1",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  track: {
    height: 8,
    borderRadius: 2,
  },
  rail: {
    height: 8,
    borderRadius: 2,
    paddingRight: 2,
  },
  markLabel: {
    marginTop: 5,
    fontWeight: "bold",
  },
})(Slider);

const marks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 1.5,
    label: "1.5",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 2.5,
    label: "2.5",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 3.5,
    label: "3.5",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 4.5,
    label: "4.5",
  },
  {
    value: 5,
    label: "5",
  },
];

class Pricing extends Component {
  render() {
    const { classes, loads, handleInputChange } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          About how many loads of laundry do you have?
        </Typography>
        <CustomSlider
          defaultValue={loads}
          valueLabelDisplay="off"
          step={0.5}
          min={1}
          max={5}
          marks={marks}
          onChange={(event, value) => {
            handleInputChange("loads", value);
          }}
        />
        {/*card for change based on load size, prob will be unused in favor of different graphic*/}
        {/* <div className={classes.layout}>
          <Card className={classes.root} elevation={10}>
            <CardContent className={classes.cardContent}>
              <Grid container justify="center">
                <img
                  src="/images/NewOrder/OneLoad.png"
                  style={{ height: 150 }}
                />
              </Grid>
            </CardContent>
          </Card>
        </div> */}
      </React.Fragment>
    );
  }
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(pricingStyles)(Pricing);
