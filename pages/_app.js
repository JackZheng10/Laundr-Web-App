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

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [dialogCallback, setDialogCallback] = useState(null);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const isSidebarPage = () => {
    if (typeof window !== "undefined") {
      const path = window.location.href.split("/");
      if (path[3] === "login" || path[3] === "register") {
        return false;
      }
    }

    return true;
  };

  const closeAlertDialog = () => {
    if (typeof window !== "undefined") {
      const path = window.location.href.split("/");
      // if (`/${path[3]}/${path[4]}` === "login" || ) {
      //   return false;
      // }
      console.log(path);
    }
    setShowAlertDialog(false);
  };

  const closeAlertDialogCallback = () => {
    setShowAlertDialog(false);
    dialogCallback();
  };

  //takes a callback to be executed when alert is dismissed
  //todo: look into promises, how setstate is chained in hooks, etc. since ideally youd want:
  //dialog to close, THEN callback. alert message and callback set, THEN show dialog
  //todo: await on this? ex: fetchorderinfo in orderstatus
  const showAlert = (message, callback) => {
    setAlertMessage(message);
    setShowAlertDialog(true);
    setDialogCallback(() => callback);
  };

  const showLoading = () => {
    setShowLoadingDialog(true);
  };

  const hideLoading = () => {
    setShowLoadingDialog(false);
  };

  return (
    <React.Fragment>
      <Head>
        <title>Laundr Test</title>
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
          open={showAlertDialog}
          onClose={dialogCallback ? closeAlertDialogCallback : closeAlertDialog}
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
            <Typography variant="body1">{alertMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={
                dialogCallback ? closeAlertDialogCallback : closeAlertDialog
              }
              variant="contained"
              style={{ backgroundColor: "#01c9e1", color: "white" }}
            >
              Okay
            </Button>
          </DialogActions>
        </Dialog>
        {/*LOADING DIALOG (for component pages, not fullscreen)*/}
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
              left: isDesktop ? "52%" : "",
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
                <Typography gutterBottom>Loading...</Typography>
              </Grid>
              <Grid item>
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
