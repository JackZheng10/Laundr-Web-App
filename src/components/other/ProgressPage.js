import React from "react";
import { Grid, Typography, CircularProgress } from "@material-ui/core";

const ProgressPage = (props) => {
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item>
        <CircularProgress
          size={50}
          thickness={5}
          style={{ color: "rgb(1, 201, 226)" }}
        />
      </Grid>
    </Grid>
  );
};

export default ProgressPage;
