import React from "react";
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
  Button,
  Tooltip,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  Fade,
} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import CreateIcon from "@material-ui/icons/Create";
import SettingsIcon from "@material-ui/icons/Settings";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import DateRangeIcon from "@material-ui/icons/DateRange";
import PropTypes from "prop-types";
import reviewStyles from "../../../../../../styles/User/Dashboard/components/NewOrder/components/reviewStyles";

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

class Review extends React.Component {
  constructor(props) {
    super(props);

    this.state = { openAddressPrefs: false, openWasherPrefs: false };
  }

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
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <Grid
          container
          spacing={1}
          direction="row"
          alignItems="center"
          justify="space-evenly"
        >
          <Grid item xs={12} sm={6}>
            <Grid
              container
              spacing={1}
              direction="column"
              justify="space-evenly"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <Card className={classes.root} variant="outlined">
                  <CardContent className={classes.removePadding}>
                    <Typography>
                      <HomeRoundedIcon
                        fontSize="small"
                        style={{ marginBottom: -4 }}
                      />{" "}
                      Address
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {this.props.address}
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <LightTooltip
                        title={
                          this.evaluateWhitespace(this.props.addressPreferences)
                            ? "N/A"
                            : this.props.addressPreferences
                        }
                        open={this.state.openAddressPrefs}
                        placement="left"
                        TransitionComponent={Fade}
                        onClose={this.handleAddressPrefsClose}
                        onOpen={this.handleAddressPrefsOpen}
                        arrow
                      >
                        <Button
                          style={{ textTransform: "none" }}
                          variant="outlined"
                          disableTouchRipple
                        >
                          <CreateIcon fontSize="small" />
                          <Typography>&nbsp;View Instructions</Typography>
                        </Button>
                      </LightTooltip>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card className={classes.root} variant="outlined">
                  <CardContent className={classes.removePadding}>
                    <Typography>
                      <DateRangeIcon
                        fontSize="small"
                        style={{ marginBottom: -4 }}
                      />{" "}
                      Pickup Date
                    </Typography>
                    <Typography color="textSecondary">
                      {this.props.pickupDate}
                    </Typography>
                    <Typography>
                      <QueryBuilderIcon
                        fontSize="small"
                        style={{ marginBottom: -4 }}
                      />{" "}
                      Pickup Time
                    </Typography>
                    <Typography color="textSecondary">
                      {this.props.pickupTime}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid
              container
              spacing={1}
              direction="column"
              justify="space-evenly"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <Card className={classes.root} variant="outlined">
                  <CardContent className={classes.removePadding}>
                    <Typography gutterBottom>
                      <SettingsIcon
                        fontSize="small"
                        style={{ marginBottom: -4 }}
                      />{" "}
                      Preferences
                    </Typography>
                    <List dense className={classes.listRoot}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={
                              this.props.scented
                                ? "/images/NewOrder/ScentedSelectedCircle.png"
                                : "/images/NewOrder/ScentedUnselectedCircle.png"
                            }
                            imgProps={{}}
                          />
                        </ListItemAvatar>
                        <ListItemText primary="Scented" />
                        <ListItemSecondaryAction>
                          {this.props.scented ? (
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
                              this.props.delicates
                                ? "/images/NewOrder/DelicatesSelectedCircle.png"
                                : "/images/NewOrder/DelicatesUnselectedCircle.png"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText primary="Delicates" />
                        <ListItemSecondaryAction>
                          {this.props.delicates ? (
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
                              this.props.separate
                                ? "/images/NewOrder/SeparateSelectedCircle.png"
                                : "/images/NewOrder/SeparateUnselectedCircle.png"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText primary="Separate" />
                        <ListItemSecondaryAction>
                          {this.props.separate ? (
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
                              this.props.towelsSheets
                                ? "/images/NewOrder/TowelsSelectedCircle.png"
                                : "/images/NewOrder/TowelsUnselectedCircle.png"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText primary="Towels and Sheets" />
                        <ListItemSecondaryAction>
                          {this.props.towelsSheets ? (
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
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <LightTooltip
                        title={
                          this.evaluateWhitespace(this.props.washerPreferences)
                            ? "N/A"
                            : this.props.washerPreferences
                        }
                        open={this.state.openWasherPrefs}
                        placement="right"
                        TransitionComponent={Fade}
                        onClose={this.handleWasherPrefsClose}
                        onOpen={this.handleWasherPrefsOpen}
                        arrow
                      >
                        <Button
                          style={{ textTransform: "none" }}
                          variant="outlined"
                          disableTouchRipple
                        >
                          <CreateIcon fontSize="small" />
                          <Typography>&nbsp;View Instructions</Typography>
                        </Button>
                      </LightTooltip>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Card className={classes.root} variant="outlined">
                <CardContent className={classes.removePadding}>
                  <div style={{ display: "flex" }}>
                    <TextField
                      label="Coupon Code"
                      variant="outlined"
                      size="small"
                    />
                    {/*todo: to be changed when functionality added, typing in something atm breaks it*/}
                    <Button
                      style={{ textTransform: "none" }}
                      variant="outlined"
                      onClick={() => {
                        alert("Coupon applied (test)");
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography>Estimated cost:&nbsp;</Typography>
                    <Typography> </Typography>
                    <Typography variant="h5">
                      $placeholder{" "}
                      {/*todo: to be changed when functionality added*/}
                    </Typography>
                  </div>
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
