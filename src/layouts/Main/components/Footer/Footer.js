import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const Footer = (props) => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {/* <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link
          color="inherit"
          target="_blank"
          rel="noopener"
          href="https://laundr.io/"
        >
          Laundr LLC
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography> */}
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
