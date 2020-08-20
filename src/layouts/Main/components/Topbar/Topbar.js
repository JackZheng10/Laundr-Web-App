import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Badge,
  Hidden,
  IconButton,
  withStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
import topbarStyles from "../../../../styles/layouts/Main/components/Topbar/topbarStyles";

class Topbar extends Component {
  constructor(props) {
    super(props);

    this.state = { notifications: [], logout: false };
  }

  handleLogout = () => {
    localStorage.clear();

    this.setState({ logout: true });
  };

  render() {
    const { className, onSidebarOpen, ...rest } = this.props;
    const classes = this.props.classes;

    if (this.state.logout) {
      return <Redirect push to="/login" />;
    }

    return (
      <AppBar {...rest} className={clsx(classes.root, className)}>
        <Toolbar>
          <img
            style={{
              height: 60,
              marginLeft: -10,
            }}
            alt="Company Logo"
            src="/images/Topbar/LaundrLogo.png"
          />
          <div className={classes.flexGrow} />
          <IconButton color="inherit">
            <Badge
              badgeContent={this.state.notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={this.handleLogout}
          >
            <InputIcon />
          </IconButton>
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

export default withStyles(topbarStyles)(Topbar);
