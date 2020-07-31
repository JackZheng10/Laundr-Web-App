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
  constructor(props) {
    super(props);

    let currentUser = getCurrentUser();

    this.state = {
      userFname: currentUser.fname,
      userLname: currentUser.lname,
      isWasher: currentUser.isWasher,
      isDriver: currentUser.isDriver,
      isAdmin: currentUser.isAdmin,
    };
  }

  handleBio = () => {
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
    const { className, ...rest } = this.props;
    const classes = this.props.classes;

    let bio = this.handleBio();

    return (
      <div {...rest} className={clsx(classes.root, className)}>
        <Avatar alt="Person" className={classes.avatar}>
          {this.renderAvatarIcon(classes)}
        </Avatar>
        <Typography className={classes.name} variant="h4">
          {this.state.userFname} {this.state.userLname}
        </Typography>
        <Typography variant="body2">{bio}</Typography>
      </div>
    );
  }
}

Profile.propTypes = {
  className: PropTypes.string,
};

export default withStyles(profileStyles)(Profile);
