import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Button,
  CardActions,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { caughtError, showConsoleError } from "../../../../helpers/errors";
import { withRouter } from "next/router";
import compose from "recompose/compose";
import axios from "axios";
import MainAppContext from "../../../../contexts/MainAppContext";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import orderStatusStyles from "../../../../styles/User/Dashboard/components/OrderStatus/orderStatusStyles";
import TooltipButton from "../../../other/TooltipButton";

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled
//8: fulfilled (user confirmed theyve seen the status on it)

//todo: gold button focus for dropoff and cancel

const moment = require("moment-timezone");
moment.tz.setDefault("America/New_York");

const timeTheme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(1, 203, 225)",
    },
  },
});

class LaundrDayStatus extends Component {
  static contextType = MainAppContext;

  handleLaundrDayCancel = async (laundrDay) => {
    try {
      const response = await axios.delete("/api/order/cancelLaundrDay", {
        params: {
          id: laundrDay._id
        },
        withCredentials: true,
      });

      if (!response.data.success && response.data.redirect) {
        this.props.router.push(response.data.message);
      } else {
        this.context.showAlert(
          response.data.message,
          this.props.fetchOrderInfo
        );
      }
    } catch (error) {
      showConsoleError("cancelling order", error);
      this.context.showAlert(caughtError("cancelling order", error, 99));
    }
  };

  renderCardContent = (laundrDay, classes) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const scented = laundrDay.data.order.scented;
    const lowTemp = laundrDay.data.order.lowTemp;
    const separate = laundrDay.data.order.separate;
    const comforter = laundrDay.data.order.comforter;
    const specialInstructionsText = <span><p><b>Washer Preferences: </b>{laundrDay.data.order.washerPrefs}</p><p><b>Pickup/Dropoff: </b>{laundrDay.data.order.addressPrefs}</p></span>
      
    return (
        <React.Fragment>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            <QueryBuilderIcon fontSize="small" style={{ marginBottom: -4 }} />{" "}
            Recurring Period
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {`Every ${laundrDay.repeatInterval}`}
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            <QueryBuilderIcon fontSize="small" style={{ marginBottom: -4 }} />{" "}
            Day of the Week
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {daysOfWeek[moment(laundrDay.data.order.pickupDate).day()]}
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            <QueryBuilderIcon fontSize="small" style={{ marginBottom: -4 }} />{" "}
            Time
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {laundrDay.data.order.pickupTime}
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            <HomeRoundedIcon fontSize="small" style={{ marginBottom: -4 }} />{" "}
            Address
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {laundrDay.data.order.address}
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            <LocalMallIcon fontSize="small" style={{ marginBottom: -4 }} />{" "}
            Preferences
          </Typography>
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
            <Typography variant="body1" style={{ fontWeight: 500 }}>
              Special Instructions
            </Typography>
            <TooltipButton          
                text={specialInstructionsText}
                className={classes.secondaryButton}
                buttonText={"View"}
            />
        </React.Fragment>
      );
  };

  render() {
    const { classes, laundrDay } = this.props;

    return (
      <React.Fragment>
        <div className={classes.layout}>
          <div className={classes.root}>
            <CardContent id="orderStatusContainer">
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="center"
                style={{ position: "relative" }}
              >
                <Grid item>
                  <Card className={classes.infoCard} elevation={10}>
                    <CardHeader
                      title={`Your Next Laundr Day: ${moment(laundrDay.nextRunAt).add(1, 'days').format('MM/DD/YYYY')}`}
                      titleTypographyProps={{
                        variant: "h4",
                        style: {
                          color: "white",
                        },
                      }}
                      className={classes.cardHeader}
                    />
                    {/* <Divider /> */}
                    <CardContent>
                      {this.renderCardContent(laundrDay, classes)}
                    </CardContent>
                    {/* <Divider /> */}
                    <CardActions className={classes.cardFooter}>
                      <Button
                        size="medium"
                        variant="contained"
                        className={
                            classes.mainButton
                        }
                        onClick={() => {
                         this.context.showAlert_C(
                            "Are you sure you want to cancel your Laundr Day?",
                            () => {
                                this.handleLaundrDayCancel(laundrDay);
                            }
                        );
                        }}
                      >
                        {"Cancel"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

LaundrDayStatus.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withRouter, withStyles(orderStatusStyles))(LaundrDayStatus);
