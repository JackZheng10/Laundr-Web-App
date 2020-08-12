/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { List, ListItem, Button, colors } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  item: {
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
  const { pages, className, ...rest } = props;

  const classes = useStyles();

  const evaluateActive = (href) => {
    if (typeof window !== "undefined") {
      const path = window.location.href.split("/");
      if (`/${path[3]}/${path[4]}` === href) {
        return "#01c9e1";
      }
    }

    return "#6b6b6b";
  };

  return (
    <List {...rest} className={clsx(classes.root, className)}>
      {pages.map((page, index) => (
        <ListItem className={classes.item} disableGutters key={index}>
          <Link href={page.href}>
            <Button
              className={classes.button}
              style={{ color: evaluateActive(page.href) }}
            >
              <div
                className={classes.icon}
                style={{ color: evaluateActive(page.href) }}
              >
                {page.icon}
              </div>
              {page.title}
            </Button>
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired,
};

export default SidebarNav;
