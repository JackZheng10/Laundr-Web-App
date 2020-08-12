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

class Pricing extends Component {
  render() {
    const { classes, loads } = this.props;

    return (
      <React.Fragment>
        <Typography component="h1" variant="h6" gutterBottom>
          About how many loads of laundry do you have?
        </Typography>
        <Slider
          defaultValue={loads}
          valueLabelDisplay="auto"
          step={0.5}
          marks
          min={0.5}
          max={5}
          style={{ width: 300 }}
          /*onChange and value from NewOrder*/
        />
        <div className={classes.layout}>
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
        </div>
      </React.Fragment>
    );
  }
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(pricingStyles)(Pricing);
