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
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Head from "next/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainAppContext from "../src/contexts/MainAppContext";
import LoadingButton from "../src/components/other/LoadingButton";
import theme from "../src/theme";
import "../src/styles/borders.css";
import "./login.css";

const useStyles = makeStyles((theme) => ({
  mainButton: {
    backgroundColor: "#FFB600",
    color: "white",
  },
}));

const MyApp = (props) => {
  const { Component, pageProps } = props;
  const isDesktop = useMediaQuery(() => theme.breakpoints.up("lg"), {
    defaultMatches: true,
  });
  const classes = useStyles();

  if (process.env.MAINTENANCE_MODE === "true") {
    return (
      <React.Fragment>
        <Head>
          <title>Maintenance</title>
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <h1>Currently under maintenance (placeholder)</h1>
        </ThemeProvider>
      </React.Fragment>
    );
  }

  const getPageTitle = () => {
    if (typeof window !== "undefined") {
      const path = window.location.href.split("/");
      const directPath = `${path[3]}/${path[4]}`;

      switch (path[3]) {
        case "":
          return "Login";

        case "passwordreset":
          return "Reset Password";

        case "register":
          return "Register";
      }

      switch (directPath) {
        case "account/details":
          return "Account";

        case "account/history":
          return "History";

        case "driver/accepted":
          return "Accepted";

        case "driver/available":
          return "Available";

        case "user/dashboard":
          return "Dashboard";

        case "user/help":
          return "Help";

        case "user/subscription":
          return "Subscription";

        case "washer/assigned":
          return "Assigned";
      }
    }
  };

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

      if (
        path[3] === "" ||
        path[3] === "register" ||
        path[3] === "passwordreset"
      ) {
        return false;
      }
    }

    return true;
  };

  //alert with no confirmation
  const showAlert = (message, callback) => {
    setAlertMessage_NC(message);
    setShowAlertDialog_NC(true);
    setDialogCallback_NC(() => callback);
  };

  const closeAlertDialog_NC = () => {
    setShowAlertDialog_NC(false);
  };

  const closeAlertDialogWithCallback_NC = async () => {
    setShowAlertDialog_NC(false);
    await dialogCallback_NC();
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

  const closeAlertDialogWithCallback_C = async () => {
    setShowAlertDialog_C(false);
    await dialogCallback_C();
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
        <title>{getPageTitle()}</title>
        <meta name="viewport" content="width=device-width" />
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
            <Typography variant="body1" style={{ textAlign: "center" }}>
              {alertMessage_NC}
            </Typography>
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
            <Typography variant="body1" style={{ textAlign: "center" }}>
              {alertMessage_C}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeAlertDialog_C}
              variant="contained"
              style={{ backgroundColor: "#01c9e1", color: "white" }}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={closeAlertDialogWithCallback_C}
              className={classes.mainButton}
              variant="contained"
            >
              Confirm
            </LoadingButton>
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
