import React, { Component } from "react";
import { Avatar, Typography, withStyles } from "@material-ui/core";
import { getCurrentUser } from "../../../../../../helpers/session";
import clsx from "clsx";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import PersonIcon from "@material-ui/icons/Person";
import LocalLaundryServiceIcon from "@material-ui/icons/LocalLaundryService";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import profileStyles from "../../../../../../styles/layouts/Main/components/Sidebar/components/profileStyles";

class Profile extends Component {
  state = {
    userFname: "N/A",
    userLname: "N/A",
    isWasher: false,
    isDriver: false,
    isAdmin: false,
  };

  componentDidMount = () => {
    const currentUser = getCurrentUser();

    this.setState({
      userFname: currentUser.fname,
      userLname: currentUser.lname,
      isWasher: currentUser.isWasher,
      isDriver: currentUser.isDriver,
      isAdmin: currentUser.isAdmin,
    });
  };

  renderBio = () => {
    if (this.state.isWasher) {
      return "Washer";
    } else if (this.state.isDriver) {
      return "Driver";
    } else if (this.state.isAdmin) {
      return "Admin";
    } else {
      return "User";
    }
  };

  renderAvatarIcon = (classes) => {
    if (this.state.isWasher) {
      return <LocalLaundryServiceIcon className={classes.icon} />;
    } else if (this.state.isDriver) {
      return <DirectionsCarIcon className={classes.icon} />;
    } else if (this.state.isAdmin) {
      return <VpnKeyIcon className={classes.icon} />;
    } else {
      return <PersonIcon className={classes.icon} />;
    }
  };

  render() {
    const { classes, className, ...rest } = this.props;

    return (
      <div {...rest} className={clsx(classes.root, className)}>
        <Avatar alt="Person" className={classes.avatar}>
          {this.renderAvatarIcon(classes)}
        </Avatar>
        <Typography className={classes.name} variant="h4">
          {this.state.userFname} {this.state.userLname}
        </Typography>
        <Typography variant="body2">{this.renderBio()}</Typography>
      </div>
    );
  }
}

Profile.propTypes = {
  className: PropTypes.string,
};

export default withStyles(profileStyles)(Profile);
