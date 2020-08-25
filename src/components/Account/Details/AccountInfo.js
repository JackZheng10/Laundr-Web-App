import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Card,
  CardContent,
  Divider,
  CardActions,
  Button,
  TextField,
  CardHeader,
} from "@material-ui/core";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import accountInfoStyles from "../../../styles/User/Account/components/accountInfoStyles";

class AccountInfo extends Component {
  render() {
    const { classes, user } = this.props;

    return (
      <React.Fragment>
        <Card className={classes.root} elevation={10}>
          <CardHeader
            title="Profile"
            titleTypographyProps={{
              variant: "h4",
              style: {
                color: "white",
              },
            }}
            className={classes.cardHeader}
          />
          {/* <Divider /> */}
          <CardContent>
            <Grid //main column
              container
              spacing={2}
              justify="center"
            >
              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="First Name"
                  size="small"
                  value={user.fname}
                  className={classes.input}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last Name"
                  size="small"
                  value={user.lname}
                  className={classes.input}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email Address"
                  size="small"
                  value={user.email}
                  className={classes.input}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Phone Number"
                  size="small"
                  value={user.phone}
                  className={classes.input}
                />
              </Grid>
            </Grid>
          </CardContent>
          {/* <Divider /> */}
          <CardActions className={classes.cardFooter}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Button
                  size="medium"
                  variant="contained"
                  className={classes.secondaryButton}
                >
                  Update Password
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="medium"
                  variant="contained"
                  className={classes.secondaryButton}
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
}

AccountInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(accountInfoStyles)(AccountInfo);
