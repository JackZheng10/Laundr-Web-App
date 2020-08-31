import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Paper,
  Hidden,
  IconButton,
  withStyles,
  Typography,
  Button,
} from "@material-ui/core";
import { withRouter } from "next/router";
import { getCurrentUser } from "../../../../helpers/session";
import MainAppContext from "../../../../contexts/MainAppContext";
import compose from "recompose/compose";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
import topbarStyles from "../../../../styles/layouts/Main/components/Topbar/topbarStyles";

//for logout confirmation: configure dialog in app.js more

class Topbar extends Component {
  static contextType = MainAppContext;

  handleLogout = () => {
    //will change when cookies
    localStorage.clear();

    this.props.router.push("/login");
  };

  handleRedirectHome = () => {
    const currentUser = getCurrentUser();

    if (currentUser.isWasher) {
      this.props.router.push("/washer/assigned");
    } else if (currentUser.isDriver) {
      this.props.router.push("/driver/available");
    } else if (currentUser.isAdmin) {
      // return <Redirect push to="/placeholder" />;
    } else {
      this.props.router.push("/user/dashboard");
    }
  };

  render() {
    const { className, onSidebarOpen, classes, ...rest } = this.props;

    return (
      <AppBar {...rest} className={clsx(classes.root, className)}>
        <Toolbar>
          <img
            style={{
              height: 60,
              marginLeft: -10,
              cursor: "pointer",
            }}
            alt="Company Logo"
            src="/images/Topbar/LaundrLogo.png"
            onClick={this.handleRedirectHome}
          />
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            <Button
              variant="contained"
              style={{ backgroundColor: "#FFB600", color: "white" }}
              onClick={() => {
                this.context.showAlert_C(
                  "Are you sure you want to sign out?",
                  this.handleLogout
                );
              }}
              startIcon={<InputIcon />}
            >
              Sign Out
            </Button>
          </Hidden>
          <Hidden lgUp>
            <IconButton color="inherit" onClick={onSidebarOpen}>
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
};

export default compose(withRouter, withStyles(topbarStyles))(Topbar);
