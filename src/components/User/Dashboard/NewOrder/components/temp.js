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
  ListItem,
  Link,
  Paper,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { PieChart, Pie, Sector, Cell } from "recharts";
import pricingStyles from "../../../../../styles/User/Dashboard/components/NewOrder/components/pricingStyles";

const CustomSlider = withStyles({
  root: {
    color: "#01c9e1",
    height: 8,
    width: 425,
    marginLeft: 20,
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
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
];

//CHANGE THE SUBSCRIPTION LINK!!!!!!
class Pricing extends Component {
  getLbsData = (subscription) => {
    const maxLbs = this.getMaxLbs(subscription);
    const lbsLeft = subscription.lbsLeft;

    return [
      { value: lbsLeft, color: "#01c9e1", opacity: 1 },
      { value: maxLbs, color: "#828282", opacity: 0.2 },
    ];
  };

  getMaxLbs = (subscription) => {
    switch (subscription.plan) {
      case "Student":
        return 40;

      case "Standard":
        return 48;

      case "Plus":
        return 66;

      case "Family":
        return 84;

      default:
        return 0;
    }
  };

  render() {
    const { classes, loads, handleInputChange, getCurrentUser } = this.props;
    let subscription;
    if (getCurrentUser() != null) {
      subscription = getCurrentUser().subscription;
    }

    return (
      <React.Fragment>
        <Typography variant="h5" className={classes.subheader}>
          About how many bags of laundry do you have?
        </Typography>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <img
              src={`/images/NewOrder/Bag${loads}.png`}
              style={{ height: 100 }}
            />
          </Grid>
          <Grid item>
            <CustomSlider
              defaultValue={loads}
              valueLabelDisplay="off"
              step={1}
              min={1}
              max={5}
              marks={marks}
              onChange={(event, value) => {
                handleInputChange("loads", value);
              }}
            />
          </Grid>
        </Grid>
        {/* card for change based on load size, prob will be unused in favor of different graphic*/}
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
        </div>  */}
        {(subscription != null && subscription.status == "N/A") ||
          (subscription.status == "cancelled" && (
            <div>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Card className={classes.summary} elevation={5}>
                  <CardHeader
                    // avatar={
                    //   <ConfirmationNumberIcon
                    //     fontSize="small"
                    //     style={{ marginBottom: -4 }}
                    //     htmlColor="white"
                    //   />
                    // }
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
                    <Grid container direction="row" justify="center">
                      <Grid item>
                        <List>
                          <ListItem>
                            <Typography variant="h4">
                              Estimated Pounds: {loads * 18} lbs.
                            </Typography>
                          </ListItem>
                          <ListItem>
                            <Typography variant="h4">
                              Estimated Cost: ${(loads * 18 * 1.5).toFixed(2)}
                            </Typography>
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          className={classes.subPriceAdText}
                          href="http://localhost:3000/user/subscription"
                        >
                          <Grid
                            container
                            direction="column"
                            justify="center"
                            spacing={3}
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
                          </Grid>
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </div>
          ))}
        {subscription != null && subscription.status == "active" && (
          <div>
            <Grid container direction="row" justify="center">
              <Grid item>
                <div className={classes.infoCard}>
                  <CardContent
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: -80,
                    }}
                  >
                    <PieChart width={155} height={200}>
                      <Pie
                        data={this.getLbsData(subscription)}
                        innerRadius={130}
                        outerRadius={150}
                        paddingAngle={1}
                        startAngle={180}
                        endAngle={-180}
                      >
                        {this.getLbsData(subscription).map((entry, index) => (
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
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          top: 215,
                          left: -220,
                          position: "absolute",
                        }}
                      >
                        <Typography variant="h3">Pounds Left</Typography>
                      </div>
                      <div
                        style={{
                          top: 80,
                          left: -260,
                          position: "absolute",
                        }}
                      >
                        <img
                          style={{ height: 133, width: 214 }}
                          src="/images/Subscription/Box.png"
                          alt="Box"
                        />
                      </div>
                      <div
                        style={{
                          top: 260,
                          left: -190,
                          position: "absolute",
                        }}
                      >
                        {subscription.lbsLeft - loads * 18 >= 0 && (
                          <Typography variant="h1" style={{ color: "#01c9e1" }}>
                            {/*todo: fix centering of this based on the number*/}
                            {`${
                              subscription.lbsLeft - loads * 18
                            }/${this.getMaxLbs(subscription)}`}
                          </Typography>
                        )}
                        {subscription.lbsLeft - loads * 18 < 0 && (
                          <Typography variant="h1" style={{ color: "#01c9e1" }}>
                            {/*todo: fix centering of this based on the number*/}
                            {`0/${this.getMaxLbs(subscription)}`}
                          </Typography>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Card className={classes.summary} elevation={5}>
                    <CardHeader
                      // avatar={
                      //   <ConfirmationNumberIcon
                      //     fontSize="small"
                      //     style={{ marginBottom: -4 }}
                      //     htmlColor="white"
                      //   />
                      // }
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
                      <List>
                        <ListItem>
                          <Typography variant="h4">
                            Estimated Pounds: {loads * 18} lbs.
                          </Typography>
                        </ListItem>
                        <ListItem>
                          {subscription.lbsLeft - loads * 18 >= 0 && (
                            <Typography
                              variant="subtitle1"
                              style={{ fontSize: "20px" }}
                            >
                              Estimated Cost: $0.00
                            </Typography>
                          )}
                          {subscription.lbsLeft - loads * 18 < 0 &&
                            subscription.plan != "Family" && (
                              <Typography variant="h4">
                                Estimated Cost: $
                                {(
                                  (loads * 18 - subscription.lbsLeft) *
                                  1.5
                                ).toFixed(2)}
                              </Typography>
                            )}
                          {subscription.lbsLeft - loads * 18 < 0 &&
                            subscription.plan == "Family" && (
                              <Typography variant="h4">
                                Estimated Cost: $
                                {(
                                  (loads * 18 - subscription.lbsLeft) *
                                  1.2
                                ).toFixed(2)}
                              </Typography>
                            )}
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
      </React.Fragment>
    );
  }
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(pricingStyles)(Pricing);
