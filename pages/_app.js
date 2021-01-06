import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
  Modal,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Head from "next/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainAppContext from "../src/contexts/MainAppContext";
import theme from "../src/theme";
import "../src/styles/borders.css";

const MyApp = (props) => {
  const { Component, pageProps } = props;
  const isDesktop = useMediaQuery(() => theme.breakpoints.up("lg"), {
    defaultMatches: true,
  });

  if (process.env.MAINTENANCE_MODE === "true") {
    return (
      <React.Fragment>
        <Head>
          <title>Laundr</title>
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <h1>Currently under maintenance</h1>
        </ThemeProvider>
      </React.Fragment>
    );
  }

  //loading
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);

  //alert with no confirmation, usage: showAlert(message, callback(optional))
  const [showAlertDialog_NC, setShowAlertDialog_NC] = useState(false);
  const [alertMessage_NC, setAlertMessage_NC] = useState("");
  const [dialogCallback_NC, setDialogCallback_NC] = useState(null);

  //alert with confirmation, usage: showAlert_C(message, callback)
  const [showAlertDialog_C, setShowAlertDialog_C] = useState(false);
  const [alertMessage_C, setAlertMessage_C] = useState("");
  const [dialogCallback_C, setDialogCallback_C] = useState(null);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  //returns true if page could have a sidebar depending on screen size (basically true = youre logged into app)
  const isSidebarPage = () => {
    if (typeof window !== "undefined") {
      const path = window.location.href.split("/");

      if (path[3] === "login" || path[3] === "register") {
        return false;
      }
    }

    return true;
  };

  //alert with no confirmation
  //todo: look into promises, how setstate is chained in hooks, etc. since ideally youd want:
  //dialog to close, THEN callback. alert message and callback set, THEN show dialog
  //todo: await on this? ex: fetchorderinfo in orderstatus
  const showAlert = (message, callback) => {
    setAlertMessage_NC(message);
    setShowAlertDialog_NC(true);
    setDialogCallback_NC(() => callback);
  };

  const closeAlertDialog_NC = () => {
    setShowAlertDialog_NC(false);
  };

  const closeAlertDialogWithCallback_NC = () => {
    setShowAlertDialog_NC(false);
    dialogCallback_NC();
  };

  //alert with confirmation
  const showAlert_C = (message, callback) => {
    setAlertMessage_C(message);
    setShowAlertDialog_C(true);
    setDialogCallback_C(() => callback);
  };

  const closeAlertDialog_C = () => {
    setShowAlertDialog_C(false);
  };

  const closeAlertDialogWithCallback_C = () => {
    setShowAlertDialog_C(false);
    dialogCallback_C();
  };

  //loading
  const showLoading = () => {
    setShowLoadingDialog(true);
  };

  const hideLoading = () => {
    setShowLoadingDialog(false);
  };

  return (
    <React.Fragment>
      <Head>
        <title>Laundr</title>
        {/* <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        /> */}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/*todo: make zindex of this high enough to be able to click out of it if youre also in the middle of loading, also maybe center it inside the component (for sidebar stuff) */}
        {/*also change zindex so scrollbar doesnt disappear */}
        {/*try to center properly, ex: cancel confirmation dialog vs this*/}
        {/*add more configsl like title, buttons, to replace order cancel dialog for example*/}
        {/*ALERT DIALOG*/}
        <Dialog
          open={showAlertDialog_NC}
          onClose={
            dialogCallback_NC
              ? closeAlertDialogWithCallback_NC
              : closeAlertDialog_NC
          }
          aria-labelledby="form-dialog-title"
          style={{
            left: isDesktop && isSidebarPage() ? "13%" : "0%",
            zIndex: 20,
          }}
        >
          <DialogTitle disableTypography>
            <Typography variant="h4" style={{ color: "#01c9e1" }}>
              Alert
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">{alertMessage_NC}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={
                dialogCallback_NC
                  ? closeAlertDialogWithCallback_NC
                  : closeAlertDialog_NC
              }
              variant="contained"
              style={{ backgroundColor: "#FFB600", color: "white" }}
            >
              Okay
            </Button>
          </DialogActions>
        </Dialog>
        {/*ALERT DIALOG w/CONFIRMATION*/}
        <Dialog
          open={showAlertDialog_C}
          onClose={closeAlertDialog_C}
          aria-labelledby="form-dialog-title"
          style={{
            left: isDesktop && isSidebarPage() ? "13%" : "0%",
            zIndex: !isDesktop && isSidebarPage() ? 9999 : 20,
          }}
        >
          <DialogTitle disableTypography>
            <Typography variant="h4" style={{ color: "#01c9e1" }}>
              Confirmation
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">{alertMessage_C}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeAlertDialog_C}
              variant="contained"
              style={{ backgroundColor: "#01c9e1", color: "white" }}
            >
              Cancel
            </Button>
            <Button
              onClick={closeAlertDialogWithCallback_C}
              variant="contained"
              style={{ backgroundColor: "#FFB600", color: "white" }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {/*LOADING DIALOG (for component pages, not fullscreen like login/register. todo: adjust for it should be ez)*/}
        <Dialog
          open={showLoadingDialog}
          PaperProps={{
            style: {
              // backgroundColor: "transparent",
              boxShadow: "none",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              // top: "50%",
              left: isDesktop && isSidebarPage() ? "52%" : "",
            },
          }}
          style={{
            zIndex: 1,
          }}
        >
          <DialogContent>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <Typography style={{ fontWeight: "bold" }} gutterBottom>
                  Loading...
                </Typography>
              </Grid>
              <Grid item style={{ marginBottom: 10 }}>
                <CircularProgress
                  size={50}
                  thickness={5}
                  style={{ color: "rgb(1, 201, 226)" }}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
        <MainAppContext.Provider
          value={{
            showAlert: showAlert,
            showAlert_C: showAlert_C,
            showLoading: showLoading,
            hideLoading: hideLoading,
          }}
        >
          <Component {...pageProps} />
        </MainAppContext.Provider>
      </ThemeProvider>
    </React.Fragment>
  );
};

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
