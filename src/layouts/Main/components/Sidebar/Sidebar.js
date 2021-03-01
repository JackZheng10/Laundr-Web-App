import React, { Component } from "react";
import { Divider, Drawer, withStyles } from "@material-ui/core";
import { Profile, SidebarNav, Signature } from "./components";
import { getCurrentUser } from "../../../../helpers/session";
import clsx from "clsx";
import PropTypes from "prop-types";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import HistoryIcon from "@material-ui/icons/History";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import LocalLaundryServiceIcon from "@material-ui/icons/LocalLaundryService";
import jwtDecode from "jwt-decode";
import sidebarStyles from "../../../../styles/layouts/Main/components/Sidebar/sidebarStyles";

const userPages = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Order History",
    href: "/account/history",
    icon: <HistoryIcon />,
  },
  {
    title: "Subscription",
    href: "/user/subscription",
    icon: <LocalLaundryServiceIcon />,
  },
  {
    title: "Account",
    href: "/account/details",
    icon: <AccountBoxIcon />,
  },
  {
    title: "Help",
    href: "/user/help",
    icon: <HelpOutlineIcon />,
  },
];

const driverPages = [
  {
    title: "Available Orders",
    href: "/driver/available",
    icon: <AssignmentIcon />,
  },
  {
    title: "Accepted Orders",
    href: "/driver/accepted",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    title: "Order History",
    href: "/account/history",
    icon: <HistoryIcon />,
  },
  {
    title: "Account",
    href: "/account/details",
    icon: <AccountBoxIcon />,
  },
];

const washerPages = [
  {
    title: "Assigned Orders",
    href: "/washer/assigned",
    icon: <AssignmentIcon />,
  },
  {
    title: "Order History",
    href: "/account/history",
    icon: <HistoryIcon />,
  },
  {
    title: "Account",
    href: "/account/details",
    icon: <AccountBoxIcon />,
  },
];

const adminPages = [
  {
    title: "placeholder",
    href: "/admin/placeholder",
    icon: <AssignmentIcon />,
  },
];

class Sidebar extends Component {
  handlePagesConfig = (currentUser) => {
    if (!currentUser) {
      return userPages;
    } else if (currentUser.isWasher) {
      return washerPages;
    } else if (currentUser.isDriver) {
      return driverPages;
    } else if (currentUser.isAdmin) {
      return adminPages;
    } else {
      return userPages;
    }
  };

  render() {
    const {
      classes,
      open,
      variant,
      onClose,
      className,
      currentUser,
      ...rest
    } = this.props;

    return (
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        onClose={onClose}
        open={open}
        variant={variant}
      >
        <div {...rest} className={clsx(classes.root, className)}>
          <div>
            <Profile currentUser={currentUser} />
            <Divider className={classes.divider} />
            <SidebarNav
              className={classes.nav}
              pages={this.handlePagesConfig(currentUser)}
            />
          </div>
          <div>
            <Signature />
          </div>
        </div>
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
};

export default withStyles(sidebarStyles)(Sidebar);
