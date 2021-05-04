import React, { Component } from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";
import { withRouter } from "next/router";
import compose from "recompose/compose";
import LoadingButton from "../other/LoadingButton";

const errorPageStyles = (theme) => ({
  mainButton: {
    backgroundColor: "#FFB600",
    color: "white",
    marginBottom: -10,
  },
});

const ErrorPage = (props) => {
  const { classes, text } = props;

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item>
        <div style={{ maxWidth: 700 }}>
          <Typography variant="h2" gutterBottom style={{ textAlign: "center" }}>
            {text}
          </Typography>
        </div>
      </Grid>
      <Grid item>
        <LoadingButton
          onClick={() => props.router.push("/")}
          className={classes.mainButton}
          variant="contained"
        >
          Return to Home
        </LoadingButton>
      </Grid>
      <Grid item>
        <img
          alt="Sad Laundry Penguin"
          src="/images/SadPenguin.png"
          style={{ height: "auto", width: 300 }}
        />
      </Grid>
    </Grid>
  );
};

export default compose(withRouter, withStyles(errorPageStyles))(ErrorPage);
