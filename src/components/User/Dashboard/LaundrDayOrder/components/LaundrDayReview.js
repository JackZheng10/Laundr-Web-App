import React, { Component } from "react";
import {
  withStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar
} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import SettingsIcon from "@material-ui/icons/Settings";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
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

  render() {
    const {
      classes,
      address,
      addressPreferences,
      pickupDate,
      pickupTime,
      washerPreferences,
      scented,
      separate,
      comforter,
      lowTemp,
      laundrDayOfWeek,
      recurringPeriod,
    } = this.props;

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const specialInstructionsText = 
      <span><p><b>Washer Preferences: </b>{washerPreferences === "" ? "N/A" : washerPreferences}</p>
      <p><b>Pickup/Dropoff: </b>{addressPreferences === "" ? "N/A" : addressPreferences}</p></span>

    return (
      <React.Fragment>
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
            <Grid
                container
                direction="row"
                spacing={1}
                justify="center"
            >
                <Grid item>
                    <Grid>
                        <Typography variant="body1" style={{ fontWeight: 600, textAlign: "right" }}>
                            Recurring Period:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body1" style={{ fontWeight: 600, textAlign: "right" }}>
                            Day Of Week:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body1" style={{ fontWeight: 600, textAlign: "right" }}>
                            Time:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body1" style={{ fontWeight: 600, textAlign: "right" }}>
                            Next Pickup Date:&nbsp;
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid>
                        <Typography>
                            {recurringPeriod}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography >
                            {daysOfWeek[laundrDayOfWeek]}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography>
                            {pickupTime}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography>
                            {pickupDate}
                        </Typography>
                    </Grid>
                </Grid>
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
            <Grid container justify="center">
                <Grid item>
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
                                lowTemp
                                ? "/images/NewOrder/SeparateSelectedCircle.png"
                                : "/images/NewOrder/SeparateUnselectedCircle.png"
                            }
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary="Low Temp. Dry (Free)"
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
                </Grid>
            </Grid>
            </CardContent> 
            <CardHeader
            title="Special Instructions"
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
                {specialInstructionsText}
            </Typography>
            </CardContent>        
        </Card>
      </React.Fragment>
    );
  }
}

Review.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(reviewStyles)(Review);
