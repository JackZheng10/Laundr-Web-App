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
  List,
  Collapse,
  ListItem,
  Divider,
  ListItemText,
} from "@material-ui/core";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";
import SubscriptionStatus from "../../../../User/Subscription/SubscriptionStatus/SubscriptionStatus";
import PropTypes from "prop-types";
import pricingStyles from "../../../../../styles/User/Dashboard/components/NewOrder/components/pricingStyles";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  require("../../../../../../src/config").baseURL;

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
    label: "",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 2.5,
    label: "",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 3.5,
    label: "",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 4.5,
    label: "",
  },
  {
    value: 5,
    label: "5",
  },
];

class Pricing extends Component {
  renderPricingComponent = (classes) => {
    const { currentUser, loads } = this.props;

    const priceMultiplier =
      currentUser.subscription.status === "active" &&
      currentUser.subscription.plan === "Family"
        ? 1.2
        : 1.5;

    if (
      currentUser.subscription.status != "active" &&
      currentUser.subscription.lbsLeft <= 0
    ) {
      return (
        <Grid container direction="row" justify="center" alignItems="center">
          <Card style={{ marginTop: 25 }} elevation={5}>
            <CardHeader
              title="Summary"
              titleTypographyProps={{
                variant: "h5",
                style: {
                  color: "white",
                },
              }}
              className={classes.cardHeader}
            />
            <CardContent className={classes.removePadding}>
              <Grid
                container
                direction="row"
                justify="center"
                spacing={2}
                alignItems="center"
              >
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                  >
                    <Grid item style={{ marginBottom: -5 }}>
                      <img
                        src={`/images/NewOrder/Bag${(loads - 0.1).toFixed(
                          0
                        )}.png`}
                        style={{ height: 100 }}
                      />
                    </Grid>
                    <Grid item style={{ marginBottom: 5 }}>
                      <Typography variant="overline">$1.50/lb</Typography>
                    </Grid>
                  </Grid>
                  <Typography variant="h5">
                    Estimated pounds: {loads * 18} lbs
                  </Typography>
                  <Typography variant="h5">
                    Estimated cost: ${(loads * 18 * priceMultiplier).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    className={classes.subPriceAdText}
                    href={"/user/subscription"}
                  >
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography variant="overline">
                          With a subscription:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h4">
                          ${(loads * 18 * 1.2).toFixed(2)} →
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="overline">
                          (est. ~$1.25/lb)
                        </Typography>
                      </Grid>
                    </Grid>
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      );
    } else {
      const lbsData = this.props.getLbsData();
      const overageData = lbsData[3];
      const maxLbs = this.props.getMaxLbs(currentUser.subscription);
      const estLbsLeft = lbsData[0].value;

      return (
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Card className={classes.subCard}>
              <CardHeader
                title="Subscription Pounds Summary"
                titleTypographyProps={{
                  variant: "h5",
                  style: {
                    color: "white",
                  },
                }}
                className={classes.cardHeader}
              />
              <CardContent className={classes.removePadding}>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid
                    item
                    style={{
                      position: "relative",
                      marginTop: -15,
                      marginBottom: -15,
                    }}
                  >
                    <PieChart width={265} height={265}>
                      <Pie
                        data={lbsData}
                        innerRadius={95}
                        outerRadius={115}
                        paddingAngle={1}
                        startAngle={180}
                        endAngle={-180}
                      >
                        {lbsData.slice(0, 3).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            style={{ opacity: entry.opacity }}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                    <div
                      style={{
                        top: "40%",
                        left: "20%",
                        position: "absolute",
                      }}
                    >
                      <Typography variant="h5">
                        Estimated Pounds Left
                      </Typography>
                    </div>
                    <div
                      style={{
                        top: "50%",
                        left: "3%",
                        position: "absolute",
                        width: 250,
                      }}
                    >
                      <Typography
                        variant="h2"
                        style={{ color: "#01c9e1", textAlign: "center" }}
                      >
                        {`${estLbsLeft}/${maxLbs}`}
                      </Typography>
                    </div>
                    {/* <div
                      style={{
                        top: "20%",
                        left: "31%",
                        position: "absolute",
                        width: 250,
                      }}
                    >
                      <img
                        src={`/images/NewOrder/Bag${(loads - 0.1).toFixed(
                          0
                        )}.png`}
                        style={{ height: 100 }}
                      />
                    </div> */}
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <Collapse in={overageData.overage} timeout="auto" unmountOnExit>
                <CardContent className={classes.removePadding}>
                  <React.Fragment>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ textAlign: "center" }}
                    >
                      Estimated overage pounds: {overageData.overageLbs}
                    </Typography>
                    <Typography variant="h5" style={{ textAlign: "center" }}>
                      Estimated overage charge: $
                      {(overageData.overageLbs * priceMultiplier).toFixed(2)}
                    </Typography>
                  </React.Fragment>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        </Grid>
      );
    }
  };
  render() {
    const { classes, loads, handleInputChange, currentUser } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          About how many bags of laundry do you have?
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
        {this.renderPricingComponent(classes)}
      </React.Fragment>
    );
  }
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(pricingStyles)(Pricing);
