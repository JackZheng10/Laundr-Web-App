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
import { getCurrentUser, updateToken } from "../../../../helpers/session";
import { caughtError, showConsoleError } from "../../../../helpers/errors";
import PropTypes from "prop-types";
import axios from "axios";
import ReactScoreIndicator from "react-score-indicator";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import MainAppContext from "../../../../contexts/MainAppContext";
import baseURL from "../../../../baseURL";
import subscriptionStatusStyles from "../../../../styles/User/Subscription/components/SubscriptionStatus/subscriptionStatusStyles";

const moment = require("moment");

const doughnutColors = [
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
];

class SubscriptionStatus extends Component {
  static contextType = MainAppContext;

  renderMaxLbs = () => {
    switch (this.props.subscription.plan) {
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

  renderPeriod = (date) => {
    if (date === "N/A") {
      return "N/A";
    } else {
      return moment(date).format("MM/DD");
    }
  };

  handleManageSub = async () => {
    try {
      const currentUser = getCurrentUser();

      const response = await axios.post(baseURL + "/stripe/createSelfPortal", {
        customerID: currentUser.stripe.customerID,
      });

      if (response.data.success) {
        window.open(response.data.message, "_self");
      } else {
        this.context.showAlert(response.data.message);
      }
    } catch (error) {
      showConsoleError("creating self service portal", error);
      this.context.showAlert(
        caughtError("creating self service portal", error, 99)
      );
    }
  };

  render() {
    const { classes, subscription } = this.props;

    return (
      <React.Fragment>
        <Grid item style={{ marginBottom: 20 }}>
          <div className={classes.infoCard}>
            <CardHeader
              title={`Current Plan: ${subscription.plan}`}
              titleTypographyProps={{
                variant: "h2",
                style: {
                  color: "#01c9e1",
                },
              }}
            />
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ReactScoreIndicator
                value={subscription.lbsLeft}
                maxValue={this.renderMaxLbs()}
                width={290}
                lineGap={1}
                lineWidth={15}
                fadedOpacity={20}
                stepsColors={doughnutColors}
              />
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  style={{
                    top: 175,
                    left: -210,
                    position: "absolute",
                  }}
                >
                  <Typography variant="h3">Pounds Left</Typography>
                </div>
                <div
                  style={{
                    top: 40,
                    left: -250,
                    position: "absolute",
                  }}
                >
                  <img
                    style={{ height: 133, width: 214 }}
                    src="/images/Subscription/Box.png"
                    alt="Box"
                  />
                </div>
              </div>
            </CardContent>
          </div>
        </Grid>
        <Grid item>
          <Card className={classes.subInfoCard}>
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
                {this.renderPeriod(subscription.periodStart)}
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
                {this.renderPeriod(subscription.periodEnd)}
              </Typography>
            </CardContent>
            <Divider />
            <CardActions
              style={{ justifyContent: "center" }}
              className={classes.cardHeader}
            >
              <Button
                size="medium"
                variant="contained"
                className={classes.mainButton}
                onClick={this.handleManageSub}
              >
                Manage
              </Button>
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

export default withStyles(subscriptionStatusStyles)(SubscriptionStatus);
