import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Typography,
  Paper,
  Hidden,
  Link,
  IconButton,
} from "@material-ui/core";
import PropTypes from "prop-types";
import footerStyles from "../../../../../src/styles/layouts/Main/components/FooterStyles";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import TwitterIcon from "@material-ui/icons/Twitter";

class Footer extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <div className={classes.footer}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item className={classes.item}>
              <Grid container direction="column" alignItems="center">
                <Typography variant="h5">Customer Care</Typography>
                <Typography variant="h6" align="center">
                  <Link
                    target="_blank"
                    rel="noopener"
                    href="/user/help"
                    color="secondary"
                  >
                    FAQ
                  </Link>
                </Typography>
                <Typography variant="h6" align="center">
                  <Link
                    target="_blank"
                    rel="noopener"
                    href="https://www.laundr.io/contact"
                    color="secondary"
                  >
                    Contact
                  </Link>
                </Typography>
                <Typography variant="h6" align="center">
                  <Link
                    target="_blank"
                    rel="noopener"
                    href="https://www.laundr.io/about"
                    color="secondary"
                  >
                    About
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <Grid item className={classes.item}>
              <Grid container direction="column" alignItems="center">
                <Typography variant="h5">Laundr Careers</Typography>
                <Typography variant="h6" align="center">
                  <Link
                    target="_blank"
                    rel="noopener"
                    href="https://linktr.ee/laundrofficial"
                    color="secondary"
                  >
                    Join the Operations Team
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <Grid item className={classes.item}>
              <Paper>
                <Grid container justify="center">
                  <Link
                    href="https://linktr.ee/laundrofficial"
                    target="_blank"
                    rel="noopener"
                    color="secondary"
                    variant="h3"
                    style={{ padding: 10 }}
                  >
                    Get the Laundr App
                  </Link>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Hidden only={["xs"]}>
            <Grid container justify="center">
              <Grid item>
                <Link
                  target="_blank"
                  rel="noopener"
                  href="https://www.laundr.io/termsofservice"
                  color="secondary"
                  style={{ padding: 20 }}
                >
                  Terms of Service
                </Link>
                <Link
                  target="_blank"
                  rel="noopener"
                  href="https://www.laundr.io/privacy-policy"
                  color="secondary"
                  style={{ padding: 20 }}
                >
                  Privacy Policy
                </Link>
                <Typography variant="b" style={{ padding: 20 }}>
                  Copyright Laundr LLC, {new Date().getFullYear()}
                </Typography>
                <IconButton
                  color="secondary"
                  target="_blank"
                  rel="noopener"
                  href="https://www.facebook.com/laundrofficial"
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  target="_blank"
                  rel="noopener"
                  href="https://www.instagram.com/laundrofficial"
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  target="_blank"
                  rel="noopener"
                  href="https://www.twitter.com/laundrofficial"
                >
                  <TwitterIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Hidden>
          <Hidden only={["lg", "xl", "md", "sm"]}>
            <Grid container justify="center">
              <Grid item>
                <Link
                  target="_blank"
                  rel="noopener"
                  href="https://www.laundr.io/termsofservice"
                  color="secondary"
                  style={{ padding: 20 }}
                >
                  Terms of Service
                </Link>
                <Link
                  target="_blank"
                  rel="noopener"
                  href="https://www.laundr.io/privacy-policy"
                  color="secondary"
                  style={{ padding: 20 }}
                >
                  Privacy Policy
                </Link>
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Grid item>
                <Typography variant="b" style={{ padding: 20 }}>
                  Copyright Laundr LLC, {new Date().getFullYear()}
                </Typography>
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Grid item>
                <IconButton
                  target="_blank"
                  rel="noopener"
                  color="secondary"
                  href="https://www.facebook.com/laundrofficial"
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  target="_blank"
                  rel="noopener"
                  color="secondary"
                  href="https://www.instagram.com/laundrofficial"
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  target="_blank"
                  rel="noopener"
                  color="secondary"
                  href="https://www.twitter.com/laundrofficial"
                >
                  <TwitterIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Hidden>
        </div>
      </React.Fragment>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string,
};

export default withStyles(footerStyles)(Footer);
