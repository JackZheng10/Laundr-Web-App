import React from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import { BottomBorderBlue } from "../../src/utility/borders";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import { caughtError, showConsoleError } from "../../src/helpers/errors";
import { Layout } from "../../src/layouts";
import PropTypes from "prop-types";
import axios from "axios";
import MainAppContext from "../../src/contexts/MainAppContext";
import historyStyles from "../../src/styles/User/Account/historyStyles";

const Help = (props) => {
  const { classes } = props;

  return (
    <Layout>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center" /*main page column*/
        style={{
          paddingTop: 10,
          backgroundColor: "#01C9E1",
        }}
      >
        <Grid item>
          <Typography
            variant="h1"
            className={classes.componentName}
            gutterBottom
          >
            Help
          </Typography>
        </Grid>
      </Grid>
      <div style={{ position: "relative", marginBottom: 70 }}>
        <BottomBorderBlue />
      </div>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <h1>accord</h1>
        </Grid>
      </Grid>
    </Layout>
  );
};

Help.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(historyStyles)(Help);
