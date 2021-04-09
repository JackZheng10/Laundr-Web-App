/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { useState, useContext } from "react";
import { List, ListItem, Button, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { handleLogout } from "../../../../../../helpers/session";
import clsx from "clsx";
import PropTypes from "prop-types";
import Link from "next/link";
import InputIcon from "@material-ui/icons/Input";
import MainAppContext from "../../../../../../contexts/MainAppContext";

const useStyles = makeStyles((theme) => ({
  root: {},
  item: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
  },
  logout: {
    justifyContent: "center",
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    padding: "10px 8px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    fontWeight: theme.typography.fontWeightMedium,
  },
  icon: {
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(1),
  },
  active: {
    color: "#21d0e5",
    fontWeight: theme.typography.fontWeightMedium,
    "& $icon": {
      color: "#21d0e5",
    },
  },
}));

const SidebarNav = (props) => {
  const context = useContext(MainAppContext);

  const { pages, className, ...rest } = props;
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const evaluateActive = (href) => {
    if (typeof window !== "undefined") {
      const path = window.location.href.split("/");
      if (`/${path[3]}/${path[4]}` === href) {
        return "#01c9e1";
      }
    }

    return "#6b6b6b";
  };

  const logout = async () => {
    const response = await handleLogout();

    if (!response.data.success) {
      if (response.data.redirect) {
        router.push(response.data.message);
      } else {
        context.showAlert(response.data.message);
      }
    } else {
      router.push("/");
    }
  };

  return loading ? null : (
    <List {...rest} className={clsx(classes.root, className)}>
      {pages.map((page, index) => (
        <ListItem className={classes.item} disableGutters key={index}>
          {/* <Link href={page.href}> */}
          <Button
            className={classes.button}
            style={{ color: evaluateActive(page.href) }}
            onClick={() => router.push(page.href)}
          >
            <div
              className={classes.icon}
              style={{ color: evaluateActive(page.href) }}
            >
              {page.icon}
            </div>
            {page.title}
          </Button>
          {/* </Link> */}
        </ListItem>
      ))}
      <Hidden lgUp>
        <ListItem className={classes.logout} disableGutters>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#FFB600",
              color: "white",
              marginTop: 10,
            }}
            startIcon={<InputIcon />}
            onClick={() => {
              context.showAlert_C("Are you sure you want to sign out?", logout);
            }}
          >
            Sign Out
          </Button>
        </ListItem>
      </Hidden>
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired,
};

export default SidebarNav;
