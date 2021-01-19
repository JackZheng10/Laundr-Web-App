import React, { Component } from "react";
import { Avatar, Typography, withStyles } from "@material-ui/core";
import { getCurrentUser } from "../../../../../../helpers/session";
import { GetServerSideProps } from "next";
import clsx from "clsx";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import PersonIcon from "@material-ui/icons/Person";
import LocalLaundryServiceIcon from "@material-ui/icons/LocalLaundryService";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import profileStyles from "../../../../../../styles/layouts/Main/components/Sidebar/components/profileStyles";

class Profile extends Component {
  renderBio = (currentUser) => {
    if (!currentUser) {
      return "";
    } else if (currentUser.isWasher) {
      return "Washer";
    } else if (currentUser.isDriver) {
      return "Driver";
    } else if (currentUser.isAdmin) {
      return "Admin";
    } else {
      return "Customer";
    }
  };

  renderAvatarIcon = (classes, currentUser) => {
    if (!currentUser) {
      return <PersonIcon className={classes.icon} />;
    } else if (currentUser.isWasher) {
      return <LocalLaundryServiceIcon className={classes.icon} />;
    } else if (currentUser.isDriver) {
      return <DirectionsCarIcon className={classes.icon} />;
    } else if (currentUser.isAdmin) {
      return <VpnKeyIcon className={classes.icon} />;
    } else {
      return <PersonIcon className={classes.icon} />;
    }
  };

  render() {
    const { classes, className, currentUser, ...rest } = this.props;

    return (
      <div {...rest} className={clsx(classes.root, className)}>
        <Avatar alt="Person" className={classes.avatar}>
          {this.renderAvatarIcon(classes, currentUser)}
        </Avatar>
        <Typography className={classes.name} variant="h4">
          {currentUser ? currentUser.fname : ""}{" "}
          {currentUser ? currentUser.lname : ""}
        </Typography>
        <Typography variant="body2">{this.renderBio(currentUser)}</Typography>
      </div>
    );
  }
}

Profile.propTypes = {
  className: PropTypes.string,
};

export default withStyles(profileStyles)(Profile);
