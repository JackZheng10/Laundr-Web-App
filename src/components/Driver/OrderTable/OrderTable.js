import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  IconButton,
  Paper,
  TableContainer,
  Grid,
  Hidden,
} from "@material-ui/core";
import { withRouter } from "next/router";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import OrderCard from "./components/OrderCard";
import LoadingButton from "../../../components/other/LoadingButton";
import OrderCell from "./components/OrderCell";
import Close from "@material-ui/icons/Close";
import orderTableStyles from "../../../styles/Driver/components/OrderTable/orderTableStyles";
import MainAppContext from "../../../contexts/MainAppContext";

//todo: change snackbars to https://github.com/iamhosseindhv/notistack to make it prettier
//todo: textalign center on snackbar text in case its scrunched
//todo: dialog in window-specific like alert is

class OrderTable extends Component {
  static contextType = MainAppContext;

  state = {
    showActionDialog: false,
    actionDialogTitle: "",
    currentOrder: null,
    showNotification: false,
    notificationMessage: "",
    notificationSuccess: false,
  };

  renderStage = (stage) => {
    switch (stage) {
      case 0:
        return "User Pickup";

      case 1:
        return "Weighing";

      case 2:
        return "Washer Dropoff";

      case 4:
        return "Washer Pickup";

      case 5:
        return "Dropoff";
    }
  };

  renderActions = (stage) => {
    switch (stage) {
      case 0:
        return "Accept";

      case 1:
        return "Enter Weight";

      case 2:
        return "Delivered to Washer";

      case 4:
        return "Accept";

      case 5:
        return "Delivered to User";
    }
  };

  handleActionClicked = (stage, order) => {
    this.setState({ currentOrder: order }, () => {
      switch (stage) {
        case 0:
          this.setState({
            showActionDialog: true,
            actionDialogTitle: "Confirmation",
          });
          break;

        case 1:
          this.setState({
            showActionDialog: true,
            actionDialogTitle: "Enter Weight",
          });
          break;

        case 2:
          this.setState({
            showActionDialog: true,
            actionDialogTitle: "Confirmation",
          });
          break;

        case 4:
          this.setState({
            showActionDialog: true,
            actionDialogTitle: "Confirmation",
          });
          break;

        case 5:
          this.setState({
            showActionDialog: true,
            actionDialogTitle: "Confirmation",
          });
          break;
      }
    });
  };

  renderDialogContent = (classes) => {
    const order = this.state.currentOrder;

    if (order) {
      const status = order.orderInfo.status;
      switch (status) {
        case 0:
          return (
            <React.Fragment>
              <Typography variant="body1">
                Please confirm that you are accepting an order from:&nbsp;
              </Typography>
              <Typography
                variant="body1"
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                {`${order.userInfo.fname} ${order.userInfo.lname}`}
              </Typography>
            </React.Fragment>
          );

        case 1:
          return (
            <React.Fragment>
              <Typography variant="body1">
                Please enter the weight, in pounds, of the order from:&nbsp;
              </Typography>
              <Typography
                variant="body1"
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                {`${order.userInfo.fname} ${order.userInfo.lname}`}
              </Typography>
              <div style={{ textAlign: "center" }}>
                <TextField
                  size="small"
                  margin="normal"
                  variant="outlined"
                  label="Weight"
                  value={this.props.weight}
                  onChange={(event) => {
                    this.props.handleWeightChange(event.target.value);
                  }}
                  className={classes.input}
                  style={{
                    width: 105,
                  }}
                />
                <Typography variant="body2" style={{ color: "red" }}>
                  {this.props.weightErrorMsg}
                </Typography>
              </div>
            </React.Fragment>
          );

        case 2:
          return (
            <React.Fragment>
              <Typography variant="body1">
                Please confirm that you have delivered the order to the washer.
              </Typography>
            </React.Fragment>
          );

        case 4:
          return (
            <React.Fragment>
              <Typography variant="body1">
                Please confirm that you are accepting an order from the
                following user for final delivery:&nbsp;
              </Typography>
              <Typography
                variant="body1"
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                {`${order.userInfo.fname} ${order.userInfo.lname}`}
              </Typography>
            </React.Fragment>
          );

        case 5:
          return (
            <React.Fragment>
              <Typography variant="body1">
                Please confirm that you have delivered the order to:
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

      switch (status) {
        case 0:
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
                  const response = await this.props.handlePickupAccept(
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

        case 1:
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
                onClick={this.handleWeightEntered}
                variant="contained"
                className={classes.mainButton}
              >
                Confirm
              </LoadingButton>
            </React.Fragment>
          );

        case 2:
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
                  const response = await this.props.handleWasherReceived(
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

        case 4:
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
                  const response = await this.props.handleDropoffAccept(
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

        case 5:
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
                  const response = await this.props.handleUserReceived(
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
    this.setState({ showActionDialog: false }, () => {
      const order = this.state.currentOrder;

      if (order.orderInfo.status === 1) {
        //clear weight text field
        this.props.handleWeightChange("");

        //clear any weight errors
        this.props.handleClearWeightError();
      }
    });
  };

  handleWeightEntered = async () => {
    if (this.props.validateWeightMinimum()) {
      //passed weight check, so attempt to charge
      const response_one = await this.props.handleChargeCustomer(
        this.state.currentOrder
      );

      //if charge unsuccessful
      if (!response_one.data.success) {
        if (response_one.data.redirect) {
          this.props.router.push(response_one.data.message);
        } else {
          this.showNotification(
            response_one.data.message,
            response_one.data.success
          );
        }
      } else {
        this.showNotification(
          response_one.data.message,
          response_one.data.success
        );
      }
    }
  };

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
            key={index}
            showNotification={this.showNotification}
          />
        </Grid>
      );
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
          <DialogContent>{this.renderDialogContent(classes)}</DialogContent>
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
                    Name
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Date/Time
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Address
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Phone
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Instructions
                  </TableCell>
                  <TableCell align="left" className={classes.tableHeader}>
                    Load Size
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
