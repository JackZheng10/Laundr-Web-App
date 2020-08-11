import React, { Component } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
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
import PropTypes from "prop-types";
import TooltipButton from "./components/TooltipButton";
import Close from "@material-ui/icons/Close";
import orderTableStyles from "../../../styles/Driver/components/orderTableStyles";

//todo: change snackbars to https://github.com/iamhosseindhv/notistack to make it prettier
//todo: textalign center on snackbar text in case its scrunched
//todo: dialog in window-specific like alert is

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

  renderDialogContent = () => {
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
                  margin="dense"
                  label="Weight"
                  error={this.props.weightError}
                  helperText={this.props.weightErrorMsg}
                  value={this.props.weight}
                  onChange={(event) => {
                    this.props.handleWeightChange(event.target.value);
                  }}
                  style={{ width: 105 }}
                />
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
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const response = await this.props.handlePickupAccept(
                    this.state.currentOrder
                  );
                  this.showNotification(response.message, response.success);
                }}
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Confirm
              </Button>
            </React.Fragment>
          );

        case 1:
          return (
            <React.Fragment>
              <Button
                onClick={this.handleDialogClose}
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleWeightEntered}
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Confirm
              </Button>
            </React.Fragment>
          );

        case 2:
          return (
            <React.Fragment>
              <Button
                onClick={this.handleDialogClose}
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const response = await this.props.handleWasherReceived(
                    this.state.currentOrder
                  );
                  this.showNotification(response.message, response.success);
                }}
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Confirm
              </Button>
            </React.Fragment>
          );

        case 4:
          return (
            <React.Fragment>
              <Button
                onClick={this.handleDialogClose}
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const response = await this.props.handleDropoffAccept(
                    this.state.currentOrder
                  );
                  this.showNotification(response.message, response.success);
                }}
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Confirm
              </Button>
            </React.Fragment>
          );

        case 5:
          return (
            <React.Fragment>
              <Button
                onClick={this.handleDialogClose}
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const response = await this.props.handleUserReceived(
                    this.state.currentOrder
                  );
                  this.showNotification(response.message, response.success);
                }}
                color="primary"
                variant="contained"
                className={classes.gradient}
              >
                Confirm
              </Button>
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
    if (this.props.handleWeightMinimum()) {
      const response = await this.props.handleChargeCustomer(
        this.state.currentOrder
      );

      //if charge didnt succeed for whatever reason, todo: test w/NO payment method
      if (!response.success) {
        this.showNotification(response.message, response.success);
      } else {
        //otherwise update weight after successful charge
        const response = await this.props.handleWeightEntered(
          this.state.currentOrder
        );

        this.showNotification(response.message, response.success);
      }
    }
  };

  showNotification = (message, success) => {
    //close action dialog first
    this.setState({ showActionDialog: false }, () => {
      //show the notification
      this.setState(
        {
          notificationMessage: message,
          notificationSuccess: success,
          showNotification: true,
        },
        () => {
          //fetch orders after showing notification, so an invalid or valid order disappears
          this.props.fetchOrders();
        }
      );
    });
  };

  renderOrderCells = (orders, classes) => {
    return orders.map((order) => {
      return (
        <TableRow key={order.orderInfo.orderID}>
          <TableCell>
            <div className={classes.nameContainer}>
              <Typography variant="body1" style={{ textAlign: "center" }}>
                {`${order.userInfo.fname} ${order.userInfo.lname}`}
              </Typography>
            </div>
          </TableCell>
          <TableCell>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="flex-start"
              spacing={1}
            >
              <Grid item>
                <Paper elevation={1}>
                  <div className={classes.cardCell}>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      Pickup:&nbsp;
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{ textAlign: "center" }}
                    >{` ${order.pickupInfo.date} @ ${order.pickupInfo.time}`}</Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item>
                <Paper elevation={1}>
                  <div className={classes.cardCell}>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      Dropoff:&nbsp;
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      {` ${order.dropoffInfo.date} @ ${order.dropoffInfo.time}`}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </TableCell>
          <TableCell>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="flex-start"
              spacing={1}
            >
              <Grid item>
                <Paper elevation={1}>
                  <div className={classes.cardCell}>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      User:&nbsp;
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      {order.orderInfo.address}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item>
                <Paper elevation={1}>
                  <div className={classes.cardCell}>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      Washer:&nbsp;
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      {order.washerInfo.address}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </TableCell>
          <TableCell>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="flex-start"
              spacing={1}
            >
              <Grid item>
                <Paper elevation={1}>
                  <div className={classes.cardCell}>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      User:&nbsp;
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      {order.userInfo.phone}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item>
                <Paper elevation={1}>
                  <div className={classes.cardCell}>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      Washer:&nbsp;
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      {order.washerInfo.phone}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </TableCell>
          <TableCell>
            <TooltipButton
              text={order.pickupInfo.prefs}
              className={classes.secondaryButton}
              buttonText={"View"}
            />
          </TableCell>
          <TableCell>placeholder</TableCell>
          <TableCell>
            <Typography variant="body1" style={{ textAlign: "center" }}>
              {this.renderStage(order.orderInfo.status)}
            </Typography>
          </TableCell>
          <TableCell>
            <Button
              variant="contained"
              className={classes.mainButton}
              onClick={() => {
                this.handleActionClicked(order.orderInfo.status, order);
              }}
            >
              {this.renderActions(order.orderInfo.status)}
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  renderOrderCards = (orders, classes) => {
    return orders.map((order) => {
      return (
        <Grid item key={order.orderInfo.orderID}>
          <div className={classes.layout}>
            <Card className={classes.root} elevation={10}>
              <CardHeader
                title={`${order.userInfo.fname} ${order.userInfo.lname}`}
                titleTypographyProps={{
                  variant: "h3",
                  className: classes.title,
                }}
                className={classes.cardHeader}
              />
              <CardContent>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <div className={classes.inlineText}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: 600, color: "#01C9E1" }}
                        gutterBottom
                      >
                        Stage:&nbsp;
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {this.renderStage(order.orderInfo.status)}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <div className={classes.inlineText}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: 600, color: "#01C9E1" }}
                        gutterBottom
                      >
                        Load Size:&nbsp;
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        placeholder
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Paper
                      elevation={1}
                      style={{
                        padding: 5,
                        marginBottom: 10,
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 600,
                          color: "#01C9E1",
                          textAlign: "center",
                        }}
                      >
                        Date/Time
                      </Typography>
                      {/* <div className={classes.inlineText}> */}
                      <Grid container justify="center">
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          Pickup:&nbsp;
                        </Typography>
                        <Typography style={{ textAlign: "center" }}>
                          {` ${order.pickupInfo.date} @ ${order.pickupInfo.time}`}
                        </Typography>
                      </Grid>
                      <Grid container justify="center">
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          Dropoff:&nbsp;
                        </Typography>
                        <Typography style={{ textAlign: "center" }}>
                          {` ${order.dropoffInfo.date} @ ${order.dropoffInfo.time}`}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper
                      elevation={1}
                      style={{
                        padding: 5,
                        marginBottom: 10,
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 600,
                          color: "#01C9E1",
                          textAlign: "center",
                        }}
                      >
                        Address
                      </Typography>
                      <Grid container justify="center">
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          User:&nbsp;
                        </Typography>
                        <Typography style={{ textAlign: "center" }}>
                          {order.orderInfo.address}
                        </Typography>
                      </Grid>
                      <Grid container justify="center">
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          Washer:&nbsp;
                        </Typography>
                        <Typography style={{ textAlign: "center" }}>
                          {order.washerInfo.address}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper
                      elevation={1}
                      style={{
                        padding: 5,
                        marginBottom: 10,
                        textAlign: "center",
                      }}
                    >
                      <Typography style={{ fontWeight: 600, color: "#01C9E1" }}>
                        Phone
                      </Typography>
                      <Grid container justify="center">
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          User:&nbsp;
                        </Typography>
                        <Typography style={{ textAlign: "center" }}>
                          {order.userInfo.phone}
                        </Typography>
                      </Grid>
                      <Grid container justify="center">
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          Washer:&nbsp;
                        </Typography>
                        <Typography style={{ textAlign: "center" }}>
                          {order.washerInfo.phone}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <TooltipButton
                      text={order.pickupInfo.prefs}
                      className={classes.secondaryButton}
                      buttonText={"View Instructions"}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Grid container justify="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      className={classes.mainButton}
                      onClick={() => {
                        this.handleActionClicked(order.orderInfo.status, order);
                      }}
                    >
                      {this.renderActions(order.orderInfo.status)}
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </div>
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
          <DialogTitle>{this.state.actionDialogTitle}</DialogTitle>
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
        <div>
          {/*regular table view*/}
          <Hidden only={["md", "sm", "xs"]}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Date/Time</TableCell>
                    <TableCell align="left">Address</TableCell>
                    <TableCell align="left">Phone</TableCell>
                    <TableCell align="left">Instructions</TableCell>
                    <TableCell align="left">Load Size</TableCell>
                    <TableCell align="left">Stage</TableCell>
                    <TableCell align="left">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{this.renderOrderCells(orders, classes)}</TableBody>
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
                {this.renderOrderCards(orders, classes)}
              </Grid>
            </div>
          </Hidden>
        </div>
      </React.Fragment>
    );
  }
}

OrderTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(orderTableStyles)(OrderTable);
