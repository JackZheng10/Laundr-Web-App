import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  IconButton,
  Grid,
  Paper,
  TableContainer,
  Hidden,
} from "@material-ui/core";
import { withRouter } from "next/router";
import LoadingButton from "../../../components/other/LoadingButton";
import compose from "recompose/compose";
import Close from "@material-ui/icons/Close";
import OrderCell from "./components/OrderCell";
import OrderCard from "./components/OrderCard";
import orderTableStyles from "../../../styles/Driver/components/OrderTable/orderTableStyles";

class OrderTable extends Component {
  state = {
    showActionDialog: false,
    actionDialogTitle: "",
    currentOrder: null,
    showNotification: false,
    notificationMessage: "",
    notificationSuccess: false,
  };

  renderStage = (stage) => {
    if (stage === 3) {
      return "Washing";
    }
  };

  renderActions = (stage) => {
    if (stage === 3) {
      return "Done";
    }
  };

  handleActionClicked = (stage, order) => {
    this.setState({ currentOrder: order }, () => {
      if (stage === 3) {
        this.setState({
          showActionDialog: true,
          actionDialogTitle: "Confirmation",
        });
      }
    });
  };

  renderOrderCells = (orders) => {
    return orders.map((order, index) => {
      return (
        <OrderCell
          order={order}
          actionText={this.renderActions(order.orderInfo.status)}
          action={() => {
            this.handleActionClicked(order.orderInfo.status, order);
          }}
          stage={this.renderStage(order.orderInfo.status)}
          prefs={this.renderWasherPrefs(order)}
          key={index}
        />
      );
    });
  };

  renderOrderCards = (orders) => {
    return orders.map((order, index) => {
      return (
        <Grid item>
          <OrderCard
            order={order}
            actionText={this.renderActions(order.orderInfo.status)}
            action={() => {
              this.handleActionClicked(order.orderInfo.status, order);
            }}
            stage={this.renderStage(order.orderInfo.status)}
            prefs={this.renderWasherPrefs(order)}
            key={index}
          />
        </Grid>
      );
    });
  };

  renderDialogContent = () => {
    const order = this.state.currentOrder;

    if (order) {
      const status = order.orderInfo.status;

      if (status === 3) {
        return (
          <React.Fragment>
            <Typography variant="body1">
              Please confirm that you have finished washing the order from:
            </Typography>
            <Typography
              variant="body1"
              style={{ fontWeight: 600, textAlign: "center" }}
            >
              {`${order.userInfo.fname} ${order.userInfo.lname}`}
            </Typography>
          </React.Fragment>
        );
      }
    }
  };

  renderDialogActions = (classes) => {
    const order = this.state.currentOrder;

    if (order) {
      const status = order.orderInfo.status;

      if (status === 3) {
        return (
          <React.Fragment>
            <Button
              onClick={this.handleDialogClose}
              variant="contained"
              className={classes.secondaryButton}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={async () => {
                const response = await this.props.handleWasherDone(
                  this.state.currentOrder
                );

                if (!response.data.success && response.data.redirect) {
                  this.props.router.push(response.data.message);
                } else {
                  this.showNotification(
                    response.data.message,
                    response.data.success
                  );
                }
              }}
              variant="contained"
              className={classes.mainButton}
            >
              Confirm
            </LoadingButton>
          </React.Fragment>
        );
      }
    }
  };

  handleDialogClose = () => {
    this.setState({ showActionDialog: false });

    const order = this.state.currentOrder;

    if (order.orderInfo.status === 1) {
      //clear weight text field
      this.props.handleWeightChange("");
    }
  };

  renderWasherPrefs = (order) => {
    const scented = order.washerInfo.scented;
    const delicates = order.washerInfo.delicates;
    const separate = order.washerInfo.separate;
    const towelsSheets = order.washerInfo.towelsSheets;

    let prefs = "";

    if (scented) {
      prefs += "Scented, ";
    }

    if (delicates) {
      prefs += "Delicates, ";
    }

    if (separate) {
      prefs += "Separate, ";
    }

    if (towelsSheets) {
      prefs += "Towels and Sheets,";
    }

    //todo: test this, forget what it does lol
    if (towelsSheets) {
      prefs = prefs.slice(0, prefs.length - 1);
    } else {
      prefs = prefs.slice(0, prefs.length - 2);
    }

    return prefs;
  };

  //todo: make this the order for every one of these snackbars!
  showNotification = (message, success) => {
    //close action dialog first
    this.setState({ showActionDialog: false }, async () => {
      //refetch orders, so an invalid or valid order disappears
      await this.props.refreshPage(this.props.page, this.props.limit);

      //show the notification from setting the order as washed, potentially along with an error message from the above order fetching
      this.setState({
        notificationMessage: message,
        notificationSuccess: success,
        showNotification: true,
      });
    });
  };

  render() {
    const { classes, orders } = this.props;

    return (
      <React.Fragment>
        {/*actions + notifications*/}
        <Dialog
          open={this.state.showActionDialog}
          onClose={this.handleDialogClose}
        >
          <DialogTitle disableTypography>
            <Typography variant="h4" style={{ color: "#01c9e1" }}>
              {this.state.actionDialogTitle}
            </Typography>
          </DialogTitle>
          <DialogContent>{this.renderDialogContent()}</DialogContent>
          <DialogActions>{this.renderDialogActions(classes)}</DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={this.state.showNotification}
          autoHideDuration={10000}
          onClose={(event, reason) => {
            if (reason !== "clickaway") {
              this.setState({ showNotification: false });
            }
          }}
          message={this.state.notificationMessage}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => {
                  this.setState({ showNotification: false });
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
          ContentProps={{
            style: {
              backgroundColor: this.state.notificationSuccess ? "green" : "red",
            },
          }}
        />
        {/*table*/}
        {/*regular table view*/}
        <Hidden only={["md", "sm", "xs"]}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" className={classes.tableHeader}>
                    ID
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Date/Time
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    User Phone
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Instructions
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Preferences
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Weight
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Stage
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.renderOrderCells(orders)}</TableBody>
            </Table>
          </TableContainer>
        </Hidden>
        {/*card view*/}
        <Hidden only={["xl", "lg"]}>
          <div style={{ padding: 16 }}>
            <Grid
              container
              spacing={4}
              direction="row"
              justify="center"
              alignItems="center"
            >
              {this.renderOrderCards(orders)}
            </Grid>
          </div>
        </Hidden>
      </React.Fragment>
    );
  }
}

OrderTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withRouter, withStyles(orderTableStyles))(OrderTable);
