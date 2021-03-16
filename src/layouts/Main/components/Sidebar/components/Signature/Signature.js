import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Typography, Button, colors, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: colors.grey[50],
  },
  media: {
    paddingTop: theme.spacing(2),
    height: 80,
    textAlign: "center",
    "& > img": {
      height: "100%",
      width: "auto",
    },
  },
  content: {
    padding: theme.spacing(1, 2),
  },
  actions: {
    padding: theme.spacing(1, 2),
    display: "flex",
    justifyContent: "center",
  },
}));

const Signature = (props) => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <React.Fragment>
      {/* <Typography variant="body1" align="center" style={{ marginBottom: 2 }}>
        {`© ${new Date().getFullYear()} `}
        <Link
          color="inherit"
          target="_blank"
          rel="noopener"
          href="https://laundr.io/"
        >
          Laundr LLC
        </Link>
      </Typography> */}
      {/* <Typography variant="body2" align="center">
        Made with ❤️ by{" "}
        <Link
          style={{ color: "#01c9e1", fontWeight: "500" }}
          target="_blank"
          rel="noopener"
          href="https://github.com/JackZheng10"
        >
          Jack Zheng
        </Link>
      </Typography> */}
      <Typography
        variant="body1"
        align="center"
        style={{ fontWeight: 500, color: "#01c9e1" }}
      >
        App Version: 1.0
      </Typography>
      <Typography variant="body2" align="center">
        <Link
          style={{ fontWeight: "500", color: "grey" }}
          target="_blank"
          rel="noopener"
          href="/changelog"
        >
          View Changelog
        </Link>
      </Typography>
    </React.Fragment>
  );
};

Signature.propTypes = {
  className: PropTypes.string,
};

export default Signature;
