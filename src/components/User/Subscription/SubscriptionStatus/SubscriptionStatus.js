import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Typography,
  Button,
  Card,
  CardHeader,
  Divider,
  CardContent,
  CardActions,
} from "@material-ui/core";
import { PieChart, Pie, Sector, Cell } from "recharts";
import { getCurrentUser, updateToken } from "../../../../helpers/session";
import { caughtError, showConsoleError } from "../../../../helpers/errors";
import { withRouter } from "next/router";
import LoadingButton from "../../../other/LoadingButton";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "axios";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import MainAppContext from "../../../../contexts/MainAppContext";
import subscriptionStatusStyles from "../../../../styles/User/Subscription/components/SubscriptionStatus/subscriptionStatusStyles";

//todo: responsive

const moment = require("moment");

class SubscriptionStatus extends Component {
  static contextType = MainAppContext;

  renderPeriod = (date) => {
    if (date === "N/A") {
      return "N/A";
    } else {
      return moment(date).format("MM/DD");
    }
  };

  handleManageSub = async () => {
    try {
      const response = await axios.post(
        "/api/stripe/createSelfPortal",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        window.open(response.data.message, "_self");
      } else {
        if (response.data.redirect) {
          this.props.router.push(response.data.message);
        } else {
          this.context.showAlert(response.data.message);
        }
      }
    } catch (error) {
      showConsoleError("creating self service portal", error);
      this.context.showAlert(
        caughtError("creating self service portal", error, 99)
      );
    }
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

  getLbsData = (subscription) => {
    const maxLbs = this.getMaxLbs(subscription);
    const lbsLeft = subscription.lbsLeft;

    return [
      { value: lbsLeft, color: "#01c9e1", opacity: 1 },
      { value: maxLbs - lbsLeft, color: "#828282", opacity: 0.2 },
    ];
  };

  render() {
    const { classes, currentUser } = this.props;

    return (
      <React.Fragment>
        <Grid item style={{ marginBottom: 10, position: "relative" }}>
          <div className={classes.infoCard}>
            <Typography variant="h2" style={{ color: "#01c9e1" }} gutterBottom>
              Current Plan: {currentUser.subscription.plan}
            </Typography>
            {/* <CardHeader
              title={`Current Plan: ${currentUser.subscription.plan}`}
              titleTypographyProps={{
                variant: "h2",
                style: {
                  color: "#01c9e1",
                },
              }}
            /> */}
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: -60,
              }}
            >
              <PieChart
                width={310}
                height={400}
                // style={{
                //   position: "relative",
                // }}
              >
                <Pie
                  data={this.getLbsData(currentUser.subscription)}
                  innerRadius={130}
                  outerRadius={150}
                  paddingAngle={1}
                  startAngle={180}
                  endAngle={-180}
                >
                  {this.getLbsData(currentUser.subscription).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{ opacity: entry.opacity }}
                      />
                    )
                  )}
                </Pie>
              </PieChart>
              <div
                style={{
                  top: "60%",
                  left: "28%",
                  position: "absolute",
                }}
              >
                <Typography variant="h3">Pounds Left</Typography>
              </div>
              <div
                style={{
                  top: "23%",
                  left: "14%",
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
                  top: "70%",
                  left: "35%",
                  position: "absolute",
                }}
              >
                <Typography variant="h1" style={{ color: "#01c9e1" }}>
                  {`${currentUser.subscription.lbsLeft}/${this.getMaxLbs(
                    currentUser.subscription
                  )}`}
                </Typography>
              </div>
            </CardContent>
          </div>
        </Grid>
        <Grid item>
          <Card className={classes.subInfoCard} elevation={10}>
            <CardHeader
              title="Subscription Information"
              titleTypographyProps={{
                variant: "h4",
                style: {
                  color: "white",
                },
              }}
              className={classes.cardHeader}
            />
            <Divider />
            <CardContent>
              <Typography
                variant="h5"
                style={{
                  fontWeight: 600,
                  color: "#01C9E1",
                }}
              >
                <PlayCircleOutlineIcon
                  fontSize="small"
                  style={{ marginBottom: -4 }}
                />{" "}
                Period Start
              </Typography>
              <Typography variant="h6">
                {this.renderPeriod(currentUser.subscription.periodStart)}
              </Typography>
              <Typography
                variant="h5"
                style={{
                  fontWeight: 600,
                  color: "#01C9E1",
                }}
              >
                <HighlightOffIcon
                  fontSize="small"
                  style={{ marginBottom: -4 }}
                />{" "}
                Period End
              </Typography>
              <Typography variant="h6">
                {this.renderPeriod(currentUser.subscription.periodEnd)}
              </Typography>
            </CardContent>
            <Divider />
            <CardActions
              style={{ justifyContent: "center" }}
              className={classes.cardHeader}
            >
              <LoadingButton
                size="medium"
                variant="contained"
                className={classes.mainButton}
                onClick={this.handleManageSub}
              >
                Manage
              </LoadingButton>
            </CardActions>
          </Card>
        </Grid>
      </React.Fragment>
    );
  }
}

SubscriptionStatus.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(subscriptionStatusStyles)
)(SubscriptionStatus);
