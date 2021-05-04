import React, { Component } from "react";
import {
  withStyles,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Tooltip,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  Fade,
} from "@material-ui/core";
import validator from "validator";
import TooltipButton from "../../../../other/TooltipButton";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import CreateIcon from "@material-ui/icons/Create";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SettingsIcon from "@material-ui/icons/Settings";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import DateRangeIcon from "@material-ui/icons/DateRange";
import PropTypes from "prop-types";
import reviewStyles from "../../../../../styles/User/Dashboard/components/NewOrder/components/reviewStyles";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
    maxWidth: 275,
    justifyContent: "center",
  },
  arrow: {
    color: theme.palette.common.grey,
  },
}))(Tooltip);

class Review extends Component {
  state = { openAddressPrefs: false, openWasherPrefs: false };

  handleAddressPrefsClose = () => {
    this.setState({
      openAddressPrefs: false,
    });
  };

  handleAddressPrefsOpen = () => {
    this.setState({
      openAddressPrefs: true,
    });
  };

  handleWasherPrefsClose = () => {
    this.setState({
      openWasherPrefs: false,
    });
  };

  handleWasherPrefsOpen = () => {
    this.setState({
      openWasherPrefs: true,
    });
  };

  renderPriceComponent = () => {
    const { currentUser, classes, loads, separate, comforter } = this.props;

    const priceMultiplier =
      currentUser.subscription.status === "active" &&
      currentUser.subscription.plan === "Family"
        ? 1.2
        : 1.5;
    const balance = parseFloat(this.props.balance.slice(1));
    const subtotal = loads * 18 * priceMultiplier;

    const getPrefsPrice = () => {
      return (separate ? 5 : 0) + (comforter ? 10 : 0);
    };

    if (
      currentUser.subscription.status != "active" &&
      currentUser.subscription.lbsLeft <= 0
    ) {
      const balanceDiscount =
        subtotal + getPrefsPrice() >= balance
          ? balance
          : subtotal + getPrefsPrice();

      return (
        <React.Fragment>
          <CardContent
            className={classes.removePadding}
            style={{ marginTop: -15, marginBottom: -15 }}
          >
            <List disablePadding>
              <ListItem>
                <ListItemText
                  primary={"Subtotal"}
                  secondary={`${loads * 18} lbs`}
                  primaryTypographyProps={{ variant: "h6" }}
                />
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </ListItem>
              {separate && (
                <ListItem>
                  <ListItemText
                    primary={"Separate"}
                    secondary={`Preference`}
                    primaryTypographyProps={{ variant: "h6" }}
                  />
                  <Typography variant="body1">$5.00</Typography>
                </ListItem>
              )}
              {comforter && (
                <ListItem>
                  <ListItemText
                    primary={"Comforter"}
                    secondary={`Preference`}
                    primaryTypographyProps={{ variant: "h6" }}
                  />
                  <Typography variant="body1">$10.00</Typography>
                </ListItem>
              )}
              {balance > 0 && balanceDiscount > 0 && (
                <ListItem>
                  <ListItemText
                    primary={"Credit"}
                    primaryTypographyProps={{ variant: "h6" }}
                  />

                  <Typography variant="body1">
                    - ${balanceDiscount.toFixed(2)}
                  </Typography>
                </ListItem>
              )}
            </List>
          </CardContent>
          <Divider />
          <CardContent className={classes.removePadding}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <Grid container justify="center">
                  <Typography variant="h4" style={{ fontWeight: 600 }}>
                    Total:&nbsp;
                  </Typography>
                  <Typography variant="h4" style={{ textAlign: "center" }}>
                    ${(subtotal - balanceDiscount + getPrefsPrice()).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="caption" align="left">
                  *Actual price determined on pickup
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </React.Fragment>
      );
    } else {
      const lbsData = this.props.getLbsData();
      const subLbsUsed = lbsData[1].value;
      const subLbsDiscount = subLbsUsed * priceMultiplier;
      const balanceDiscount =
        subtotal - subLbsDiscount + getPrefsPrice() >= balance
          ? balance
          : subtotal - subLbsDiscount + getPrefsPrice();

      return (
        <React.Fragment>
          <CardContent
            className={classes.removePadding}
            style={{ marginTop: -15, marginBottom: -15 }}
          >
            <List disablePadding>
              <ListItem>
                <ListItemText
                  primary={"Subtotal"}
                  secondary={`${loads * 18} lbs`}
                  primaryTypographyProps={{ variant: "h6" }}
                />
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </ListItem>
              {separate && (
                <ListItem>
                  <ListItemText
                    primary={"Separate"}
                    secondary={`Preference`}
                    primaryTypographyProps={{ variant: "h6" }}
                  />
                  <Typography variant="body1">$5.00</Typography>
                </ListItem>
              )}
              {comforter && (
                <ListItem>
                  <ListItemText
                    primary={"Comforter"}
                    secondary={`Preference`}
                    primaryTypographyProps={{ variant: "h6" }}
                  />
                  <Typography variant="body1">$10.00</Typography>
                </ListItem>
              )}
              {subLbsUsed > 0 && (
                <ListItem>
                  <ListItemText
                    primary={"Subscription Lbs"}
                    secondary={`${subLbsUsed.toFixed(2)} lbs`}
                    primaryTypographyProps={{ variant: "h6" }}
                  />

                  <Typography variant="body1">
                    - ${subLbsDiscount.toFixed(2)}
                  </Typography>
                </ListItem>
              )}
              {balance > 0 && balanceDiscount > 0 && (
                <ListItem>
                  <ListItemText
                    primary={"Credit"}
                    primaryTypographyProps={{ variant: "h6" }}
                  />

                  <Typography variant="body1">
                    - ${balanceDiscount.toFixed(2)}
                  </Typography>
                </ListItem>
              )}
            </List>
          </CardContent>
          <Divider />
          <CardContent className={classes.removePadding}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <Grid container justify="center">
                  <Typography variant="h4" style={{ fontWeight: 600 }}>
                    Total:&nbsp;
                  </Typography>
                  <Typography variant="h4" style={{ textAlign: "center" }}>
                    $
                    {(
                      subtotal -
                      subLbsDiscount -
                      balanceDiscount +
                      getPrefsPrice()
                    ).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </React.Fragment>
      );
    }
  };

  render() {
    const {
      classes,
      address,
      addressPreferences,
      pickupDate,
      pickupTime,
      washerPreferences,
      scented,
      lowTemp,
      separate,
      comforter,
      loads,
      currentUser,
    } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Summary
        </Typography>
        <Grid
          container
          spacing={1}
          direction="row"
          alignItems="flex-start"
          justify="space-evenly"
        >
          <Grid item>
            <Grid
              container
              spacing={1}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <Card className={classes.root} elevation={5}>
                  <CardHeader
                    avatar={
                      <HomeRoundedIcon
                        fontSize="small"
                        style={{ marginBottom: -4 }}
                        htmlColor="white"
                      />
                    }
                    title="Address"
                    titleTypographyProps={{
                      variant: "h5",
                      style: {
                        color: "white",
                      },
                    }}
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <Typography style={{ textAlign: "center", color: "black" }}>
                      {address}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardFooter}>
                    <TooltipButton
                      text={
                        validator.isEmpty(addressPreferences, {
                          ignore_whitespace: true,
                        })
                          ? "N/A"
                          : addressPreferences
                      }
                      className={classes.secondaryButton}
                      buttonText={"View Instructions"}
                      size="small"
                    />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item>
                <Card className={classes.root} elevation={5}>
                  <CardHeader
                    avatar={
                      <QueryBuilderIcon
                        fontSize="small"
                        style={{ marginBottom: -4 }}
                        htmlColor="white"
                      />
                    }
                    title="Pickup Info"
                    titleTypographyProps={{
                      variant: "h5",
                      style: {
                        color: "white",
                      },
                    }}
                    className={classes.cardHeader}
                  />
                  <CardContent className={classes.removePadding}>
                    <Grid container justify="center">
                      <Typography variant="body1" style={{ fontWeight: 600 }}>
                        Date:&nbsp;
                      </Typography>
                      <Typography style={{ textAlign: "center" }}>
                        {pickupDate}
                      </Typography>
                    </Grid>
                    <Grid container justify="center">
                      <Typography variant="body1" style={{ fontWeight: 600 }}>
                        Time:&nbsp;
                      </Typography>
                      <Typography style={{ textAlign: "center" }}>
                        {pickupTime}
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card className={classes.root} elevation={5}>
                  <CardHeader
                    avatar={
                      <SettingsIcon
                        fontSize="small"
                        style={{ marginBottom: -4 }}
                        htmlColor="white"
                      />
                    }
                    title="Preferences"
                    titleTypographyProps={{
                      variant: "h5",
                      style: {
                        color: "white",
                      },
                    }}
                    className={classes.cardHeader}
                  />
                  <CardContent className={classes.removePadding}>
                    <List dense className={classes.listRoot}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={
                              scented
                                ? "/images/NewOrder/ScentedSelectedCircle.png"
                                : "/images/NewOrder/ScentedUnselectedCircle.png"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Scented"
                          primaryTypographyProps={{
                            style: {
                              color: scented ? "black" : "grey",
                            },
                            variant: "body1",
                          }}
                        />
                        <ListItemSecondaryAction>
                          {scented ? (
                            <CheckCircleOutlineIcon
                              style={{ fill: "green" }}
                              edge="end"
                            />
                          ) : (
                            <NotInterestedIcon color="error" edge="end" />
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={
                              lowTemp
                                ? "/images/NewOrder/LowTempSelectedCircle.png"
                                : "/images/NewOrder/LowTempUnselectedCircle.png"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Low Temp. Dry"
                          primaryTypographyProps={{
                            style: {
                              color: lowTemp ? "black" : "grey",
                            },
                            variant: "body1",
                          }}
                        />
                        <ListItemSecondaryAction>
                          {lowTemp ? (
                            <CheckCircleOutlineIcon
                              style={{ fill: "green" }}
                              edge="end"
                            />
                          ) : (
                            <NotInterestedIcon color="error" edge="end" />
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={
                              separate
                                ? "/images/NewOrder/SeparateSelectedCircle.png"
                                : "/images/NewOrder/SeparateUnselectedCircle.png"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Separate"
                          primaryTypographyProps={{
                            style: {
                              color: separate ? "black" : "grey",
                            },
                            variant: "body1",
                          }}
                        />
                        <ListItemSecondaryAction>
                          {separate ? (
                            <CheckCircleOutlineIcon
                              style={{ fill: "green" }}
                              edge="end"
                            />
                          ) : (
                            <NotInterestedIcon color="error" edge="end" />
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={
                              comforter
                                ? "/images/NewOrder/TowelsSelectedCircle.png"
                                : "/images/NewOrder/TowelsUnselectedCircle.png"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Comforter"
                          primaryTypographyProps={{
                            style: {
                              color: comforter ? "black" : "grey",
                            },
                            variant: "body1",
                          }}
                        />
                        <ListItemSecondaryAction>
                          {comforter ? (
                            <CheckCircleOutlineIcon
                              style={{ fill: "green" }}
                              edge="end"
                            />
                          ) : (
                            <NotInterestedIcon color="error" edge="end" />
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                  <CardActions className={classes.cardFooter}>
                    <TooltipButton
                      text={
                        validator.isEmpty(washerPreferences, {
                          ignore_whitespace: true,
                        })
                          ? "N/A"
                          : washerPreferences
                      }
                      className={classes.secondaryButton}
                      buttonText={"View Instructions"}
                      size="small"
                    />
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Card className={classes.root} elevation={5}>
                <CardHeader
                  avatar={
                    <AttachMoneyIcon
                      fontSize="small"
                      style={{ marginBottom: -4 }}
                      htmlColor="white"
                    />
                  }
                  title="Estimated Price"
                  titleTypographyProps={{
                    variant: "h5",
                    style: {
                      color: "white",
                    },
                  }}
                  className={classes.cardHeader}
                />
                {this.renderPriceComponent()}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Review.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(reviewStyles)(Review);
