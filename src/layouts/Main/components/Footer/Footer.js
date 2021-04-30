import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Typography,
  Paper,
  Hidden,
  Link as MUILink,
  IconButton,
  Divider,
} from "@material-ui/core";
import Link from "next/link";
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
        <div style={{ marginTop: 25 }}>
          <Divider />
          <div className={classes.footer}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item className={classes.item}>
                <Grid container direction="column" alignItems="center">
                  <Typography variant="h5">Customer Care</Typography>
                  <Link href="/user/help" passHref={true}>
                    <Typography
                      variant="h6"
                      style={{
                        color: "#01c9e1",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      FAQ
                    </Typography>
                  </Link>
                  <MUILink
                    variant="h6"
                    target="_blank"
                    rel="noopener"
                    href="https://www.laundr.io/contact"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                    }}
                  >
                    Contact
                  </MUILink>
                  <MUILink
                    variant="h6"
                    target="_blank"
                    rel="noopener"
                    href="https://www.laundr.io/about"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                    }}
                  >
                    About
                  </MUILink>
                </Grid>
              </Grid>
              <Grid item className={classes.item}>
                <Grid container direction="column" alignItems="center">
                  <Typography variant="h5">Laundr Bombs</Typography>
                  <MUILink
                    variant="h6"
                    target="_blank"
                    rel="noopener"
                    href="https://laundr.io/shop"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                    }}
                  >
                    Shop
                  </MUILink>
                  <MUILink
                    variant="h6"
                    target="_blank"
                    rel="noopener"
                    href="https://laundr.io"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                    }}
                  >
                    Learn More
                  </MUILink>
                </Grid>
              </Grid>
              <Grid item className={classes.item}>
                <Grid
                  container
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <MUILink
                      href="https://play.google.com/store/apps/details?id=app.laundr2.main&hl=en_US&gl=US"
                      target="_blank"
                      rel="noopener"
                    >
                      <img
                        src="/images/google-play.svg"
                        height={40}
                        width={135}
                      />
                    </MUILink>
                  </Grid>
                  <Grid item>
                    <MUILink
                      href="https://apps.apple.com/us/app/laundr-on-demand/id1289150426"
                      target="_blank"
                      rel="noopener"
                    >
                      <img
                        src="/images/app-store-white.svg"
                        height={40}
                        width={121}
                      />
                    </MUILink>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Hidden only={["xs"]}>
              <Grid container justify="center">
                <Grid item>
                  <MUILink
                    variant="h6"
                    target="_blank"
                    rel="noopener"
                    href="https://www.laundr.io/termsofservice"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                      margin: 20,
                    }}
                  >
                    Terms of Service
                  </MUILink>
                  <MUILink
                    variant="h6"
                    target="_blank"
                    rel="noopener"
                    href="https://www.laundr.io/privacy-policy"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                      margin: 20,
                    }}
                  >
                    Privacy Policy
                  </MUILink>
                  <Typography variant="body3" style={{ padding: 20 }}>
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
                  <MUILink
                    variant="h6"
                    target="_blank"
                    rel="noopener"
                    href="https://www.laundr.io/termsofservice"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                      margin: 20,
                    }}
                  >
                    Terms of Service
                  </MUILink>
                  <MUILink
                    variant="h6"
                    target="_blank"
                    rel="noopener"
                    href="https://www.laundr.io/privacy-policy"
                    style={{
                      color: "#01c9e1",
                      textAlign: "center",
                      margin: 20,
                    }}
                  >
                    Privacy Policy
                  </MUILink>
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid item>
                  <Typography variant="body3" style={{ padding: 20 }}>
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
        </div>
      </React.Fragment>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string,
};

export default withStyles(footerStyles)(Footer);
