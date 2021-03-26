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
import TooltipButton from "../../../../Driver/OrderTable/components/TooltipButton";
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
    const { currentUser, classes, loads, scented, tumbleDry, delicates, separate, comforter } = this.props;

    const priceMultiplier =
      currentUser.subscription.status === "active" &&
      currentUser.subscription.plan === "Family"
        ? 1.2
        : 1.5;
    const balance = parseFloat(this.props.balance.slice(1));
    const subtotal = loads * 18 * priceMultiplier;

      let preferencesCost = 0;
      if (separate == true) {
        preferencesCost += 5;
      }
      if (comforter == true) {
        preferencesCost += 5;
      }

      let addOnCost = 0;
      if (delicates == true) {
        addOnCost += 2;
      }

    if (
      currentUser.subscription.status != "active" &&
      currentUser.subscription.lbsLeft <= 0
    ) {
      const balanceDiscount = subtotal >= balance ? balance : subtotal;

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
              {(scented || tumbleDry || separate || comforter) && (
              <ListItem>
                <ListItemText
                  primary={"Preferences"}
                  secondary={
                    <div>
                        {scented ? <div>Scented (Free)</div> : null}
                        {tumbleDry ? <div>Low Temp. Tumble Dry (Free)</div> : null}
                        {separate ? <div>Separate (+$5)</div> : null}
                        {comforter ? <div>Added Comforter (+$5)</div> : null}
                    </div>
                  }
                  primaryTypographyProps={{ variant: "h6" }}
                />

                <Typography variant="body1">
                   ${preferencesCost.toFixed(2)}
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
                    ${(subtotal - balanceDiscount + preferencesCost + addOnCost).toFixed(2)}
                  </Typography>
                </Grid>
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
        subtotal - subLbsDiscount >= balance
          ? balance
          : subtotal - subLbsDiscount;

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
              {subLbsUsed > 0 && (
                <ListItem>
                  <ListItemText
                    primary={"Subscription Lbs"}
                    secondary={`${subLbsUsed} lbs`}
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
               {(scented || tumbleDry || separate || comforter) && (
              <ListItem>
                <ListItemText
                  primary={"Preferences"}
                  secondary={
                    <div>
                        {scented ? <div>Scented (Free)</div> : null}
                        {tumbleDry ? <div>Low Temp. Tumble Dry (Free)</div> : null}
                        {separate ? <div>Separate (+$5)</div> : null}
                        {comforter ? <div>Added Comforter (+$5)</div> : null}
                    </div>
                  }
                  primaryTypographyProps={{ variant: "h6" }}
                />

                <Typography variant="body1">
                   ${preferencesCost.toFixed(2)}
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
                    ${(subtotal - subLbsDiscount - balanceDiscount + preferencesCost + addOnCost).toFixed(2)}
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
      delicates,
      separate,
      comforter,
      tumbleDry,
      loads,
      currentUser,
    } = this.props;

    return (
      <React.Fragment>
        <Grid
          container
          direction="row"
          spacing={1}
        >
          <Grid item xs={12} sm={7}>
            <Card classname={classes.root} elevation={5}>
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
              {/* <CardActions className={classes.cardFooter}>
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
              </CardActions> */}
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
                      primary="Scented (Free)"
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
                          tumbleDry
                            ? "/images/NewOrder/SeparateSelectedCircle.png"
                            : "/images/NewOrder/SeparateUnselectedCircle.png"
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Low Temp. Tumble Dry (Free)"
                      primaryTypographyProps={{
                        style: {
                          color: tumbleDry ? "black" : "grey",
                        },
                        variant: "body1",
                      }}
                    />
                    <ListItemSecondaryAction>
                      {tumbleDry ? (
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
                      primary="Separate (+$5)"
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
                      primary="Added Comforter (+$5)"
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
                  <Divider variant="inset" component="li" />
                </List>
              </CardContent>
              {/* <CardActions className={classes.cardFooter}>
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
              </CardActions> */}
              
            </Card>
          </Grid>
          {/* <Grid item xs={1}>
            <Divider orientation="vertical"/>
          </Grid> */}
          <Grid item xs={12} sm={5}>
            <Card classname={classes.root} elevation={5}>
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
      </React.Fragment>
    );
  }
}

Review.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(reviewStyles)(Review);
