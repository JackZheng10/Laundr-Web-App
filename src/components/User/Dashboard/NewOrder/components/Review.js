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
import TooltipButton from "../../../../Driver/OrderTable/components/TooltipButton";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import CreateIcon from "@material-ui/icons/Create";
import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
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

  evaluateWhitespace = (text) => {
    if (!text.replace(/\s/g, "").length) {
      return true;
    }

    return false;
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
      towelsSheets,
      loads,
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
          alignItems="center"
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
                        this.evaluateWhitespace(addressPreferences)
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
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              spacing={1}
              direction="column"
              justify="space-evenly"
              alignItems="stretch"
            >
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
                              delicates
                                ? "/images/NewOrder/DelicatesSelectedCircle.png"
                                : "/images/NewOrder/DelicatesUnselectedCircle.png"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Delicates"
                          primaryTypographyProps={{
                            style: {
                              color: delicates ? "black" : "grey",
                            },
                            variant: "body1",
                          }}
                        />
                        <ListItemSecondaryAction>
                          {delicates ? (
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
                              towelsSheets
                                ? "/images/NewOrder/TowelsSelectedCircle.png"
                                : "/images/NewOrder/TowelsUnselectedCircle.png"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Towels and Sheets"
                          primaryTypographyProps={{
                            style: {
                              color: towelsSheets ? "black" : "grey",
                            },
                            variant: "body1",
                          }}
                        />
                        <ListItemSecondaryAction>
                          {towelsSheets ? (
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
                        this.evaluateWhitespace(washerPreferences)
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
                    <ConfirmationNumberIcon
                      fontSize="small"
                      style={{ marginBottom: -4 }}
                      htmlColor="white"
                    />
                  }
                  title="Coupon Code"
                  titleTypographyProps={{
                    variant: "h5",
                    style: {
                      color: "white",
                    },
                  }}
                  className={classes.cardHeader}
                />
                <CardContent className={classes.removePadding}>
                  <div style={{ display: "flex" }}>
                    <TextField
                      label="Code"
                      variant="outlined"
                      size="small"
                      className={classes.input}
                    />
                    {/*todo: to be changed when functionality added, typing in something atm breaks it*/}
                    <Button
                      className={classes.secondaryButton}
                      variant="contained"
                      size="small"
                      onClick={() => {
                        alert("work in progress");
                      }}
                      style={{ marginLeft: 10 }}
                    >
                      Apply
                    </Button>
                  </div>
                  <Grid container justify="center">
                    <Typography
                      variant="h4"
                      style={{ fontWeight: 600, marginTop: 10 }}
                    >
                      Estimated cost:&nbsp;
                    </Typography>
                    {/*todo: factor in sub stuff + overage stuff etc?*/}
                    <Typography
                      variant="h4"
                      style={{ textAlign: "center", marginTop: 10 }}
                    >
                      ${loads * 12 * 1.5}.00
                    </Typography>
                  </Grid>
                </CardContent>
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
